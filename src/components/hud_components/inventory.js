import React, { useCallback, useMemo } from "react";
import { useEntityContext } from "../../providers/entity_provider";

import styles from '../../classes.module.css'
import { CHARACTER_MIXIN } from "../game_objects/character";

const Inventory = () => {
    const { and_query } = useEntityContext();

    // just gets an array of items.
    // try to memoize? i don't know if this will really work.
    const get_inventory = useMemo(() => {
        // just choose the first one for now. fix this later
        const q = and_query([CHARACTER_MIXIN]);
        if (q.length === 0) return [];
        const player = q[0];
        return player.inventory;
    }, [and_query]);

    return (
        <div className={styles.inherit} style={{
        }}>
            {get_inventory.map(item => {
                return (
                    <div key={item.name}>
                        {item.name}
                    </div>
                );
            })}
        </div>
    );
}

export default Inventory;