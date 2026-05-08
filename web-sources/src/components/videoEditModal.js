import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import VideoAPI from "../services/videoAPI";

const PLAY_MODES = ["LOOP", "ONCE"];

const VideoEditModal = ({video, onClose, onSaved}) => {
    const [name, setName] = useState("");
    const [fps, setFps] = useState(30);
    const [playMode, setPlayMode] = useState("LOOP");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (video) {
            setName(video.name || "");
            setFps(video.fps || 30);
            setPlayMode(video.playMode || "LOOP");
            setError(null);
        }
    }, [video]);

    if (!video) return null;

    const handleSave = async () => {
        const fpsNum = Number(fps);
        if (!Number.isFinite(fpsNum) || fpsNum <= 0) {
            setError("FPS must be a positive number");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const updated = await VideoAPI.update(video.id, {
                name: name.trim(),
                fps: fpsNum,
                playMode
            });
            if (typeof onSaved === "function" && updated) onSaved(updated);
            onClose();
        } catch (e) {
            setError(String(e));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit video</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger py-2 px-3 small">{error}</div>}
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            disabled={saving}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">FPS (playback rate)</label>
                        <input
                            type="number"
                            className="form-control"
                            min={1}
                            max={120}
                            step={1}
                            value={fps}
                            disabled={saving}
                            onChange={(e) => setFps(e.target.value)}
                        />
                        <div className="form-text">
                            Changes playback speed. The transcoded frame count stays the same.
                        </div>
                    </div>
                    <div className="mb-2">
                        <label className="form-label">Play mode</label>
                        <select
                            className="form-select"
                            value={playMode}
                            disabled={saving}
                            onChange={(e) => setPlayMode(e.target.value)}
                        >
                            {PLAY_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose} disabled={saving}>Cancel</Button>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VideoEditModal;
