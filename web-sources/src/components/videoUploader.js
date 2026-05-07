import React, {useRef, useState} from 'react';
import VideoAPI from '../services/videoAPI';

const VideoUploader = ({onUploaded}) => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [fps, setFps] = useState(30);
    const [threshold, setThreshold] = useState(80);
    const [playMode, setPlayMode] = useState('LOOP');
    const [progress, setProgress] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const f = e.target.files && e.target.files[0];
        setFile(f || null);
        if (f && !name) {
            setName(f.name.replace(/\.[^.]+$/, ''));
        }
    };

    const reset = () => {
        setFile(null);
        setName('');
        setDescription('');
        setProgress(0);
        setBusy(false);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Choose a file first');
            return;
        }
        setBusy(true);
        setError(null);
        setProgress(0);
        try {
            const created = await VideoAPI.upload({
                file, name, description, fps, threshold, playMode,
                onProgress: setProgress
            });
            if (typeof onUploaded === 'function') onUploaded(created);
            reset();
        } catch (e) {
            setError(e.message || String(e));
            setBusy(false);
        }
    };

    return (
        <div className="col" style={{marginBottom: '20px'}}>
            <div className="input-group" style={{width: '60%', minWidth: '200px', marginBottom: '10px'}}>
                <span className="input-group-text">File</span>
                <input
                    ref={fileInputRef}
                    className="form-control"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={busy}
                />
            </div>
            <div className="input-group" style={{width: '60%', minWidth: '200px', marginBottom: '10px'}}>
                <span className="input-group-text">Name</span>
                <input
                    className="form-control"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={busy}
                />
            </div>
            <div className="input-group" style={{width: '90%', minWidth: '200px', marginBottom: '10px'}}>
                <span className="input-group-text">Description</span>
                <input
                    className="form-control"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={busy}
                />
            </div>
            <div className="row g-2" style={{maxWidth: '700px', marginBottom: '10px'}}>
                <div className="col-auto">
                    <div className="input-group">
                        <span className="input-group-text">FPS</span>
                        <input
                            className="form-control"
                            type="number"
                            min={1}
                            max={60}
                            value={fps}
                            onChange={(e) => setFps(Number(e.target.value))}
                            disabled={busy}
                            style={{width: '90px'}}
                        />
                    </div>
                </div>
                <div className="col-auto">
                    <div className="input-group">
                        <span className="input-group-text">Threshold</span>
                        <input
                            className="form-control"
                            type="number"
                            min={0}
                            max={255}
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            disabled={busy}
                            style={{width: '110px'}}
                        />
                    </div>
                </div>
                <div className="col-auto">
                    <div className="input-group">
                        <span className="input-group-text">Mode</span>
                        <select
                            className="form-select"
                            value={playMode}
                            onChange={(e) => setPlayMode(e.target.value)}
                            disabled={busy}
                        >
                            <option value="LOOP">Loop</option>
                            <option value="ONCE">Once</option>
                        </select>
                    </div>
                </div>
            </div>
            {busy && (
                <div className="progress" style={{maxWidth: '700px', marginBottom: '10px', height: '20px'}}>
                    <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        style={{width: `${progress}%`}}
                    >
                        {progress < 100 ? `Uploading ${progress}%` : 'Transcoding...'}
                    </div>
                </div>
            )}
            {error && (
                <div className="alert alert-danger py-1 px-2" style={{maxWidth: '700px', marginBottom: '10px'}}>
                    {error}
                </div>
            )}
            <button
                className="btn btn-success"
                type="button"
                style={{marginTop: '10px'}}
                onClick={handleUpload}
                disabled={busy || !file}
            >
                Upload
            </button>
        </div>
    );
};

export default VideoUploader;
