import React, { useState, useEffect, useRef } from 'react';
import ScriptCard from "./script";
import { useFetchScripts } from "../hooks/useFetchScripts";


const ScriptContainer = ({scripts}) => {


    return (
        <div id="scriptsContainer" className="card-group d-inline">
            {scripts.map(item => (
                <ScriptCard
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    description={item.description}
                    script={item.script}
                    runInterval={item.runIntervalMs}
                />
            ))}
        </div>
    );
};

export default ScriptContainer;
