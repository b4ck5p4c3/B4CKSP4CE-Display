import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faXmark, faGripLines} from "@fortawesome/free-solid-svg-icons";
import GridCanvas from "./grid";
import DisplayAPI from "../services/displayAPI";

const DEFAULT_POLL_INTERVAL_MS = 500;
const POLL_INTERVAL_MIN_MS = 50;
const POLL_INTERVAL_MAX_MS = 2000;
const POLL_INTERVAL_STEP_MS = 50;
const STORAGE_KEY = 'displayPreview.pip';
const PANEL_WIDTH = 360;
const PANEL_MIN_HEIGHT = 200;

const clampPollInterval = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return DEFAULT_POLL_INTERVAL_MS;
    return Math.min(POLL_INTERVAL_MAX_MS, Math.max(POLL_INTERVAL_MIN_MS, Math.round(n)));
};

const decodeGrid = (base64Rows) => {
    if (!Array.isArray(base64Rows)) return [];
    return base64Rows.map(str => {
        const bin = atob(str);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
    });
};

const clampToViewport = (x, y, w, h) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = Math.min(Math.max(0, x), Math.max(0, vw - w));
    const cy = Math.min(Math.max(0, y), Math.max(0, vh - h));
    return {x: cx, y: cy};
};

const loadPersisted = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
};

const DisplayPreview = () => {
    const persisted = loadPersisted();
    const [open, setOpen] = useState(persisted?.open ?? false);
    const [pos, setPos] = useState(() => {
        if (persisted?.pos) return persisted.pos;
        return {x: window.innerWidth - PANEL_WIDTH - 24, y: window.innerHeight - PANEL_MIN_HEIGHT - 90};
    });
    const [frame, setFrame] = useState(null);
    const [error, setError] = useState(null);
    const [pollInterval, setPollInterval] = useState(
        () => clampPollInterval(persisted?.pollInterval ?? DEFAULT_POLL_INTERVAL_MS)
    );

    const timerRef = useRef(null);
    const panelRef = useRef(null);
    const dragRef = useRef(null);

    const fetchState = useCallback(async () => {
        try {
            const data = await DisplayAPI.state();
            if (data && data.gridBrightnesses) {
                setFrame({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    grid: decodeGrid(data.gridBrightnesses)
                });
                setError(null);
            }
        } catch (e) {
            setError(String(e));
        }
    }, []);

    useEffect(() => {
        if (!open) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }
        fetchState();
        timerRef.current = setInterval(fetchState, pollInterval);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [open, fetchState, pollInterval]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({open, pos, pollInterval}));
        } catch (e) { /* ignore quota */ }
    }, [open, pos, pollInterval]);

    useEffect(() => {
        const onResize = () => {
            setPos(p => {
                const rect = panelRef.current?.getBoundingClientRect();
                const w = rect?.width ?? PANEL_WIDTH;
                const h = rect?.height ?? PANEL_MIN_HEIGHT;
                return clampToViewport(p.x, p.y, w, h);
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const onPointerDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        const rect = panelRef.current.getBoundingClientRect();
        dragRef.current = {
            offX: e.clientX - rect.left,
            offY: e.clientY - rect.top,
            w: rect.width,
            h: rect.height
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
        e.preventDefault();
    };

    const onPointerMove = (e) => {
        if (!dragRef.current) return;
        const {offX, offY, w, h} = dragRef.current;
        setPos(clampToViewport(e.clientX - offX, e.clientY - offY, w, h));
    };

    const onPointerUp = (e) => {
        if (!dragRef.current) return;
        dragRef.current = null;
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    };

    return (
        <>
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    title="Display preview"
                    className="btn btn-warning shadow"
                    style={{
                        position: 'fixed',
                        right: '20px',
                        bottom: '20px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        zIndex: 1040,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                    }}
                >
                    <FontAwesomeIcon icon={faEye} size="lg" />
                </button>
            )}

            {open && (
                <div
                    ref={panelRef}
                    className="bg-light rounded shadow border"
                    style={{
                        position: 'fixed',
                        left: pos.x,
                        top: pos.y,
                        width: PANEL_WIDTH,
                        zIndex: 1040,
                        overflow: 'hidden',
                        userSelect: 'none'
                    }}
                >
                    <div
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                        className="d-flex align-items-center justify-content-between bg-dark text-light px-2 py-1"
                        style={{cursor: 'move', touchAction: 'none'}}
                    >
                        <div className="d-flex align-items-center gap-2 text-truncate">
                            <FontAwesomeIcon icon={faGripLines} className="opacity-75" />
                            <span className="small text-truncate">
                                Display preview
                                {frame?.name ? <span className="ms-2 opacity-75">· {frame.name}</span> : null}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="btn btn-sm btn-dark py-0 px-2 border-0"
                            title="Close"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>

                    <div className="p-2">
                        {error && <div className="alert alert-danger py-1 px-2 mb-2 small">{error}</div>}
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            {frame && frame.grid.length > 0 ? (
                                <GridCanvas
                                    grid={frame.grid}
                                    cellSize={7}
                                    gapSize={1}
                                    onClick={() => {}}
                                />
                            ) : (
                                <div className="text-muted py-4">Loading...</div>
                            )}
                        </div>
                        <div
                            className="d-flex align-items-center gap-2 text-muted"
                            style={{fontSize: '0.7rem', marginTop: '6px'}}
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <span>Poll</span>
                            <input
                                type="range"
                                className="form-range flex-grow-1"
                                min={POLL_INTERVAL_MIN_MS}
                                max={POLL_INTERVAL_MAX_MS}
                                step={POLL_INTERVAL_STEP_MS}
                                value={pollInterval}
                                onChange={(e) => setPollInterval(clampPollInterval(e.target.value))}
                                title={`Polling interval: ${pollInterval} ms`}
                                style={{height: '14px'}}
                            />
                            <span style={{minWidth: '52px', textAlign: 'right'}}>{pollInterval} ms</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DisplayPreview;
