const getBaseUrl = () => window.backend_url === "%BACKEND_URL%" ? "http://127.0.0.1:8080" : window.backend_url;


const baseUrl = getBaseUrl();
const Backend = {
    autoSaveMinInterval: 30,
    baseApiUrl: `${baseUrl}/api`,
    websocketBase: `${baseUrl}/ws`,
    script:
      {
          create: () => `${Backend.baseApiUrl}/script`,
          run: (scriptId) => `${Backend.baseApiUrl}/script/${scriptId}/run`,
          update: (scriptId) => `${Backend.baseApiUrl}/script/${scriptId}`,
          get: () => `${Backend.baseApiUrl}/script`,
          active: () => `${Backend.baseApiUrl}/script/active`,
          remove: (scriptId) => `${Backend.baseApiUrl}/script/${scriptId}`
      },
    frame: {
        get: (offset, limit, title) => `${Backend.baseApiUrl}/frame?offset=${offset}&limit=${limit}&title=${title}`,
        create:(activate) => `${Backend.baseApiUrl}/frame?activate=${activate}`,
        activate: (id) => `${Backend.baseApiUrl}/frame/${id}/activate`,
        remove: (id) => `${Backend.baseApiUrl}/frame/${id}`,
        update: (id) => `${Backend.baseApiUrl}/frame/${id}`
    },
    display: {
        state: () => `${Backend.baseApiUrl}/display/state`
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
        return await fetch(url, options);
    } catch (error) {
        console.log(error);
    }
};


 export default Backend;
 export { fetchRequest, fetchNoResponse };