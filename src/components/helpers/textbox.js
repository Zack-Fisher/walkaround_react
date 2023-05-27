import React from "react"

const Textbox = ({message}) => {
    return (
        <div style={{
            position: 'relative',
            top: -20, 
            zIndex: 100,
            width: 100,
            height: 20,
            background: 'white',
            color: 'black',
        }}>
            {message}
        </div>
    )
};

export default Textbox;
