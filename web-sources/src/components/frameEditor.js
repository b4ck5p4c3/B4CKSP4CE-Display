import React, {useEffect, useState} from "react";
import Grid from "./grid";
import {faEraser, faPaintBrush} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import getRandomName from "../hooks/randomNameGenerator";
import FramesAPI from "../services/framesAPI";


function FrameEditor({enableSaving, gridData, setGridData,
                         frameName, setFrameName, width, height,
                     frameId, setFrameId, onSave, activeFrameId, setActiveFrameId}) {


    const [brushActive, setBrushActive] = useState(true);
    const [eraseActive, setEraseActive] = useState(false);
    const [brushSize, setBrushSize] = useState(1);
    const [liveMode, setLiveMode] = useState(true);
    const [isSavingNow, setIsSavingNow] = useState(false);
    const saveMinInterval = 50;


    const saveFrame = () => {
        let savePromise;
        let frame = {
            name: frameName,
            description: getLastEditString(),
            gridBrightnesses: gridData
        };
        if (frameId) {
            savePromise = FramesAPI.update(frameId, frame);
        } else {
            savePromise = FramesAPI.create(frame);
            savePromise.then((response) => {
                console.log("setting frame id: ", response.id);
                setFrameId(response.id);
            });
        }
        savePromise.then((response) => {
            frame.id = response.id;
            activateFrameIfLiveMode();
            onSave(frame);
        });
    }

    const activateFrameIfLiveMode = () => {
        if (frameId!==null && liveMode && activeFrameId !== frameId) {
            FramesAPI.activate(frameId)
                .then(() => {
                    setActiveFrameId(frameId);
                });
        }
    }


    const getLastEditString = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const month = months[now.getMonth()];
        const date = now.getDate();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `Last edited: ${month} ${date}, ${hours}:${minutes}:${seconds}`;
    }

    const createNewFrame = () => {
        setGridData(Array.from({length: height}, () => Array(width).fill(0)));
        setFrameName(getRandomName());
        setFrameId(null);
    }


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key >= '1' && event.key <= '8') {
                const keyValue = parseInt(event.key, 10);
                setBrushSize(keyValue-1);
            } else if (event.key === 'b') {
                activateBrush();
            } else if (event.key === 'c') {
                activateErase();
            }

        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    const activateBrush = () => {
        setBrushActive(true);
        setEraseActive(false);
    }

    const activateErase = () => {
        setBrushActive(false);
        setEraseActive(true);
    }


    const triggerLiveMode = () => {
        if (liveMode) {
            if (isSavingNow) {
                return;
            }
            setIsSavingNow(true);
            setTimeout(() => {
                setIsSavingNow(false);
                saveFrame();
            }, saveMinInterval);
        }
    }


    const handleClick = ({ x, y }) => {
        const newGridData = [...gridData];
        getDrawCoordinates(x, y).forEach(([i, j]) => {
            if (brushActive) {
                newGridData[j][i] = 255;
            } else if (eraseActive) {
                newGridData[j][i] = 0;
            }
        });
        setGridData(newGridData);
        handleChange();
    };

    const handleChange = () => {
        triggerLiveMode();
    }

    const getDrawCoordinates = (x, y) => {
        const coordinates = [];
        const leftOffset = Math.floor(brushSize / 2);
        const rightOffset = Math.ceil(brushSize / 2);
        for (let i = x - leftOffset; i <= x + Math.max(0, rightOffset); i++) {
            for (let j = y - leftOffset; j <= y + Math.max(0, rightOffset); j++) {
                if (i >= 0 && i < width && j >= 0 && j < height) {
                    coordinates.push([i, j]);
                }
            }
        }
        return coordinates;
    }

    return (
        <div>
            <div
                className="col-6"
                style={{
                    marginBottom: '20px',
                    marginTop: '10px'
                }}
            >
                <div className="input-group">
                    <input
                        className="form-control"
                        id="editorFrameName"
                        placeholder="Frame name..."
                        type="text"
                        onChange={(e) => { setFrameName(e.target.value); handleChange(); }}
                        value={frameName}
                    />
                    <button
                        className="btn btn-outline-secondary"
                        onClick={ () => { setFrameName(getRandomName()); }}
                        type="button"
                    >
                        Random
                    </button>
                </div>
            </div>
            <div className="col-12">
                <div className="row">
                    <div
                        className="col-md-6"
                        style={{
                            paddingRight: '12px',
                            width: '420px'
                        }}
                    >
                        <Grid
                            width={width}
                            height={height}
                            cellSize={9}
                            gapSize={1}
                            grid={gridData}
                            onClick={handleClick}
                        />
                    </div>
                    <div
                        className="col d-grid"
                        id="editorTools"
                    >
                        <div
                            className="row"
                        >
                            <div className="col align-self-start">
                                <div className="input-group">
              <span
                  className="input-group-text"
                  style={{
                      background: 'rgb(255,255,255)',
                      borderStyle: 'none'
                  }}
              >
                <FontAwesomeIcon icon={faPaintBrush} />
                <input
                    className="form-range"
                    id="brushSize"
                    max="7"
                    min="0"
                    step="1"
                    style={{
                        marginLeft: '10px'
                    }}
                    type="range"
                    value={brushSize}
                    onChange={(e) => { setBrushSize(parseInt(e.target.value)); }}
                />
              </span>
                                </div>
                                <div
                                    className="btn-group"
                                    role="group"
                                    style={{
                                        marginTop: '10px'
                                    }}
                                >
                                    <button
                                        className={`btn  ${brushActive ? 'btn-primary' : 'btn-outline-primary'}`}
                                        id="brushButton"
                                        onClick={activateBrush}
                                        type="button"
                                    >
                                        <FontAwesomeIcon icon={faPaintBrush} />
                                    </button>
                                    <button
                                        className={`btn  ${eraseActive ? 'btn-primary' : 'btn-outline-primary'}`}
                                        id="eraseButton"
                                        onClick={activateErase}
                                        style={{
                                            marginLeft: '20px'
                                        }}
                                        type="button"

                                    >
                                        <FontAwesomeIcon icon={faEraser} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="row g-0 d-xl-flex"
                            id="stateControlls">
                            <div className="col align-self-end"  hidden={!enableSaving}>
                                <div className="form-check" >
                                    <input
                                        className="form-check-input"
                                        checked={liveMode}
                                        onChange={(e) => { setLiveMode(e.target.checked); }}
                                        id="autoSave"
                                        type="checkbox"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="formCheck-1"
                                    >
                                        Live mode
                                    </label>
                                </div>
                                <button
                                    className="btn btn-primary d-block"
                                    id="newButton"
                                    onClick={createNewFrame}
                                    style={{
                                        marginBottom: '10px'
                                    }}
                                    type="button"
                                >
                                    New
                                </button>
                                <button
                                    className="btn btn-success"
                                    id="saveButton"
                                    onClick={saveFrame}
                                    type="button"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FrameEditor;