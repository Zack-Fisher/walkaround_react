import React from "react";

const PhysicalEntity = ({ position, type, children }) => {
    const get_color = (type) => {switch(type) {
        case "player":
            return "blue";
        case "npc":
            return "red";
        case "item":
            return "yellow";
        default:
            return "";
    }}

    if (position === undefined) return null;
    return (
        <div
        style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: "50px",
            height: "50px",
            backgroundColor: get_color(type),
        }}
        >
            {children}
        </div>
    );
}

export default PhysicalEntity;
