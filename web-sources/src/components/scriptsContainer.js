import React, { useState, useEffect, useRef } from 'react';
import ScriptCard from "./script";
import { useFetchScripts } from "../hooks/useFetchScripts";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ScriptsAPI from '../services/scriptsAPI';

const ScriptContainer = ({scripts, setScripts}) => {
    const [removeModalShow, setRemoveModalShow] = useState(false);
    const [removeScriptId, setRemoveScriptId] = useState(null);

    const getScriptById = (id) => {
        return scripts.find(script => script.id === id);
    }   



    const handleClose = () => {
        setRemoveModalShow(false);
    }


    const handleRemove = () => {
        console.log("Removing script with id: " + removeScriptId);
        ScriptsAPI.remove(removeScriptId).then(() => {
            setRemoveModalShow(false);
            setScripts(scripts.filter(script => script.id !== removeScriptId));
        })
        .catch((error) => {
            console.error("Error removing script: " + error);
        });
    }


    return (
        <div id="scriptsContainer" className="card-group d-inline">
            <Modal show={removeModalShow} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove script {getScriptById(removeScriptId)?.title}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to remove this script?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="outline-danger" onClick={handleRemove}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
            {scripts.map(item => (
                <ScriptCard
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    description={item.description}
                    script={item.script}
                    runInterval={item.runIntervalMs}
                    onRemoveEvent={(id) => { setRemoveModalShow(true); setRemoveScriptId(id); }}
                />
            ))}
        </div>
    );
};

export default ScriptContainer;
