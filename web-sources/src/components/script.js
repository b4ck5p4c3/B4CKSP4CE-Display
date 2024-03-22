import React, {useRef, useState} from "react";
import CodeEditor from "./codeEditor";
import ScriptsAPI from "../services/scriptsAPI";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlay, faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import Console from "./console";


const ScriptCard = ({ id, title, description, script, runInterval, onRemoveEvent }) => {

    const [scriptName, setScriptName] = useState(title);
    const [scriptDescription, setScriptDescription] = useState(description);
    const [editorHidden, setEditorHidden] = useState(true);
    const [overviewHidden, setOverviewHidden] = useState(false);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

    const editorRef = useRef(null);
    const consoleRef = useRef(null);


    const onRunScript = async () => {
      await ScriptsAPI.run(id).then(
        consoleRef.current.connectToStdout(id)
      );
    };

    const saveAndRunScript = async () => {
      await onSaveScript()
      .then(onRunScript());
    }

  const onSaveScript = async () => {
    if (editorRef==null || editorRef.current==null){
      console.error("editorRef is null");
      return;
    }
    setSaveButtonDisabled(true);
    let scriptData = {
        name: scriptName,
        description: scriptDescription,
        script: editorRef.current.getScriptCode(),
        runIntervalMs: editorRef.current.getRunInterval(),
    };
    await ScriptsAPI.update(id, scriptData).catch((error) => {
      unlockSaveButton();
    });
  };

  const unlockSaveButton = async () => {
    setSaveButtonDisabled(false);
  }

  const switchToEditor = () => {
    setEditorHidden(false);
    setOverviewHidden(true);
    editorRef.current.activate();
  };

  const switchToOverview = () => {
    setEditorHidden(true);
    setOverviewHidden(false); 
  }
  
  
  return (
    <div
    className="card scriptCard"
    style={{
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
      marginBottom: 20
    }}
    name="scriptCard"
    tabIndex={-1}
    >
    <div className="card-header">
      <ul className="nav nav-tabs card-header-tabs">
        <li className="nav-item">
          <div
            className="btn-group"
            role="group"
            style={{ borderRadius: 0 }}
            name="controlButtons"
          >
            <button
              className={`btn btn-primary ${!overviewHidden ? "nav-link active" : ""}`} 
              type="button"
              style={{ borderRadius: "6px 0px 0px 0px" }}
              name="overviewButton"
              onClick={switchToOverview}
            >
              Overview
            </button>
            <button
              className={`btn btn-primary ${!editorHidden ? "nav-link active" : ""}`}
              type="button"
              style={{ borderRadius: "0px 6px 0px 0px" }}
              name="scriptEditorButton"
              onClick={switchToEditor}
            >
              Code
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div className="card-body" name="overview" hidden={overviewHidden}>
      <div>
        <div className="row">
          <div
            className="col"
            style={{
              padding: 2,
              maxWidth: 45,
              borderRightWidth: 1,
              borderRightColor: "gray"
            }}
          >
            <button
              className="btn btn-success"
              type="button"
              style={{ marginBottom: 3, width: 40 }}
              name="runScriptButton"
                onClick={onRunScript}
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              style={{ marginBottom: 3, width: 40 }}
              onClick={() => onRemoveEvent(id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
              className={`btn btn-secondary ${saveButtonDisabled ? "disabled" : ""}`}
              type="button"
              name="saveScriptButton"
              style={{ width: 40 }}
              disabled={saveButtonDisabled}
              onClick={onSaveScript}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
          <div className="col">
            <div className="row">
              <div className="col">
                <input
                  className="no-borders-input"
                  type="text"
                  style={{ fontSize: "x-large", width: "100%" }}
                  defaultValue={title}
                  name="title"
                  onChange={(e) => {setScriptName(e.target.value);
                    unlockSaveButton();
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col" style={{ height: 80 }}>
                <textarea
                  className="no-borders-input"
                  name="description"
                  style={{ width: "100%", height: "100%" }}
                  defaultValue={description}
                  onChange={(e) => {setScriptDescription(e.target.value);
                    unlockSaveButton();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div hidden={editorHidden} >
      <div className="card-body" name="codeEditorFrame">
        <CodeEditor
            ref={editorRef}
            runInterval={runInterval}
            script={script} 
            saveEventHandler={onSaveScript}
            runEventHandler={saveAndRunScript}
            />
            <Console 
              ref={consoleRef}
            />
      </div>
    </div>
    <input type="text" name="id" hidden="true" defaultValue={id} />
  </div>
  );
};

 
export default ScriptCard;