export const $ = (selector: string) => document.querySelector(selector);
export const $$ = (selector: string) => document.querySelectorAll(selector);

export function match<T extends string | number, V>(input: T, conditions: { [key in T]: V })
{
    return conditions[input];
}
