import React from "react";


const StdMessage = (message) => {
    return (
        <div className="stdout font-monospace">
            {message}
        </div>
    );
}

export default StdMessage;