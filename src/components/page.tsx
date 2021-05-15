import clsx from "clsx";
import React, { ReactChild, useContext, useEffect, useState } from "react";

export const PageContext = React.createContext({ visible: false, state: "hidden" as "hidden" | "present" | "ease-in" | "ease-out" });

export function PageSelect(props: { active: string, transitionDuration?: number, children: JSX.Element[] })
{
    const [page, setPage] = useState<string | undefined>(undefined);
    const [[prev, next], setTransition] = useState<[string | undefined, string | undefined]>([undefined, undefined]);
    useEffect(() =>
    {
        let timeout = -1;
        if (props.active !== page && page)
        {
            setTransition([page, props.active]);
            setPage(props.active);
            timeout = setTimeout(() =>
            {
                setTransition([undefined, undefined]);
            }, (props.transitionDuration ?? .3) * 1000);
        }
        else if (props.active && !page)
        {
            setPage(props.active);
        }
        return () => clearTimeout(timeout);
    }, [props.active])

    return (<>
        {
            React.Children.map(props.children, (child, idx) => (
                <PageContext.Provider
                    key={idx}
                    value={{
                        visible: child.key === props.active,
                        state: child.key === prev ? "ease-out"
                            : child.key === next ? "ease-in"
                                : child.key === props.active ? "present"
                                    : "hidden"
                    }}
                >
                    {child}
                </PageContext.Provider>))
        }    
    </>)
}
export function Page(props: { className?: string, key: string, children: React.ReactNode })
{
    const context = useContext(PageContext);
    return (<div className={clsx(props.className, "page", context.visible ? "active" : "inactive", context.state)}>
        {props.children}
    </div>)
}