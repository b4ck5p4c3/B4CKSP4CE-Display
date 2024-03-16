import React from "react";
import Backend, {fetchRequest} from "./apiConfig";

const ScriptsAPI = {
    create: async (name, description, script, runIntervalMs) => {
        return await fetchRequest(Backend.script.create(), 'POST', {
            name: name,
            description: description,
            script: script,
            runIntervalMs: runIntervalMs
        });
    },
    run: async (scriptId) => {
        return await fetchRequest(Backend.script.run(scriptId), 'POST');
    },
    update: async (scriptId, script) => {
        return await fetchRequest(Backend.script.update(scriptId), 'PUT', script);
    },
    get: async () => {
        return await fetchRequest(Backend.script.get(), 'GET');
    },
    active: async () => {
        return await fetchRequest(Backend.script.active(), 'GET');
    }
}

export default ScriptsAPI;

