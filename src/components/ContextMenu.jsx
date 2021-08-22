import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import useClickOutside from "../hooks/useClickOutside";

export default function ContextMenu() {
    // Position
    const [pos, setPos] = useState({ left: 0, top: 0 });

    // Info
    const info = useRef({ actions: [], mousePos: { x: 0, y: 0 } });

    // Shown
    const [visible, setVisible] = useState(false);
    const visibleRef = useRef(false);

    // Context menu ref
    const contextMenuRef = useRef();

    // Timeouts
    const turnOffTimeout = useRef();

    // Set the context menu position
    const setMenuPosition = () => {
        if (contextMenuRef.current) {
            let newLeft = info.current.mousePos.x;
            let newTop = info.current.mousePos.y + 20;
            const { width, height } = contextMenuRef.current.getBoundingClientRect();

            // Max to the right & left
            if (newLeft + width / 2 > window.innerWidth - 10) newLeft = window.innerWidth - 10 - width / 2;
            if (newLeft - width / 2 < 10) newLeft = 10 + width / 2;

            // Swap to top if in the bottom
            if (newTop + height > window.innerHeight - 10) newTop = info.current.mousePos.y - 30;

            // Set Position
            setPos({ left: newLeft, top: newTop });
        }
    };

    // Show new context menu
    const onShowContextMenu = ({ actions, mousePos }) => {
        // Another menu shown -> Hide previous menu
        if (visibleRef.current) {
            setVisible(false);
            visibleRef.current = false;

            turnOffTimeout.current = setTimeout(() => {
                info.current = { actions, mousePos };
                setMenuPosition();
                setVisible(true);
                visibleRef.current = true;
            }, 100);
        }

        // Otherwise -> Show menu
        else {
            info.current = { actions, mousePos };
            setMenuPosition();
            setVisible(true);
            visibleRef.current = true;
        }
    };

    // On hide the context menu
    const onHideContextMenu = () => {
        setVisible(false);
        visibleRef.current = false;

        // Hide and empty
        turnOffTimeout.current = setTimeout(() => {
            info.current = { actions: [], mousePos: { x: 0, y: 0 } };
            setPos({ left: window.innerWidth * 2, top: window.innerHeight * 2 });
        }, 100);
    };

    // Click outside hook
    useClickOutside(contextMenuRef, onHideContextMenu);

    // #################################################
    //   REPOSITION
    // #################################################

    useEffect(() => {
        if (contextMenuRef.current) {
            let newLeft = info.current.mousePos.x;
            let newTop = info.current.mousePos.y + 20;
            const { width, height } = contextMenuRef.current.getBoundingClientRect();

            // Max to the right & left
            if (newLeft + width / 2 > window.innerWidth - 10) newLeft = window.innerWidth - 10 - width / 2;
            if (newLeft - width / 2 < 10) newLeft = 10 + width / 2;

            // Swap to top if in the bottom
            if (newTop + height > window.innerHeight - 10) newTop = info.current.mousePos.y - 30;

            // Set Position
            setPos({ left: newLeft, top: newTop });
        }
    }, [visible]);

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    useEffect(() => {
        // Subscribe to events
        window.PubSub.sub("onShowContextMenu", onShowContextMenu);

        return () => {
            // Unsubscribe from events
            window.PubSub.unsub("onShowContextMenu", onShowContextMenu);

            // Clear timeouts
            clearTimeout(turnOffTimeout.current);
        };

        // eslint-disable-next-line
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={classNames("contextMenu", { visible })} ref={contextMenuRef} style={{ left: pos.left, top: pos.top }}>
            {info.current.actions.map(({ name, callback, icon }) => {
                return (
                    <div className="button clickable" onClick={callback} key={name}>
                        <SVG className="icon" src={icon} />
                        <p className="action">{name}</p>
                    </div>
                );
            })}
        </div>
    );
}
