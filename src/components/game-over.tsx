import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { GameScore } from "../snake-game/score";

export function GameOverUI(props: { visible: boolean, score?: GameScore, onSubmit: (name: string) => void, onSkip: () => void })
{
    const [name, setName] = useState("");
    const [score, setScore] = useState(0);

    useEffect(() =>
    {
        if (props.score)
            setScore(props.score.length);
        else
            setScore(0);
        setName("");
    }, [props.score]);

    const submit = () =>
    {
        props.onSubmit(name);
    };

    return (<div className={clsx("game-over", props.visible ? "visible" : "invisible")}>
        <p className="title">GAME OVER</p>
        <div className="score">
            Score:
            <span className="value">{score}</span>
        </div>
        <div className="submit">
            <input className="input-name" type="text" value={name} placeholder="Your Name" onChange={e => setName(e.target.value)} />
            <div className="actions">
                <div className="button" onClick={props.onSkip}>Skip</div>
                <div className="button" onClick={submit}>Submit</div>
            </div>
        </div>
    </div>);
}