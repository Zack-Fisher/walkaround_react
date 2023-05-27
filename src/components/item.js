import React from "react";
import { useEntity } from "./entity";
import { PhysicalEntityData } from "../classes";

const Item = () => {
    const {self} = useEntity();

    if (self.box === undefined) return null;

    return (
        <div
        style={{
            position: "absolute",
            left: self.box.x,
            top: self.box.y,
            width: self.box.w,
            height: self.box.h,
            background: self.color,
        }}
        ></div>
    );
}

export class ItemData extends PhysicalEntityData {
    static component_fn = Item;

    constructor(x = 50, y = 50, color = "yellow") {
        super(x, y, 50, 50);
        this.color = color;
    }
}
