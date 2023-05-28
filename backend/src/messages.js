export const INIT = 'init';

export const make_init = () => {
    return {
        type: INIT,
    }
}

export const ERROR = 'error';

export const make_error = (error) => {
    return {
        type: ERROR,
        error
    }
}

// for quick async polling on properties.
// eg, update the velocity of a player 5 times a second.
export const make_property_update = (property, value) => {
    return {
        type: 'property_update',
        // name of the property
        property,
        // the new value
        value,
    }
}
