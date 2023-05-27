import { EntityData } from "./components/entity";
import { Rectangle } from "./rect";

export class PhysicalEntityData extends EntityData
{
    constructor(x = 50, y = 50, w = 50, h = 50) {
        super();

        this.box = new Rectangle(x, y, w, h);
    }
}
