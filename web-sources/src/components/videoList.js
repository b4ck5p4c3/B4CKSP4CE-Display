import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faTrash, faRotate} from '@fortawesome/free-solid-svg-icons';
import VideoAPI from '../services/videoAPI';
import VideoThumbnail from './videoThumbnail';
import VideoScrubberModal from './videoScrubberModal';

const POLL_MS = 1500;

const formatBytes = (n) => {
    if (!n && n !== 0) return '—';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
    return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const formatDuration = (frameCount, fps) => {
    if (!frameCount || !fps) return '—';
    const sec = frameCount / fps;
    if (sec < 60) return `${sec.toFixed(1)}s`;
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}m ${s}s`;
};

const StatusBadge = ({status, errorMessage}) => {
    const map = {
        UPLOADED: 'secondary',
        TRANSCODING: 'warning',
        READY: 'success',
        FAILED: 'danger'
    };
    const cls = map[status] || 'secondary';
    return (
        <span className={`badge bg-${cls}`} title={errorMessage || ''}>
            {status === 'TRANSCODING' && <FontAwesomeIcon icon={faRotate} spin className="me-1"/>}
            {status}
        </span>
    );
};

const VideoList = ({videos, setVideos, activeVideoId, onActivated}) => {
    const [busyId, setBusyId] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const pollRef = useRef(null);

    const refresh = useCallback(async () => {
        const data = await VideoAPI.list();
        if (Array.isArray(data)) setVideos(data);
    }, [setVideos]);

    useEffect(() => {
        const hasTranscoding = videos.some(v => v.status === 'TRANSCODING');
        if (hasTranscoding && !pollRef.current) {
            pollRef.current = setInterval(refresh, POLL_MS);
        }
        if (!hasTranscoding && pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
        };
    }, [videos, refresh]);

    const handleRun = async (id) => {
        setBusyId(id);
        try {
            await VideoAPI.run(id);
            if (typeof onActivated === 'function') onActivated(id);
        } catch (e) {
            console.error(e);
        } finally {
            setBusyId(null);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Remove this video?')) return;
        setBusyId(id);
        try {
            await VideoAPI.remove(id);
            setVideos(videos.filter(v => v.id !== id));
        } catch (e) {
            console.error(e);
        } finally {
            setBusyId(null);
        }
    };

    if (!videos.length) {
        return <div className="text-muted">No videos yet — upload one above.</div>;
    }

    const sorted = [...videos].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return (
        <div className="table-responsive">
            <table className="table table-sm align-middle">
                <thead>
                <tr>
                    <th style={{width: '140px'}}>Preview</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>FPS</th>
                    <th>Frames</th>
                    <th>Duration</th>
                    <th>Size</th>
                    <th>Mode</th>
                    <th style={{width: '160px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sorted.map(v => (
                    <tr key={v.id} className={v.id === activeVideoId ? 'table-success' : ''}>
                        <td>
                            {v.status === 'READY' && v.frameCount > 0 ? (
                                <VideoThumbnail
                                    videoId={v.id}
                                    frameCount={v.frameCount}
                                    frameIdx={0}
                                    cellSize={3}
                                    onClick={() => setPreviewVideo(v)}
                                />
                            ) : (
                                <span className="text-muted small">—</span>
                            )}
                        </td>
                        <td>
                            <div className="fw-semibold">{v.name || <span className="text-muted">unnamed</span>}</div>
                            {v.originalFilename && (
                                <div className="text-muted small">{v.originalFilename}</div>
                            )}
                        </td>
                        <td><StatusBadge status={v.status} errorMessage={v.errorMessage}/></td>
                        <td>{v.fps || '—'}</td>
                        <td>{v.frameCount || '—'}</td>
                        <td>{formatDuration(v.frameCount, v.fps)}</td>
                        <td>{formatBytes(v.originalSizeBytes)}</td>
                        <td><span className="badge bg-light text-dark">{v.playMode}</span></td>
                        <td>
                            <button
                                className="btn btn-sm btn-success me-1"
                                disabled={v.status !== 'READY' || busyId === v.id}
                                onClick={() => handleRun(v.id)}
                                title="Run on display"
                            >
                                <FontAwesomeIcon icon={faPlay}/>
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                disabled={busyId === v.id}
                                onClick={() => handleRemove(v.id)}
                                title="Delete"
                            >
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {previewVideo && (
                <VideoScrubberModal video={previewVideo} onClose={() => setPreviewVideo(null)}/>
            )}
        </div>
    );
};

export default VideoList;
