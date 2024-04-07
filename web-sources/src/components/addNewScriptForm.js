import React, {useState} from 'react';
import ScriptsAPI from '../services/scriptsAPI';
import RunIntervalSelector from './runInterval';

const AddNewScriptForm = ({ onAddedEvent }) => {
    const [newScriptName, setNewScriptName] = useState('');
    const [newScriptDescription, setNewScriptDescription] = useState('');
    const [newScriptRunInterval, setNewScriptRunInterval] = useState(50);

    const handleAddClick = () => {
        ScriptsAPI.create(newScriptName, newScriptDescription, "", newScriptRunInterval)
        .then((response) => {
            onAddedEvent(response);
        });
    };

    return (
        <div className="col" style={{ marginBottom: '20px' }}>
            <div className="input-group" style={{ width: '60%', minWidth: '200px', marginBottom: '10px' }}>
                <span className="input-group-text">Name</span>
                <input
                    className="form-control"
                    type="text"
                    value={newScriptName}
                    onChange={(e) => setNewScriptName(e.target.value)}
                />
            </div>
            <div className="input-group" style={{ width: '90%', minWidth: '200px', marginBottom: '10px' }}>
                <span className="input-group-text">Description</span>
                <input
                    className="form-control"
                    type="text"
                    value={newScriptDescription}
                    onChange={(e) => setNewScriptDescription(e.target.value)}
                />
            </div>

                <RunIntervalSelector runInterval={newScriptRunInterval} setRunInterval={setNewScriptRunInterval} />
            <button className="btn btn-success" type="button" style={{ marginTop: '10px' }} onClick={handleAddClick}>Add!</button>
        </div>
    );
};

export default AddNewScriptForm;
