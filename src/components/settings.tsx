import React, { useEffect, useState } from "react";
import { GameSettings } from "../snake-game/settings";
import { keyof } from "../utils";
import { SelectGroup } from "./select";


export function SettingsPage(props: { settings: GameSettings, onChange?: (settings: GameSettings) => void, onExit?: () => void })
{
    const [res, setRes] = useState(props.settings.resolutionScale);
    const [msaa, setMSAA] = useState(props.settings.msaaSamples);
    const [postFX, setPostFX] = useState(props.settings.postprocess);
    const [hdr, setHDR] = useState(props.settings.hdr);

    useEffect(() =>
    {
        setRes(props.settings.resolutionScale);
        setMSAA(props.settings.msaaSamples);
        setPostFX(props.settings.postprocess);
        setHDR(props.settings.hdr);
    }, [props.settings]);

    const save = () =>
    {
        const settings: GameSettings = {
            hdr,
            msaaSamples: msaa,
            postprocess: postFX,
            resolutionScale: res
        };
        props.onChange?.(settings);
    }

    const resolutionOptions = {
        "50%": 0.5,
        "75%": 0.75,
        "100%": 1,
        "150%": 1.5,
        "200%": 2,
    };
    if (!keyof(resolutionOptions, window.devicePixelRatio))
    {
        (resolutionOptions as Record<string, number>)
        [
            (window.devicePixelRatio * 100)
                .toLocaleString(undefined, { maximumFractionDigits: 0 }) + "%"
        ]
            = window.devicePixelRatio;
    }

    return (<div className="settings-page">
        <header className="title">Settings</header>
        <ul className="settings">
            <Setting
                name="Resolution"
                value={res}
                onSet={setRes}
                options={resolutionOptions} />
            <Setting
                name="Anti-Aliasing"
                value={msaa}
                onSet={setMSAA}
                options={{
                    "Disable": 0,
                    "2xMSAA": 2,
                    "4xMSAA": 4,
                    "8xMSAA": 8,
                }}
            />
            <Setting
                name="Post-process"
                value={postFX}
                onSet={setPostFX}
                options={{
                    "Disable": false,
                    "Enable": true,
                }}
            />
            <Setting
                name="ColorSpace"
                value={hdr}
                onSet={setHDR}
                options={{
                    "SDR": "disable",
                    "HDR F16": "16bit",
                    "HDR F32": "32bit",
                }}
            />
        </ul>
        <div className="actions">
            <div className="button back" onClick={props.onExit}>BACK</div>
            <div className="button save" onClick={save}>SAVE</div>
        </div>
    </div>)
}

function Setting<T>(props: { name: string, options: Record<string, T>, value: T, onSet: (value: T)=>void})
{
    return (<li className="setting-item">
        <header className="name">{props.name}</header>
        <SelectGroup selectedKey={keyof(props.options, props.value)}>
            {Object.keys(props.options).map((key, idx) => (<SelectGroup.Item key={idx} id={key} onSelected={()=>props.onSet(props.options[key])}>
                {key}
            </SelectGroup.Item>))}
        </SelectGroup>
    </li>)
}