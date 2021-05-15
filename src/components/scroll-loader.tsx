import React, { ReactNode, useEffect, useRef } from "react";

export function ScrollLoader(props: { children: ReactNode[], load: () => void, canLoad?: boolean, threshold?: number })
{
    const ref = useRef<HTMLDivElement>(null);
    const scroll = () =>
    {
        if (!ref.current)
            return;
        const view = ref.current;
        const rect = view.getBoundingClientRect();

        if (props.canLoad && Math.abs(rect.height + view.scrollTop - ref.current.scrollHeight) < (props.threshold || 32))
        {
            props.load();
        }
    }

    useEffect(scroll);

    return (<div className="scroll-loader" ref={ref} onScroll={scroll}>
        {props.children}
    </div>)
}