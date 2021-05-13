import clsx from "clsx";
import React, { ReactChild, useContext } from "react";

const PageContext = React.createContext({ visible: false });

export function PageSelect(props: { active: string, children: JSX.Element[] })
{
    return (<>
        {
            React.Children.map(props.children, (child, idx) => (<PageContext.Provider key={idx} value={{visible: child.key === props.active}}>
                {child}
            </PageContext.Provider>))
        }    
    </>)
}
export function Page(props: { className?: string, key: string, children: React.ReactNode })
{
    const context = useContext(PageContext);
    return (<div className={clsx(props.className, "page", context.visible ? "active" : "inactive")}>
        {props.children}
    </div>)
}