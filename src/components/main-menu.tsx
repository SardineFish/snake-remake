import React from "react";
import clsx from "clsx";

export function MainMenu(props: { visible: boolean, onStart: () => void })
{
    return (<div className={clsx("main-menu", props.visible? "visible": "invisible")}>
        <ul className="menu">
            <li className="button" onClick={props.visible ? props.onStart : undefined}>START</li>
            <li className="button">RANK</li>
            <li className="button">SETTINGS</li>
        </ul>
    </div>);
}