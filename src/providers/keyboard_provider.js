import React, { createContext, useContext, useEffect, useState } from 'react';

const KeyboardContext = createContext();

export const Actions = {
    MOVE_UP: 'move_up',
    MOVE_DOWN: 'move_down',
    MOVE_LEFT: 'move_left',
    MOVE_RIGHT: 'move_right',
    INTERACT: 'interact',
    SPRINT: 'sprint',
};

export const make_action_state = () => {
    let active = {};
    let just_activated = {};
    let just_deactivated = {};

    // fully init the action state.
    for (const action in Actions) {
        active[action] = false;
        just_activated[action] = false;
        just_deactivated[action] = false;
    }

    return {
        active,
        just_activated,
        just_deactivated,
    };
}

export const KeyboardProvider = ({ children }) => {
    // define the default mapping, change through the hooks.
    const [actionMap, setActionMap] = useState({
        [Actions.MOVE_UP]: 'ArrowUp',
        [Actions.MOVE_DOWN]: 'ArrowDown',
        [Actions.MOVE_LEFT]: 'ArrowLeft',
        [Actions.MOVE_RIGHT]: 'ArrowRight',
        [Actions.INTERACT]: 'z',
        [Actions.SPRINT]: 'Shift',
    });
    const [actionState, setActionState] = useState(make_action_state());

    // we want to pass the action state down and serialize it.
    // let's curry so that we can pass down action checkers to children easily.
    // pass any valid actionstate structure into here and it should just work as an input callback.
    // for things that need input, we can pass in the curried input checker function.
    // that way we can handle player input and ghost network input.
    const makeActionActive = (action_state) => (action) => action_state.active[action];
    const makeJustActivated = (action_state) => (action) => action_state.just_activated[action]; 
    const makeJustDeactivated = (action_state) => (action) => action_state.just_deactivated[action];

    // modify the action mapping itself, key remappings.
    const addAction = (action, key) => setActionMap(map => ({ ...map, [action]: key }));
    const removeAction = action => setActionMap(map => {
        const { [action]: _, ...rest } = map;
        return rest;
    });

    useEffect(() => {
        const keydownHandler = e => {
            const key = e.key;

            // check if the key is mapped to an action.
            for (const action in actionMap) {
                if (actionMap[action] === key) {
                    let new_action_state = actionState;
                    new_action_state.active[action] = true;
                    new_action_state.just_activated[action] = true;
                    setActionState(new_action_state);
                }
            }
        };

        const keyupHandler = e => {
            const key = e.key;

            // check if the key is mapped to an action.
            for (const action in actionMap) {
                if (actionMap[action] === key) {
                    let new_action_state = actionState;
                    new_action_state.active[action] = false;
                    new_action_state.just_deactivated[action] = true;
                    setActionState(new_action_state);
                }
            }
        };

        window.addEventListener('keydown', keydownHandler);
        window.addEventListener('keyup', keyupHandler);

        return () => {
            window.removeEventListener('keydown', keydownHandler);
            window.removeEventListener('keyup', keyupHandler);
        };
    }, [actionMap, actionState]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            let new_action_state = actionState;
            new_action_state.just_activated = {};
            new_action_state.just_deactivated = {};
            setActionState(new_action_state);
        }, 60 / 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [actionState]);

    return (
        <KeyboardContext.Provider
            value={{
                // also pass the raw state for serialization.
                actionState, 

                // pass down the action checker curries.
                makeActionActive,
                makeJustActivated,
                makeJustDeactivated,

                // pass down the action mapping modifiers.
                addAction,
                removeAction,
            }}
        >
            {children}
        </KeyboardContext.Provider>
    );
};

export const useKeyboard = () => {
    const context = useContext(KeyboardContext);
    if (context === undefined) {
        throw new Error('useKeyboard must be used within a KeyboardProvider');
    }
    return context;
};
