import React, { useState, useEffect, useRef } from 'react';
import ScriptCard from "./script";
import { useFetchScripts } from "../hooks/useFetchScripts";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ScriptsAPI from '../services/scriptsAPI';
import DangerModal from "./dangerModal";

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
            <DangerModal
                submitEventHandler={handleRemove}
                closeEventHandler={handleClose}
                headerName={`Remove script ${getScriptById(removeScriptId)?.name}?`}
                bodyText={`Are you sure you want to remove the script ${getScriptById(removeScriptId)?.name}?`}
                submitButtonName="Remove"
                removeModalShow={removeModalShow}
                setRemoveModalShow={setRemoveModalShow}
            />
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
