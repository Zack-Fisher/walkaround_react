import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
// a provider that exposes basic keyboard checking.

const KeyboardContext = createContext();

export const KeyboardProvider = ({ children }) => {
    const [keys, setKeys] = useState({});
    const justPressedKeysRef = useRef({});
    const justReleasedKeysRef = useRef({});

    const isKeyDown = key => !!keys[key];
    const isKeyJustDown = key => !!justPressedKeysRef.current[key];
    const isKeyJustReleased = key => !!justReleasedKeysRef.current[key];

    useEffect(() => {
        const keydownHandler = ({ key }) => {
            setKeys(keys => ({ ...keys, [key]: true }));
            justPressedKeysRef.current = { ...justPressedKeysRef.current, [key]: true };
        };

        const keyupHandler = ({ key }) => {
            setKeys(keys => ({ ...keys, [key]: false }));
            justReleasedKeysRef.current = { ...justReleasedKeysRef.current, [key]: true };
        };

        window.addEventListener('keydown', keydownHandler);
        window.addEventListener('keyup', keyupHandler);

        return () => {
            window.removeEventListener('keydown', keydownHandler);
            window.removeEventListener('keyup', keyupHandler);
        };
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            justPressedKeysRef.current = {};
            justReleasedKeysRef.current = {};
        }, 100);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <KeyboardContext.Provider
            value={{
                isKeyDown,
                isKeyJustDown,
                isKeyJustReleased,
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
