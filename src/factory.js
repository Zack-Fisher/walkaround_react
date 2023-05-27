import { Rectangle } from "./rect";
import { v4 as uuidv4 } from "uuid";
import { Vector2 } from "./vec";

export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// every entity should start with the base factory mixin and the entity mixin
export const base_factory_mixin = (o = {}) => {
    o.mixins = [];
    // query by the mixin id
    o.add_mixin = (mixin_id) => {
        o.mixins.push(mixin_id);
        return o;
    };

    o.has_mixin = (mixin_id) => {
        return o.mixins.includes(mixin_id);
    };
    o.has_one_mixin = (mixin_list) => {
        return mixin_list.some(mixin => o.mixins.includes(mixin));
    }
    o.has_all_mixins = (mixin_list) => {
        return mixin_list.every(mixin => o.mixins.includes(mixin));
    }

    return o;
}

// add a dummy mixin for querying for each type, optionally.
export const label_mixin = (label) => (o) => {
    o.add_mixin(label);

    return o;
}

const null_component = () => {};

export const ENTITY_MIXIN = "entity";

export const entity_mixin = (component_fn = null_component) => (o) => {
    o.add_mixin(ENTITY_MIXIN);

    o.component_fn = component_fn;
    o.id = uuidv4();
    o.update = (updated_fields) => {
        o = {...o, ...updated_fields};
        return o;
    };

    return o;
}

export const PHYSICAL_MIXIN = "physical";

export const physical_mixin = (x = 0, y = 0, w = 50, h = 50) => (o) => {
    o.add_mixin(PHYSICAL_MIXIN);

    o.box = new Rectangle(x, y, w, h);

    return o;
}

export const MOVER_MIXIN = "mover";

export const mover_mixin = (accel = 0.5, friction = 0.6) => (o) => {
    o.add_mixin(MOVER_MIXIN);

    o.velocity = new Vector2(0, 0);
    o.acceleration = accel;
    o.friction = friction;

    return o;
}
