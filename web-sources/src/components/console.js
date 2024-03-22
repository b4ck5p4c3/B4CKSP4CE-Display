import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import WebSocketService from "../services/websocket";

const Console = forwardRef(({}, ref) => {
    
    const [stdMessages, setStdMessages] = useState([]);
    
    const containerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        connectToStdout(scriptId){
            connectToStd(scriptId);
        }
    }));

    



    const connectToStd = (scriptId) => {
        console.log("Connecting to stdout");
        WebSocketService.connect(() => {
            WebSocketService.subscribe(`/script/${scriptId}/stdout`, (message) => {
                const newMessage = JSON.parse(message.body);
                for (let i = 0; i < newMessage.lines.length; i++) {
                    addStd(newMessage.lines[i]);
                }
            });
        });
    };
    

    const addStd = (message) => {
        setStdMessages((prevMessages) => {
            return prevMessages.length >= 100 ? [...prevMessages.slice(1), {
                id: uniqueId(),
                message
            }] : [...prevMessages, {id: uniqueId(), message}];
            
        });
        scrollToBottom();
    }
    const uniqueId = () => {
        return Math.random().toString(36).substr(2, 9);
    }

    
    const scrollToBottom = () => {
        if (containerRef.current==null) return;
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    
    return (
        <div
            className="d-block"
            ref={containerRef}
            style={{
                height: 150,
                overflow: "auto",
                overflowY: "auto",
                overflowX: "auto",
                background: "#36454F"
            }}
            data-bs-spy="scroll"
            name="stdContainer"
        >
            {stdMessages.map((messageObj, index) => (
               <div key={messageObj.id} className={`${messageObj.message.startsWith('ERROR:') ? "stderr" : "stdout"} font-monospace`}>
                   {messageObj.message}
               </div>
            ))}
        </div>
    );
});

export default Console;
