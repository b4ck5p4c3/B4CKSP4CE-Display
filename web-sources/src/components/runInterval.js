import React from "react";



const RunIntervalSelector = ({runInterval, setRunInterval}) => {

    const checkAndSetScriptRunInterval = (value) => {
        setRunInterval(getValidRunInterval());
      };
    
      const getValidRunInterval = () => {
        return Math.max(18, Math.min(1000000, runInterval));
      };

    return (
        <div className="input-group" style={{ maxWidth: 200 }}>
          <span className="input-group-text">Run interval</span>
          <input
            className="form-control"
            type="text"
            value={runInterval}
            placeholder="Ms"
            name="runInterval"
            min={18}
            max={1000000}
            onChange={(e) => setRunInterval(e.target.value)}
            onBlur={(e) => checkAndSetScriptRunInterval(e.target.value)}
          />
        </div>
    );
}

export default RunIntervalSelector;