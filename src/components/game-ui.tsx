import React, { useEffect, useState } from "react";
import { div } from "zogra-renderer";
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

    useEffect(() =>
    {
        setPage(match(props.state, {
            "ready": "main",
            "started": "none",
            "over": "over"
        }));

    }, [props.state]);

    const scoreSubmit = async (name: string) =>
    {
        if (!props.score)
            return;
        const rank = await SardineFish.Games("http://localhost:3000").Rank.postScore({ key: "snake-remake" }, {
            name: name,
            score: props.score.length,
            data: props.score.data.map(b => Block.serialize(b))
        });
        console.log(rank);
        setPage("rank");
    }

    console.log(page);

    return (<PageSelect active={page}>
        <Page key="main">
            <MainMenu onStart={props.onGameStart} onRank={() => setPage("rank")} onSettings={() => void 0} />
        </Page>
        <Page key="over">
            <GameOverUI visible={true} onSubmit={scoreSubmit} onSkip={() => setPage("main")} />
        </Page>
        <Page key="rank">
            <Rank onBack={()=>setPage("main")}/>
        </Page>
    </PageSelect>);
}