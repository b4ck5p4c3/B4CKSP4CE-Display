import React, {useState, useEffect, useRef} from "react";
import Grid from "./grid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlay, faTrash, faCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import FramesAPI from "../services/framesAPI";
import CopyIdButton from "./copyIdButton";


const FrameCard = ({id, title, description, grid, editEventHandler, removeEventHandler, onMetadataUpdated}) => {

    const [renaming, setRenaming] = useState(false);
    const [draftName, setDraftName] = useState(title);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!renaming) setDraftName(title);
    }, [title, renaming]);

    useEffect(() => {
        if (renaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [renaming]);

    const playEventHandler = () => {
        FramesAPI.activate(id);
    };

    const startRename = () => {
        setDraftName(title);
        setRenaming(true);
    };

    const cancelRename = () => {
        setRenaming(false);
        setDraftName(title);
    };

    const submitRename = async () => {
        const trimmed = (draftName || "").trim();
        if (!trimmed || trimmed === title) {
            cancelRename();
            return;
        }
        setSaving(true);
        try {
            const updated = await FramesAPI.updateMetadata(id, {name: trimmed});
            if (typeof onMetadataUpdated === "function" && updated) {
                onMetadataUpdated(id, {name: updated.name, description: updated.description});
            }
            setRenaming(false);
        } catch (e) {
            console.error("Failed to rename frame", e);
        } finally {
            setSaving(false);
        }
    };

    const onInputKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitRename();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancelRename();
        }
    };

    return (
        <div className="card m-3">
            <div className="card-header text-center ">
                <button type="button" className="btn btn-success playButton mx-1"
                        onClick={playEventHandler}>
                    <FontAwesomeIcon icon={faPlay}/>
                </button>
                <button type="button" className="btn btn-outline-primary editButton mx-1"
                        onClick={() => {
                            editEventHandler(id, title, description, grid)
                        }}
                        title="Edit pixels"
                >
                    <FontAwesomeIcon icon={faPencil}/>
                </button>
                <CopyIdButton id={id} className="mx-1" size="md"/>
                <button type="button" className="btn btn-outline-danger removeButton mx-1"
                        onClick={removeEventHandler}>
                    <FontAwesomeIcon icon={faTrash}/>
                </button>
            </div>
            <Grid grid={grid} onClick={(a, b) => {}} cellSize={13} gapSize={2}/>
            <div className="card-body">
                {renaming ? (
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <input
                            ref={inputRef}
                            type="text"
                            className="form-control form-control-sm"
                            value={draftName}
                            disabled={saving}
                            onChange={(e) => setDraftName(e.target.value)}
                            onKeyDown={onInputKeyDown}
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                            disabled={saving}
                            onClick={submitRename}
                            title="Save name"
                        >
                            <FontAwesomeIcon icon={faCheck}/>
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            disabled={saving}
                            onClick={cancelRename}
                            title="Cancel"
                        >
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                    </div>
                ) : (
                    <h5
                        className="card-title"
                        style={{cursor: "pointer"}}
                        onClick={startRename}
                        title="Click to rename"
                    >
                        {title || <span className="text-muted">unnamed</span>}
                    </h5>
                )}
                <p className="card-text">
                    {description}
                </p>
            </div>
            <div className="card-body"></div>
        </div>
    );
}

export default FrameCard;
