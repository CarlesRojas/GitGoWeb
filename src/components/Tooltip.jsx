import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";

export default function Tooltip() {
    // State
    const [pos, setPos] = useState({ left: 0, top: 0 });

    // Mouse Position
    const [message, setMessage] = useState("");

    // Visible
    const [visible, setVisible] = useState(false);
    const visibleRef = useRef(false);

    // References
    const tooltipRef = useRef();
    const instantRef = useRef(false);

    // Timeouts
    const turnOnTimeout = useRef();
    const turnOffTimeout = useRef();

    // On mouse move
    const setTooltipPosition = (event) => {
        if (tooltipRef.current) {
            let newLeft = event.clientX;
            let newTop = event.clientY + 20;
            const { width, height } = tooltipRef.current.getBoundingClientRect();

            // Max to the right & left
            if (newLeft + width / 2 > window.innerWidth - 10) newLeft = window.innerWidth - 10 - width / 2;
            if (newLeft - width / 2 < 10) newLeft = 10 + width / 2;

            // Swap to top if in the bottom
            if (newTop + height > window.innerHeight - 10) newTop = event.clientY - 30;

            // Set Position
            setPos({ left: newLeft, top: newTop });
        }
    };

    // #################################################
    //   EVENTS
    // #################################################

    // On show tooltip
    const onShowTooltip = ({ message, instant }) => {
        clearTimeout(turnOnTimeout.current);
        clearTimeout(turnOffTimeout.current);
        instantRef.current = instant;

        // Show instantaniously
        if (instant) {
            setMessage(message);
            setVisible(true);
            visibleRef.current = true;

            // Close instant message after a second
            turnOffTimeout.current = setTimeout(() => {
                setVisible(false);
                visibleRef.current = false;
            }, 1000);
        }

        // Show after a second
        turnOnTimeout.current = setTimeout(() => {
            setMessage(message);
            setVisible(true);
            visibleRef.current = true;
        }, 600);
    };

    // On hide the context menu
    const onHideTooltip = () => {
        // Don't hide if the message was instant
        if (instantRef.current) return;

        // Hide
        clearTimeout(turnOnTimeout.current);
        setVisible(false);
        visibleRef.current = false;
    };

    // #################################################
    //   COMPONENT MOUNT
    // #################################################

    useEffect(() => {
        // Subscribe to events
        window.addEventListener("mousemove", setTooltipPosition);
        window.PubSub.sub("onShowTooltip", onShowTooltip);
        window.PubSub.sub("onHideTooltip", onHideTooltip);

        return () => {
            // Unsubscribe to events
            window.removeEventListener("mousemove", setTooltipPosition);
            window.PubSub.unsub("onShowTooltip", onShowTooltip);
            window.PubSub.unsub("onHideTooltip", onHideTooltip);

            // Clear timeouts
            clearTimeout(turnOnTimeout.current);
            clearTimeout(turnOffTimeout.current);
        };

        // eslint-disable-next-line
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className={classnames("tooltip", { visible })} style={{ left: pos.left, top: pos.top }} ref={tooltipRef}>
            {message}
        </div>
    );
}
