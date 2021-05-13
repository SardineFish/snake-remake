import React, { useEffect, useState } from "react";
import { div } from "zogra-renderer";
import { GameScore } from "../snake-game/score";
import { match } from "../utils";
import { GameOverUI } from "./game-over";
import { MainMenu } from "./main-menu";
import { Page, PageSelect } from "./page";

interface UIProps
{
    state: "ready" | "started" | "over",
    score?: GameScore,
    onGameStart: () => void,
}

export function GameUI(props: UIProps)
{
    const [page, setPage] = useState<"main" | "over" | "rank" | "none">("none");

    useEffect(() =>
    {
        setPage(match(props.state, {
            "ready": "main",
            "started": "none",
            "over": "over"
        }));

    }, [props.state]);

    const scoreSubmit = (name: string) =>
    {
        
    }

    console.log(page);

    return (<PageSelect active={page}>
        <Page key="main">
            <MainMenu onStart={props.onGameStart} />
        </Page>
        <Page key="over">
            <GameOverUI visible={true} onSubmit={scoreSubmit} onSkip={() => setPage("main")}/>
        </Page>
    </PageSelect>);
}