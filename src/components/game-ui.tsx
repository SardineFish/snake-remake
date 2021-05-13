import React from "react";
import { div } from "zogra-renderer";
import { GameScore } from "../snake-game/score";
import { GameOverUI } from "./game-over";
import { MainMenu } from "./main-menu";

interface UIProps
{
    state: "ready" | "started" | "over",
    score?: GameScore,
    onGameStart: () => void,
}

export function GameUI(props: UIProps)
{
    return (<div className="overlay">
        <MainMenu visible={props.state === "ready"} onStart={props.onGameStart}/>
    </div>)
}