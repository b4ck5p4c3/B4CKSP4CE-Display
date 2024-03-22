import AddNewScriptForm from "../components/addNewScriptForm";
import ScriptContainer from "../components/scriptsContainer";
import React, {useEffect, useState} from "react";
import useFetchScripts from "../hooks/useFetchScripts";
import Sidebar from "../components/sidebar";


function Scripts() {
    const {data, isLoading, error} = useFetchScripts();
    const [scripts, setScripts] = useState([]);


    useEffect(() => {
        if (data) {
            setScripts(data);
        }
    }, [data]);




    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }




    return (
        <div className="col-12 col-sm-11 col-md-9 col-xl-9 bg-light py-3"
             style={{
                 background: 'var(--bs-body-bg)'
             }}>
            <div className="row">
                <AddNewScriptForm
                    onAddedEvent={(newScript) => { setScripts([...scripts, newScript]); console.log(scripts); }}
                />
            </div>
            <div
                className="row"
                style={{
                    height: '60%'
                }}>
                <div className="col">
                    <div>
                        <ScriptContainer
                            scripts={scripts}
                            setScripts={setScripts}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
}


export default Scripts;