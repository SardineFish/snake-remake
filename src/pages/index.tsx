import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { SnakeGame } from "../snake-game";
import "../../assets/style/style.css";
import { GameUI } from "../components/game-ui";
import { Block, GameScore } from "../snake-game/score";

function Game()
{
    const ref = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<SnakeGame | null>(null);
    const [gameState, setGameState] = useState<"ready" | "started" | "over">("ready");
    const [score, setScore] = useState<GameScore | undefined>(undefined);

    useEffect(() =>
    {
        (async () =>
        {
            if (!ref.current)
                return;
            const canvas = ref.current;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;

            const game = new SnakeGame(canvas);
            game.on("gameover", score =>
            {
                setScore(score);
                setGameState("over");
                console.log(score.data.map(b => Block.serialize(b)));
            });
            game.on("start", () =>
            {
                setGameState("started");
            });
            await game.loadAssets();
            setGame(game);
        })();
    }, []);

    const start = () =>
    {
        if (!game)
            return;
        game.reload();
    }

    return (<>
        <canvas id="canvas" ref={ref}></canvas>
        <GameUI state={gameState} score={score} onGameStart={start}/>
    </>)
}

ReactDOM.render((<Game />), document.querySelector("#root"));