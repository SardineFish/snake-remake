import React from "react";
import clsx from "clsx";

export function MainMenu(props: { onStart: () => void, onRank: () => void, onSettings: () => void })
{
    return (<div className="main-menu">
        <ul className="menu">
            <li className="button" onClick={props.onStart}>START</li>
            <li className="button" onClick={props.onRank}>RANK</li>
            <li className="button" onClick={props.onSettings}>SETTINGS</li>
        </ul>
    </div>);
}