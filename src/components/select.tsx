import clsx from "clsx";
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from "react";

const SelectContext = React.createContext({ selected: false, onClick: (_: string) => undefined as any });

export function SelectGroup(props: { selectedKey?: string, onChange?: (key: string) => void, children: ReactElement<{id: string}>[]})
{
    const [selected, setSelected] = useState<string | undefined>(props.selectedKey);

    const select = (key: string) =>
    {
        setSelected(key);
        if (key !== selected)
            props.onChange?.(key);
    };

    return (<ul className="select-group">
        {React.Children.map(props.children, (child, idx) => (<SelectContext.Provider
            key={idx}
            value={{
                selected: child.props.id as string === selected,
                onClick: ()=>select(child.props.id as string)
            }}
        >
            {child}
        </SelectContext.Provider>))}
    </ul>)
}

SelectGroup.Item = SelectItem;

function SelectItem(props: { id: string, onSelected?: (key: string) => void, children: ReactNode })
{
    const context = useContext(SelectContext);
    useEffect(() =>
    {
        if (context.selected)
            props.onSelected?.(props.id);
    }, [context.selected]);

    return (<li
        className={clsx("select-item", { "selected": context.selected })}
        onClick={() => context.onClick(props.id)}
    >
        {props.children}
    </li>)
}