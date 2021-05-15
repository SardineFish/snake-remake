import React, { useEffect, useState } from "react";
import { div } from "zogra-renderer";
import { API } from "../api-addr";
import { Block, GameScore } from "../snake-game/score";
import { match } from "../utils";
import { GameOverUI } from "./game-over";
import { MainMenu } from "./main-menu";
import { Page, PageSelect } from "./page";
import { Rank } from "./rank-page";

interface UIProps
{
    state: "ready" | "started" | "over",
    score?: GameScore,
    onGameStart: () => void,
}

export function GameUI(props: UIProps)
{
    const [page, setPage] = useState<"main" | "over" | "rank" | "none">("none");
    const [selfScore, setSelfScore] = useState<[number, number] | undefined>();

    useEffect(() =>
    {
        setPage(match(props.state, {
            "ready": "main",
            "started": "none",
            "over": "over"
        }));

    }, [props.state]);

    const scoreSubmit = async (rank: number, score: number, name: string) =>
    {
        setSelfScore([score, rank]);
        setPage("rank");
    }

    return (<PageSelect active={page}>
        <Page key="main">
            <MainMenu onStart={props.onGameStart} onRank={() => setPage("rank")} onSettings={() => void 0} />
        </Page>
        <Page key="over">
            <GameOverUI visible={true} score={props.score} onSubmit={scoreSubmit} onSkip={() => setPage("main")} />
        </Page>
        <Page key="rank">
            <Rank onBack={() => setPage("main")} selfScore={selfScore?.[0]} selfRank={selfScore?.[1]}/>
        </Page>
    </PageSelect>);
}