import React from "react";


const Backend = {
    autoSaveMinInterval: 30,
    baseUrl: 'http://127.0.0.1:8080/api',
    websocketBase: 'http://127.0.0.1:8080/ws',
    script:
      {
          create: () => `${Backend.baseUrl}/script`,
          run: (scriptId) => `${Backend.baseUrl}/script/${scriptId}/run`,
          update: (scriptId) => `${Backend.baseUrl}/script/${scriptId}`,
          get: () => `${Backend.baseUrl}/script`,
          active: () => `${Backend.baseUrl}/script/active`,
          remove: (scriptId) => `${Backend.baseUrl}/script/${scriptId}`
      },
  headers: {
        'Content-Type': 'application/json'
    }
 }

 const fetchRequest = async (url, method, body = null) => {
    const options = {
        method: method,
        headers: Backend.headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
         const response = await fetch(url, options);
         return await response.json();
     } catch (error) {
         return console.log(error);
     }
};

const fetchNoResponse = async (url, method, body = null) => {
    const options = {
        method: method,
        headers: Backend.headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        await fetch(url, options);
    } catch (error) {
        console.log(error);
    }
};


 export default Backend;
 export { fetchRequest, fetchNoResponse };