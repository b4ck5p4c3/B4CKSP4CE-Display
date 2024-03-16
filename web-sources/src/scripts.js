import * as monaco from 'monaco-editor';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Sidebar from './components/sidebar';
import ScriptsAPI from './services/scriptsAPI';
import Backend from './services/apiConfig';
import React from 'react';
import { render } from 'react-dom';
import ScriptContainer from './components/scriptsContainer';

import { config } from '@fortawesome/fontawesome-svg-core'
console.log(config.autoA11y) // true


render(<App />, document.getElementById('root'));

function App(){
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
        <div
          className="col"
          style={{
            marginBottom: '20px'
          }}
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
            <ScriptContainer />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}