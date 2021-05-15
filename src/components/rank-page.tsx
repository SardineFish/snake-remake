import React, { useEffect, useState } from "react";
import { RankedScore } from "../API";

export function Rank(props: {selfRank?: number, onBack: ()=>void})
{
    const [scores, setScores] = useState<RankedScore[]>([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    
    useEffect(() =>
    {
        setSkip(0);
        setScores([]);
        (async () =>
        {
            const fetchedScores = await SardineFish.Games("http://localhost:3000").Rank.getRankedScores({ key: "snake-remake", count: 100 });
            setScores([...scores, ...fetchedScores]);
        })();
    }, []);

    return (<div className="rank">
        <header className="title">RANKING</header>
        <table className="rank-table">
            <colgroup>
                <col className="col-rank" />
                <col className="col-score" />
                <col className="col-name" />
                <col className="col-time" />
            </colgroup>
            <thead className="header">
                <tr className="row">
                    <th align="left">Rank</th>
                    <th align="left">Score</th>
                    <th align="left">Name</th>
                    <th align="left">Time</th>
                </tr>
            </thead>
            <tbody>
                {scores.map((score, idx) => (<tr key={idx}>
                    <td>{idx}</td>
                    <td>{score.score}</td>
                    <td>{score.name}</td>
                    <td>{new Date(score.time).toLocaleString()}</td>
                </tr>))}
            </tbody>
        </table>
        <div className="actions">
            <div className="button" onClick={props.onBack}>BACK</div>
        </div>
    </div>)
}