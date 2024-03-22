import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import MonacoEditor from 'react-monaco-editor';
import Console from "./console";
import RunIntervalSelector from "./runInterval";

const CodeEditor = forwardRef(({ runInterval, script,  saveEventHandler, runEventHandler}, ref) => {
    const [scriptCode, setScriptCode] = useState(script);
    const [scriptRunInterval, setScriptRunInterval] = useState(runInterval);

    const [showEditor, setShowEditor] = useState(false);
    const options = {
      selectOnLineNumbers: true
    };

    useImperativeHandle(ref, () => ({
      activate() {
          if (showEditor) return;
          setShowEditor(true);
      },
      getScriptCode(){
        if (scriptCode==null) return "";
        return scriptCode;
      },
      getRunInterval(){
        return scriptRunInterval;
      }


  }));

  const onUpdate = (newValue, e) => {
    setScriptCode(newValue);
  };




    return (
    <div>
      <div className="d-flex">
        <button
          id="saveCodeButton"
          className="btn btn-success"
          type="button"
          style={{ marginRight: 8 }}
          name="saveScriptButton"
          onClick={saveEventHandler}
        >
          <i className="fa fa-save" />
          &nbsp;Save & Run
        </button>
        {/*  */}
        {/*<button*/}
        {/*  id="runCodeButton"*/}
        {/*  className="btn btn-success"*/}
        {/*  type="button"*/}
        {/*  name="runScriptButton"*/}
        {/*  onClick={runEventHandler}*/}
        {/*  style={{ marginRight: 12 }}*/}

        {/*>*/}
        {/*  <i className="fa fa-play" />*/}
        {/*  &nbsp;Run*/}
        {/*</button>*/}
        <RunIntervalSelector runInterval={scriptRunInterval} setRunInterval={setScriptRunInterval} />
      </div>
      <div
        style={{
          height: 500,
          width: "100%",
          background: "var(--bs-body-color)",
          marginTop: 10
        }}
        name="codeEditor"
      >
      {showEditor && (
        <MonacoEditor
          width="100%"
          height="500"
          language="lua"
          value={script}
          options={options}
          onChange={onUpdate}
        />
      )}
      </div>
    </div>
    );
});
export default CodeEditor;