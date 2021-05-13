import React from "react";
import clsx from "clsx";

export function MainMenu(props: {onStart: () => void })
{
    return (<div className="main-menu">
        <ul className="menu">
            <li className="button" onClick={props.onStart}>START</li>
            <li className="button">RANK</li>
            <li className="button">SETTINGS</li>
        </ul>
    </div>);
}