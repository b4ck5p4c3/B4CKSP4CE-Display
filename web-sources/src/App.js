import React from 'react';
import Scripts from "./pages/scripts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Sidebar from "./components/sidebar";
import Frames from "./pages/frames";
import Videos from "./pages/videos";
import DisplayPreview from "./components/displayPreview";


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
        <Route path="/videos" element={<Videos />} />
        <Route path="/" element={<Frames />} />
      </Routes>
    </div>
  </BrowserRouter>
  <DisplayPreview />
</div>
  );
}

export default App;
