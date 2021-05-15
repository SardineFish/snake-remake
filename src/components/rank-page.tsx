import React, { useContext, useEffect, useRef, useState } from "react";
import { RankedScore } from "../API";
import { API } from "../api-addr";
import { PageContext } from "./page";

export function Rank(props: {selfRank?: number, selfScore?: number, onBack: ()=>void})
{
    const [scores, setScores] = useState<RankedScore[]>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState({});
    const ref = useRef<HTMLTableElement>(null);
    const context = useContext(PageContext);
    
    useEffect(() =>
    {
        if (context.state === "ease-in")
        {
            setLoading(false);
            setHasMore(true);
            setScores([]);
            setSkip(0);
            setRefresh({});
        }
    }, [context.state]);
    useEffect(() =>
    {
        load();
    }, [skip, refresh]);
    // useEffect(() =>
    // {
    //     scroll();
    // }, [skip]);

    const load = async () =>
    {
        if (loading || !hasMore || !context.visible)
            return;
        setLoading(true);

        const fetchedScores = await API.Rank.getRankedScores({ key: "snake-remake", count: 10, skip, });
        setScores([...scores, ...fetchedScores]);
        if (fetchedScores.length <= 0)
            setHasMore(false);
        setSkip(fetchedScores.length + skip);
        setLoading(false);
    }

    const scroll = () =>
    {
        if (!ref.current)
            return;
        const table = ref.current;
        const rect = table.getBoundingClientRect();
        if (Math.abs(table.scrollTop + rect.height - table.scrollHeight) < 32)
            load();
    };

    return (<div className="rank">
        <header className="title">RANKING</header>
        {props.selfRank && props.selfScore ? <p className="self-score">
            You are at #{props.selfRank + 1} with score {props.selfScore}
        </p> : null}
        <table className="rank-table" ref={ref} onScroll={scroll} onWheel={scroll}>
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
                    <td>{scores.filter(s=>s.score > score.score).length + 1}</td>
                    <td>{score.score}</td>
                    <td>{score.name}</td>
                    <td>{new Date(score.time).toLocaleString()}</td>
                </tr>))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={4} align="center">{
                        loading ? "Loading..." :
                            hasMore ? <>&nbsp;</>
                                : "No More"}</td>
                </tr>
            </tfoot>
        </table>
        <div className="actions">
            <div className="button" onClick={props.onBack}>BACK</div>
        </div>
    </div>)
}