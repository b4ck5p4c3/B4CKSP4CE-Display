import * as monaco from 'monaco-editor';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Sidebar from './components/sidebar';
import ScriptsAPI from './services/scriptsAPI';
import Backend from './services/apiConfig';
import ScriptContainer from './components/scriptsContainer';



let scriptCodeArea = document.getElementById("scriptCode");

const scriptsContainer = document.getElementById("scriptsContainer");
const maxParamsPerScript = 3;
const codeEditorHint = "-- Ваш исходный код здесь...";

const newScriptName = document.getElementById("newScriptName");
const newScriptDescription = document.getElementById("newScriptDescription");
const newScriptRunInterval = document.getElementById("newScriptRunInterval");
const addNewScriptButton = document.getElementById("addScriptButton");


let scripts = {};
let activeScript = null;





ReactDOM.render(<App />, document.getElementById('root'));

function App(){
    return (
        <div class="container-fluid" style="--bs-light: #ffffff;--bs-light-rgb: 255,255,255;">
        <div class="row flex-column flex-sm-row wrapper min-vh-100">
            <div class="col-12 col-sm-1 col-md-3 col-xl-1 flex-shrink-1 p-0 bg-dark"></div>
            <div class="col-12 col-sm-11 col-md-9 col-xl-9 bg-light py-3" style="background: var(--bs-body-bg);">
                <div class="row">
                    <div class="col" style="margin-bottom: 20px;"></div>
                </div>
                <div class="row" style="height: 60%;">
                    <div class="col">
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
function runScript(scriptId) {
    ScriptsAPI.run(scriptId)
    .then(data => {
        activeScript = getScriptCardByScriptId(scriptId);
    });
}

function getScripts() {
    return ScriptsAPI.get()
    .then(data => {
        for (let script of data) {
            script.script = script.script;
            scripts[script.id] = script;
        }

        return data;
    });
}

function displayScripts() {
    getScripts().then(data => {
        for (let script of data) {
            displayScript(script);
        }
    });
}

function createNewScript() {
    addNewScriptButton.disabled = true;
    let script = {
        name: newScriptName.value,
        description: newScriptDescription.value,
        parameters: [],
        script: "",
        runIntervalMs: newScriptRunInterval.value
    }
    createScript(script).then(savedScript => {
        scripts[savedScript.id] = savedScript;
        let scriptCard = displayScript(savedScript);
        scriptCard.focus();
    });
    newScriptName.value = "";
    newScriptDescription.value = "";
    addNewScriptButton.disabled = false;
}

function createScript(script) {
    ScriptsAPI.create(script);
}

function displayScript(script) {
    let scriptCard = scriptCardTemplate.cloneNode(true);
    scriptCard.querySelector("[name='id']").value = script.id;
    scriptCard.removeAttribute("id");
    scriptCard.hidden = false;
    scriptsContainer.appendChild(scriptCard);
    scriptCard.querySelector("[name='title']").value = script.name;
    scriptCard.querySelector("[name='description']").value = script.description;
    scriptCard.querySelector("[name='runInterval']").value = script.runIntervalMs;

    return scriptCard;
}





displayScripts();
  document.addEventListener('click', function(event) {
      console.log(event.target.name);
      let scriptCard = event.target.closest("[name='scriptCard']");
      switch (event.target.name) {
          case 'addButton':
              addParameter(event.target);
              break;
          case 'collapse':
              collapseTable(event.target.closest("[name='tableContainer']"));
              break;
          case 'expand':
              expandTable(event.target.closest("[name='tableContainer']"));
              break;
          case 'scriptEditorButton':
              switchToScriptEditor(scriptCard);
              break;
          case 'overviewButton':
              switchToOverview(scriptCard);
              break;
          case 'saveScriptButton':
                saveScriptOverview(scriptCard);
                break;
          case 'runScriptButton':
                saveScriptOverview(scriptCard);
                runScript(scriptCard.querySelector("[name='id']").value);
      }
  });

document.addEventListener('input', function(event) {
    if (event.target.getAttribute("x-save-trigger") === "true") {
        setSaveButtonState(event.target, true);
    }
});

addNewScriptButton.addEventListener("click", function() {
    createNewScript();
});



  function setSaveButtonState(triggered, enabled){
      let saveButton = triggered.closest("[name='scriptCard']").querySelector("[name='saveScriptButton']");
      saveButton.disabled = !enabled;
      if (enabled){
          saveButton.classList.remove("disabled");
      } else {
            saveButton.classList.add("disabled");
      }

  }

function addParameter(triggredButton ) {
    let parameterValue = parameterValuesExample.cloneNode(true);
    let tablebody = triggredButton.parentElement.parentElement.querySelector("[name='parametersTableBody']");
    parameterValue.hidden = false;
    tablebody.appendChild(parameterValue);
    if (tablebody.children.length > maxParamsPerScript) {
        isCollapseButtonActive(tablebody.closest("[name='tableContainer']"), true);
    }
}


function collapseTable(tableContainer) {
    isShowAllTableItems(tableContainer, false);
}

function expandTable(tableContainer) {
    isShowAllTableItems(tableContainer, true);
}

  var trigger = null;
function saveScriptOverview(scriptCard) {

    let name = scriptCard.querySelector("[name='title']");
    let description = scriptCard.querySelector("[name='description']");
    let saveButton = scriptCard.querySelector("[name='saveScriptButton']");
    let scriptId = scriptCard.querySelector("[name='id']").value;
    let runInterval = scriptCard.querySelector("[name='runInterval']").value;
    let script;
    if (scripts[scriptId]['editor']!=null){
        script = scripts[scriptId]['editor'].getValue();
    } else {
        script = scripts[scriptId].script;
    }

    name.disabled = true;

    description.disabled = true;

    ScriptsAPI.update(scriptId, {
        name: name.value,
        description: description.value,
        parameters: [],
        script: script,
        runIntervalMs: runInterval
    })
    .then(data => {
        saveButton.disabled = true;
    });
    name.disabled = false;
    description.disabled = false;

}

function getParameters(tableBody) {
    let parameters = [];
    tableBody.querySelectorAll("tr").forEach(function (item) {
        let parameter = {
            alias: item.querySelector("[name='alias']").children[0].value,
            name: item.querySelector("[name='name']").children[0].value,
            value: item.querySelector("[name='value']").children[0].value
        }
        parameters.push(parameter);
    });
    return parameters;
}

function setAllInputsDisabled(container, disabled) {
    container.querySelectorAll("input").forEach(function (item) {
        item.disabled = disabled;
    });
}
function isShowAllTableItems(tableContainer, show) {
    let tableBody = tableContainer.querySelector("[name='parametersTableBody']");
    let addButton = tableContainer.querySelector("[name='addButton']");
    let hiddenItemsCount = tableContainer.querySelector("[name='hiddenItemsCount']");
    for (let i = maxParamsPerScript; i < tableBody.children.length; i++) {
        tableBody.children[i].hidden = !show;
    }
    addButton.hidden = !show;
    hiddenItemsCount.hidden = show;
    if (!show) {
        hiddenItemsCount.innerText = tableBody.children.length - maxParamsPerScript + " more";
    }
    isCollapseButtonActive(tableContainer, show);
}

function isCollapseButtonActive(tableContainer, isCollapseActive) {
    let expandButton = tableContainer.querySelector("[name='expand']");
    let collapseButton = tableContainer.querySelector("[name='collapse']");
    if (isCollapseActive) {
        expandButton.hidden = true;
        collapseButton.hidden = false;
    } else {
        expandButton.hidden = false;
        collapseButton.hidden = true;
    }
}

function switchToScriptEditor(card) {
    card.querySelector("[name='overview']").hidden = true;
    card.querySelector("[name='codeEditorFrame']").hidden = false;
    let scriptEditorButton = card.querySelector("[name='scriptEditorButton']");
    let controlButtons = card.querySelector("[name='controlButtons']");
    let codeEditor = card.querySelector("[name='codeEditor']");
    switchActiveButtonInGroup(controlButtons.children, scriptEditorButton);
    if (codeEditor.children.length === 0) {
        let editor = monaco.editor.create(codeEditor, {
            value: codeEditorHint,
            language: "lua"
        });

        monaco.editor.setTheme('vs-dark');
        let scirptId = card.querySelector("[name='id']").value;
        editor.setValue(scripts[scirptId].script);
        scripts[scirptId].editor = editor;
          
    }
}

function switchToOverview(card) {
    card.querySelector("[name='overview']").hidden = false;
    card.querySelector("[name='codeEditorFrame']").hidden = true;
    let overviewButton = card.querySelector("[name='overviewButton']");
    let controlButtons = card.querySelector("[name='controlButtons']");
    switchActiveButtonInGroup(controlButtons.children, overviewButton);
}

function switchActiveButtonInGroup(buttons, activeButton) {
    for (let button of buttons) {
        button.classList.remove("active");
        button.classList.remove("nav-link");
    }
    activeButton.classList.add("active");
    activeButton.classList.add("nav-link");
}


var socket = new SockJS(Backend.websocketBase);
var stompClient = Stomp.over(socket);


function connectToStdout() {
    stompClient.connect({}, function (frame) {
        var url = stompClient.ws._transport.url;
        console.log("Your current session is: " + url);
        stompClient.subscribe("/script/stdout", (message) => {
            if (activeScript == null){
                console.log("No active script");
                return;
            }
            console.log('Message:', message.body);
            let stdoutContainer = JSON.parse(message.body);
            for (let line of stdoutContainer.lines){
                addStdout(line, activeScript);
            }
        });
    
    });
}

function addStdout(message, scriptCard){
    let stdoutContainer = scriptCard.querySelector("[name='stdContainer']");
    let stdoutMessage = document.createElement("p");
    stdoutMessage.classList.add("stdout", "font-monospace");
    if (stdoutContainer.childElementCount == 1){
        stdoutContainer.querySelector("[name='stdoutWelcome']").hidden = true;
    } else if (stdoutContainer.childElementCount > 200){
        stdoutContainer.removeChild(stdoutContainer.firstChild);
    }
    stdoutMessage.hidden = false;
    stdoutMessage.innerText = message;
    stdoutContainer.appendChild(stdoutMessage);
    stdoutContainer.scrollTop = stdoutContainer.scrollHeight;
}

function getScriptCardByScriptId(scriptId){
    let idElements = document.querySelectorAll(`[name='id']`);
    for (let idElement of idElements){
        if (idElement.value === scriptId){
            return idElement.closest("[name='scriptCard']");
        }
    }
}

function getActiveScript(){
    return ScriptsAPI.active();
}

function updateActiveScript(){
    return getActiveScript().then(data => {
        console.log("Active script:", data.id);
        activeScript = getScriptCardByScriptId(data.id);
    });
}
updateActiveScript()
    .then(() => {
        connectToStdout();
    });
