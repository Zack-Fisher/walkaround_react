import { useMemo } from "react";
import { useKeyboard } from "../../providers/keyboard_provider";

const useInput = (action_state) => {
    const {makeActionActive, makeJustActivated, makeJustDeactivated, actionState} = useKeyboard();
    // then automatically return the wrapped curry input functions, memoize the function
    // for efficiency.

    const isActionActive = useMemo(() => makeActionActive(action_state), [action_state, makeActionActive]);
    const isActionJustActivated = useMemo(() => makeJustActivated(action_state), [action_state, makeJustActivated]);
    const isActionJustDeactivated = useMemo(() => makeJustDeactivated(action_state), [action_state, makeJustDeactivated]);

    return {
        isActionActive,
        isActionJustActivated,
        isActionJustDeactivated,
    }
}

export default useInput;
