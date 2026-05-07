import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import VideoThumbnail from './videoThumbnail';

const VideoScrubberModal = ({video, onClose}) => {
    const [frameIdx, setFrameIdx] = useState(0);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    if (!video) return null;
    const max = Math.max(0, (video.frameCount || 1) - 1);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="bg-light rounded shadow"
                style={{padding: '20px', maxWidth: '95vw', maxHeight: '95vh', position: 'relative', minWidth: '400px'}}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-outline-dark"
                    title="Close"
                    style={{position: 'absolute', right: '10px', top: '10px'}}
                >
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                <h5 className="mb-3 pe-4">
                    {video.name || 'Preview'}
                    <small className="text-muted ms-2">
                        frame {frameIdx + 1} / {video.frameCount}
                    </small>
                </h5>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '15px'}}>
                    <VideoThumbnail
                        videoId={video.id}
                        frameCount={video.frameCount}
                        frameIdx={frameIdx}
                        cellSize={10}
                    />
                </div>
                <input
                    type="range"
                    className="form-range"
                    min={0}
                    max={max}
                    value={frameIdx}
                    onChange={e => setFrameIdx(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted small">
                    <span>0s</span>
                    <span>{video.fps ? `${(frameIdx / video.fps).toFixed(2)}s` : ''}</span>
                    <span>{video.fps ? `${(video.frameCount / video.fps).toFixed(2)}s` : ''}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoScrubberModal;
