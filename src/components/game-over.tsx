import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { API } from "../api-addr";
import { APIError } from "../api-builder";
import { Block, GameScore } from "../snake-game/score";

interface GameOverProps
{
    visible: boolean,
    score?: GameScore,
    onSubmit: (rank: number, score: number, name: string) => void,
    onSkip: () => void
}

export function GameOverUI(props: GameOverProps)
{
    const [name, setName] = useState("");
    const [score, setScore] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>
    {
        if (props.score)
            setScore(props.score.length);
        else
            setScore(0);
        setName("");
        setError(null);
    }, [props.score]);

    const submit = async () =>
    {
        if (!props.score)
            return;
        setError(null);
        try
        {
            const rank = await API.Rank.postScore({ key: "snake-remake" }, {
                name,
                score: props.score.length,
                data: props.score.data.map(b => Block.serialize(b)),
            });
            props.onSubmit(rank, props.score.length, name);
        }
        catch (err)
        {
            const apiErr = err as APIError;
            setError(`${apiErr.message} (0x${apiErr.code.toString(16)})`);
        }
    };

    return (<div className={clsx("game-over", props.visible ? "visible" : "invisible")}>
        <p className="title">GAME OVER</p>
        <div className="score">
            Score:
            <span className="value">{score}</span>
        </div>
        <div className="submit">
            <input className="input-name" type="text" value={name} placeholder="Your Name" onChange={e => setName(e.target.value)} />
            <div className="error">{error || <>&nbsp;</>}</div>
            <div className="actions">
                <div className="button" onClick={props.onSkip}>Skip</div>
                <div className="button" onClick={submit}>Submit</div>
            </div>
        </div>
    </div>);
}