import Backend, {fetchRequest, fetchNoResponse} from "./apiConfig";

function base64ToBytes(base64Strings) {
    return base64Strings.map(str => Uint8Array.from(atob(str), c => c.charCodeAt(0)));
}

function bytesArrayToBase64(bytesArrays) {
    return bytesArrays.map(bytes => btoa(String.fromCharCode.apply(null, bytes)));
}

function prepareFrameForRequest(frame) {
    return {
        ...frame,
        gridBrightnesses: bytesArrayToBase64(frame.gridBrightnesses)
    }
}

const FramesAPI = {
    getAll: async (offset, limit, title) => {
        return await fetchRequest(Backend.frame.get(offset, limit, title), 'GET')
            .then(response => {
                for (let i = 0; i < response.length; i++) {
                    response[i].gridBrightnesses = base64ToBytes(response[i].gridBrightnesses);
                }
                return response;
            });
    },
    update: async (id, frame) => {
        return await fetchRequest(Backend.frame.update(id), 'PUT', prepareFrameForRequest(frame));
    },
    create: async (frame, activate = false) => {
        return await fetchRequest(Backend.frame.create(activate), 'POST', prepareFrameForRequest(frame));
    },
    remove: async (id) => {
        return await fetchNoResponse(Backend.frame.remove(id), 'DELETE');
    },
    activate: async (id) => {
        return await fetchNoResponse(Backend.frame.activate(id), 'POST');
    }
}

export default FramesAPI;

