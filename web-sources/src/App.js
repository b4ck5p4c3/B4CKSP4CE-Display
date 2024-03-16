import React, {useEffect, useState} from 'react';
import ScriptContainer from './components/scriptsContainer';
import AddNewScriptForm from './components/addNewScriptForm';
import useFetchScripts from './hooks/useFetchScripts';

function App() {
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
<div
  className="container-fluid"
  style={{
    '--bs-light': '#ffffff',
    '--bs-light-rgb': '255,255,255'
  }}
>
  <div className="row flex-column flex-sm-row wrapper min-vh-100">
    <div className="col-12 col-sm-1 col-md-3 col-xl-1 flex-shrink-1 p-0 bg-dark" />
    <div
      className="col-12 col-sm-11 col-md-9 col-xl-9 bg-light py-3"
      style={{
        background: 'var(--bs-body-bg)'
      }}
    >
      <div className="row">
        <AddNewScriptForm 
          onAddedEvent={(newScript) => { setScripts([...scripts, newScript]); console.log(scripts); }}
        />
      </div>
      <div
        className="row"
        style={{
          height: '60%'
        }}
      >
        <div className="col">
          <div>
            <ScriptContainer 
              scripts={scripts}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default App;
