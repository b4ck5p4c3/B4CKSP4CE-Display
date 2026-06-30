const getBaseUrl = () => !window.backend_url ? window.location.origin : window.backend_url;


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
          updateMetadata: (scriptId) => `${Backend.baseApiUrl}/script/${scriptId}/metadata`,
          get: () => `${Backend.baseApiUrl}/script`,
          active: () => `${Backend.baseApiUrl}/script/active`,
          remove: (scriptId) => `${Backend.baseApiUrl}/script/${scriptId}`
      },
    frame: {
        get: (offset, limit, title) => `${Backend.baseApiUrl}/frame?offset=${offset}&limit=${limit}&title=${title}`,
        create:(activate) => `${Backend.baseApiUrl}/frame?activate=${activate}`,
        activate: (id) => `${Backend.baseApiUrl}/frame/${id}/activate`,
        remove: (id) => `${Backend.baseApiUrl}/frame/${id}`,
        update: (id) => `${Backend.baseApiUrl}/frame/${id}`,
        updateMetadata: (id) => `${Backend.baseApiUrl}/frame/${id}/metadata`
    },
    display: {
        state: () => `${Backend.baseApiUrl}/display/state`
    },
    video: {
        list: () => `${Backend.baseApiUrl}/video`,
        get: (videoId) => `${Backend.baseApiUrl}/video/${videoId}`,
        upload: () => `${Backend.baseApiUrl}/video/upload`,
        update: (videoId) => `${Backend.baseApiUrl}/video/${videoId}`,
        run: (videoId) => `${Backend.baseApiUrl}/video/${videoId}/run`,
        active: () => `${Backend.baseApiUrl}/video/active`,
        remove: (videoId) => `${Backend.baseApiUrl}/video/${videoId}`,
        preview: (videoId, frameIdx) => `${Backend.baseApiUrl}/video/${videoId}/preview/${frameIdx}`
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
         if (response.status === 204) {
             return null;
         }
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