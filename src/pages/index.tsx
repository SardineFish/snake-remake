import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { SnakeGame } from "../snake-game";
import "../../assets/style/style.css";
import { GameUI } from "../components/game-ui";
import { Block, GameScore } from "../snake-game/score";
import { GameSettings } from "../snake-game/settings";

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
            try
            {
                const canvas = ref.current;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * window.devicePixelRatio;
                canvas.height = rect.height * window.devicePixelRatio;

                const game = new SnakeGame(canvas);
                game.on("gameover", score =>
                {
                    setScore(score);
                    setGameState("over");
                });
                game.on("start", () =>
                {
                });
                await game.loadAssets();
                setGame(game);
            }
            catch (ex)
            {
                console.error(ex);
            }
        })();
    }, []);

    const start = () =>
    {
        setGameState("started");
        if (!game)
            return;
        game.reload();
    }

    const settingsChange = (settings: GameSettings) =>
    {
        game?.updateSettings(settings);
    };

    return (<>
        <canvas id="canvas" ref={ref}></canvas>
        <GameUI
            state={gameState}
            score={score}
            settings={game?.settings}
            onGameStart={start}
            onSettingsChange={settingsChange}
        />
    </>)
}

ReactDOM.render((<Game />), document.querySelector("#root"));