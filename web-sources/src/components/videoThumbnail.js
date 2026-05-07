import React, {useEffect, useRef, useState} from 'react';
import VideoAPI from '../services/videoAPI';

const decodeGrid = (base64Rows) => {
    if (!Array.isArray(base64Rows)) return [];
    return base64Rows.map(str => {
        const bin = atob(str);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
    });
};

const drawGrid = (canvas, grid, cellSize) => {
    if (!canvas || !grid.length || !grid[0].length) return;
    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff3030';
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
    });
};

const VideoThumbnail = ({videoId, frameCount, frameIdx = 0, cellSize = 3, onClick}) => {
    const canvasRef = useRef(null);
    const [grid, setGrid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(false);
        const idx = Math.max(0, Math.min(frameIdx, (frameCount || 1) - 1));
        VideoAPI.preview(videoId, idx)
            .then(data => {
                if (cancelled) return;
                if (data && data.gridBrightnesses) {
                    setGrid(decodeGrid(data.gridBrightnesses));
                } else {
                    setError(true);
                }
            })
            .catch(() => !cancelled && setError(true))
            .finally(() => !cancelled && setLoading(false));
        return () => { cancelled = true; };
    }, [videoId, frameIdx, frameCount]);

    useEffect(() => {
        if (grid) drawGrid(canvasRef.current, grid, cellSize);
    }, [grid, cellSize]);

    if (loading) return <span className="text-muted small">…</span>;
    if (error) return <span className="text-muted small">—</span>;

    return (
        <canvas
            ref={canvasRef}
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                border: '1px solid #ddd',
                imageRendering: 'pixelated',
                display: 'block'
            }}
        />
    );
};

export default VideoThumbnail;
