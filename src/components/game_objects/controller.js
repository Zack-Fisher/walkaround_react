import { useCallback, useEffect, useMemo, useState } from "react";
import { useEntityContext } from "../../providers/entity_provider";
import { Actions, useKeyboard } from "../../providers/keyboard_provider";
import { make_character } from "./mover";
import useInput from "../hooks/use_input";

const Controller = ({ self, update_self }) => {
    const { add_entity } = useEntityContext();

    const {actionState} = useKeyboard();
    // generate the input functions for the local frontend player controls.
    const { isActionActive, isActionJustActivated } = useInput(actionState);

    const player_character = useMemo(() => {
        let o = make_character(0, 0);
    })
    

    // parent entities should have complete access to the state of the child.
    const [child_id, set_child_id] = useState(

    );
}
