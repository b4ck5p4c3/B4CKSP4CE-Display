import React, {useState, useRef, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faCheck} from "@fortawesome/free-solid-svg-icons";

const CopyIdButton = ({id, className = "", size = "sm", title = "Copy id", style = {}}) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const fallbackCopy = (text) => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
    };

    const handleCopy = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!id) return;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(String(id));
            } else {
                fallbackCopy(String(id));
            }
            setCopied(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const sizeClass = size === "sm" ? "btn-sm" : "";

    return (
        <button
            type="button"
            className={`btn btn-outline-secondary ${sizeClass} ${className}`}
            onClick={handleCopy}
            title={copied ? "Copied!" : title}
            style={style}
        >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
        </button>
    );
};

export default CopyIdButton;
