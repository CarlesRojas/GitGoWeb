import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";

export default function Tooltip({ idName, message }) {
    // State
    const [pos, setPos] = useState({ left: 0, top: 0 });
    const [visible, setVisible] = useState(false);
    const [clicked, setClicked] = useState(false);

    // References
    const tooltipRef = useRef();
    const clickedRef = useRef(false);

    // Timeout
    const turnOnTimeout = useRef();
    const turnOffTimeout = useRef();

    // On mouse move
    const setPosition = (event) => {
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

    // On mouse enter
    const onMouseEnter = (event) => {
        // Turn on tooltip
        clearTimeout(turnOnTimeout.current);
        turnOnTimeout.current = setTimeout(() => {
            setClicked(false);
            clickedRef.current = false;
            setVisible(true);
            window.PubSub.emit("onShowTooltip", { tooltipId: idName });
        }, 600);
    };

    // On mouse leave
    const onMouseLeave = () => {
        // Prevent the tooltip from turning on
        clearTimeout(turnOnTimeout.current);

        // Turn off tooltip
        if (!clickedRef.current) {
            clearTimeout(turnOffTimeout.current);
            turnOffTimeout.current = setTimeout(() => {
                setVisible(false);
            }, 100);
        }
    };

    // On click
    const onClick = (event) => {
        setClicked(true);
        clickedRef.current = true;

        // Turn on if not on already
        clearTimeout(turnOnTimeout.current);
        setVisible(true);
        window.PubSub.emit("onShowTooltip", { tooltipId: idName });

        // Turn off tooltip in second
        clearTimeout(turnOffTimeout.current);
        turnOffTimeout.current = setTimeout(() => {
            setVisible(false);
        }, 1000);
    };

    // On another tooltip show
    const onOtherTooltipShow = ({ tooltipId }) => {
        if (idName !== tooltipId) {
            clearTimeout(turnOnTimeout.current);
            clearTimeout(turnOffTimeout.current);
            setVisible(false);
        }
    };

    useEffect(() => {
        const domElem = document.getElementById(idName);

        // Subscribe to events
        window.addEventListener("mousemove", setPosition);
        domElem.addEventListener("mouseenter", onMouseEnter);
        domElem.addEventListener("mouseleave", onMouseLeave);
        domElem.addEventListener("click", onClick);
        window.PubSub.sub("onShowTooltip", onOtherTooltipShow);

        return () => {
            // Unsubscribe to events
            window.removeEventListener("mousemove", setPosition);
            domElem.removeEventListener("mouseenter", onMouseEnter);
            domElem.removeEventListener("mouseleave", onMouseLeave);
            domElem.removeEventListener("click", onClick);
            window.PubSub.unsub("onShowTooltip", onOtherTooltipShow);

            // Clear timeouts
            clearTimeout(turnOnTimeout.current);
            clearTimeout(turnOffTimeout.current);
        };

        // eslint-disable-next-line
    }, []);

    return (
        <div className={classnames("tooltip", { visible })} style={{ left: pos.left, top: pos.top }} ref={tooltipRef}>
            {clicked ? message.clicked : message.default}
        </div>
    );
}
