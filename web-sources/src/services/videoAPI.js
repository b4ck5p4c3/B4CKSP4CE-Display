import Backend, {fetchNoResponse, fetchRequest} from "./apiConfig";

const VideoAPI = {
    list: async () => {
        return await fetchRequest(Backend.video.list(), 'GET');
    },
    get: async (videoId) => {
        return await fetchRequest(Backend.video.get(videoId), 'GET');
    },
    active: async () => {
        return await fetchRequest(Backend.video.active(), 'GET');
    },
    run: async (videoId) => {
        return await fetchRequest(Backend.video.run(videoId), 'POST');
    },
    update: async (videoId, body) => {
        return await fetchRequest(Backend.video.update(videoId), 'PUT', body);
    },
    remove: async (videoId) => {
        return await fetchNoResponse(Backend.video.remove(videoId), 'DELETE');
    },
    preview: async (videoId, frameIdx) => {
        return await fetchRequest(Backend.video.preview(videoId, frameIdx), 'GET');
    },
    upload: ({file, name, description, fps, threshold, playMode, onProgress}) => {
        const form = new FormData();
        form.append('file', file);
        if (name != null) form.append('name', name);
        if (description != null) form.append('description', description);
        if (fps != null) form.append('fps', String(fps));
        if (threshold != null) form.append('threshold', String(threshold));
        if (playMode != null) form.append('playMode', playMode);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', Backend.video.upload(), true);
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && typeof onProgress === 'function') {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        resolve(null);
                    }
                } else {
                    reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText || xhr.statusText}`));
                }
            };
            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.onabort = () => reject(new Error('Upload aborted'));
            xhr.send(form);
        });
    }
};

export default VideoAPI;
