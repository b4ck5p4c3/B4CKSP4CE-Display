import * as monaco from 'monaco-editor';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';


const backend = {
    autoSaveMinInterval: 30,
    baseUrl: 'http://127.0.0.1:8080/api',
    websocketBase: 'http://127.0.0.1:8080/ws',
    script:
      {
          create: () => `${backend.baseUrl}/script`,
          run: (scriptId) => `${backend.baseUrl}/script/${scriptId}/run`,
          update: (scriptId) => `${backend.baseUrl}/script/${scriptId}`,
          get: () => `${backend.baseUrl}/script`
      },
  headers: {
        'Content-Type': 'application/json'
    }
 }


let scriptCodeArea = document.getElementById("scriptCode");

const scriptCardTemplate = document.getElementById("scriptCardTemplate");
const scriptsContainer = document.getElementById("scriptsContainer");
const parameterValuesExample = scriptCardTemplate.querySelector("[name='parameterValues']");
const maxParamsPerScript = 3;
const codeEditorHint = "-- Ваш исходный код здесь...";

const newScriptName = document.getElementById("newScriptName");
const newScriptDescription = document.getElementById("newScriptDescription");
const newScriptRunInterval = document.getElementById("newScriptRunInterval");
const addNewScriptButton = document.getElementById("addScriptButton");

let scripts = {};

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.46.0/min/vs' }});




function runScript(scriptId) {
    fetch(backend.script.run(scriptId), {
        method: 'POST',
        headers: backend.headers
    })
    .then(response => response.json())
    .then(data => {
        console.log('Script running:', data);
    })
    .catch((error) => {
        console.error('Error running script:', error);
    });
}

function getScripts() {
    return fetch(backend.script.get(), {
        method: 'GET',
        headers: backend.headers
    })
    .then(response => response.json())
    .then(data => {
        for (let script of data) {
            console.log('Script:', script);
            //script.script = script.script.replace(/\+/g, '%20');
            script.script = script.script;
            console.log('Decoded script:', script.script);
            scripts[script.id] = script;
        }

        return data;
    })
    .catch((error) => {
        console.error('Error getting scripts:', error);
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
    return fetch(backend.script.create(), {
        method: 'POST',
        headers: backend.headers,
        body: JSON.stringify(script)
    })
    .then(response => response.json())
        .catch((error) => {
            console.error('Error saving script:', error);
        }
    );

}

function displayScript(script) {
    scriptCard = scriptCardTemplate.cloneNode(true);
    scriptCard.querySelector("[name='id']").value = script.id;
    scriptCard.removeAttribute("id");
    scriptCard.hidden = false;
    scriptsContainer.appendChild(scriptCard);
    scriptCard.querySelector("[name='title']").value = script.name;
    scriptCard.querySelector("[name='description']").value = script.description;
    let expandButton = scriptCard.querySelector("[name='expand']");
    let hiddenItemsCount = scriptCard.querySelector("[name='hiddenItemsCount']");
    let addButton = scriptCard.querySelector("[name='addButton']");
    let collapseButton = scriptCard.querySelector("[name='collapse']");
    let parametersTableBody = scriptCard.querySelector("[name='parametersTableBody']");
    parametersTableBody.innerHTML = "";
    if (script.parameters!=null) {
        for (let i = 0; i < script.parameters.length; i++) {
            let parameterValue = parameterValuesExample.cloneNode(true);
            let parameters = script.parameters[i];
            if (parameters) {
                if (i > maxParamsPerScript) {
                    parameterValue.hidden = true;
                } else {
                    parameterValue.hidden = false;
                }
                parameterValue.querySelector("[name='alias']").children[0].value = parameters.alias;
                parameterValue.querySelector("[name='name']").children[0].value = parameters.name;
                parameterValue.querySelector("[name='value']").children[0].value = parameters.value;
                parametersTableBody.appendChild(parameterValue);
            }
        }
    }
    if (script.globals==null || script.globals.length<=maxParamsPerScript){
        expandButton.hidden = true;
        hiddenItemsCount.hidden = true;
        addButton.hidden = false;
    }
    collapseButton.hidden = true;
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
    let script;
    if (scripts[scriptId]['editor']!=null){
        script = scripts[scriptId]['editor'].getValue();
    } else {
        script = scripts[scriptId].script;
    }
    console.log('Script:', script);
    name.disabled = true;
    saveButton.disabled = true;
    description.disabled = true;

    fetch(backend.script.update(scriptId), {
        method: 'PUT',
        headers: backend.headers,
        body: JSON.stringify({
            name: name.value,
            description: description.value,
            parameters: [],
            script: script,
            runIntervalMs: scripts[scriptId].runIntervalMs
        })
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
    console.log('Parameters:', parameters);
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
        require(['vs/editor/editor.main'], function () {
            let editor = monaco.editor.create(codeEditor, {
                value: codeEditorHint,
                language: "lua"
            });
            monaco.editor.setTheme('vs-dark');
            let scirptId = card.querySelector("[name='id']").value;
            editor.setValue(scripts[scirptId].script);
            scripts[scirptId].editor = editor;
        });
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

function connectToStdout() {

}

