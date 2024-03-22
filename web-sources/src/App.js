import React, {useEffect, useState} from 'react';
import ScriptContainer from './components/scriptsContainer';
import AddNewScriptForm from './components/addNewScriptForm';
import useFetchScripts from './hooks/useFetchScripts';
import Scripts from "./pages/scripts";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import Sidebar from "./components/sidebar";
import Frames from "./pages/frames";


function App() {


  return (
<div
  className="container-fluid"
  style={{
    '--bs-light': '#ffffff',
    '--bs-light-rgb': '255,255,255'
  }}
>
  <BrowserRouter>
    <div className="row flex-column flex-sm-row wrapper min-vh-100">
      <div className="col-12 col-sm-1 col-md-3 col-xl-1 flex-shrink-1 p-0 bg-dark" >
        <Sidebar />
      </div>
      <Routes>
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/" element={<Frames />} />
      </Routes>
    </div>
  </BrowserRouter>
</div>
  );
}

export default App;
