declare type HTTPMethodsWithoutBody = "GET" | "HEAD" | "CONNECT" | "DELETE" | "OPTIONS";
declare type HTTPMethodsWithBody = "POST" | "PUT" | "PATCH";
export declare type HTTPMethods = HTTPMethodsWithBody | HTTPMethodsWithoutBody;
declare type TypeNames = "number" | "string" | "boolean" | "string[]";
declare type TypeOfName<T> = T extends "number" ? number : T extends "string" ? string : T extends "boolean" ? boolean : T extends "string[]" ? string[] : never;
declare type Validator<T> = (key: string, value: T) => T;
declare type ParamInfo<T extends TypeNames> = T extends any ? {
    type: T;
    validator: Validator<TypeOfName<T>>;
    optional?: true;
} : never;
declare type OptionalParams<T extends {
    [key: string]: ParamInfo<TypeNames>;
}> = {
        [key in keyof T as T[key]["optional"] extends true ? key : never]: TypeOfName<T[key]["type"]>;
    };
declare type RequiredParams<T extends {
    [key: string]: ParamInfo<TypeNames>;
}> = {
        [key in keyof T as T[key]["optional"] extends true ? never : key]: TypeOfName<T[key]["type"]>;
    };
declare type ValueType<T extends ParamsDeclare> = Required<RequiredParams<T>> & Partial<OptionalParams<T>>;
declare type ParamsDeclare = {
    [key: string]: ParamInfo<TypeNames>;
};
declare type SimpleParamsDeclare = {
    [key: string]: ParamInfo<TypeNames> | TypeNames;
};
declare type FullParamsDeclare<T extends SimpleParamsDeclare> = {
    [key in keyof T]: ParamInfo<TypeNames> & (T[key] extends TypeNames ? ParamInfo<T[key]> : T[key]);
};
declare type ApiFunction<Path extends ParamsDeclare, Query extends ParamsDeclare, Data extends ParamsDeclare | any | undefined, Response> = Data extends undefined ? (params: ValueType<Path> & ValueType<Query>) => Promise<Response> : Data extends ParamsDeclare ? (params: ValueType<Path> & ValueType<Query>, body: ValueType<Data & ParamsDeclare>) => Promise<Response> : (params: ValueType<Path> & ValueType<Query>, body: Data) => Promise<Response>;
export declare function simpleParam<T extends SimpleParamsDeclare>(info: T): FullParamsDeclare<T>;
declare function validateEmail(key: string, email: string): string;
declare function validateUid(key: string, uid: string): string;
declare function validateName(key: string, name: string): string;
declare function validateUrl(key: string, url: string): string;
declare function validateNonEmpty(key: string, text: string): string;
declare function validateByPass<T>(_: string, value: T): T;
declare function validatePositive(key: String, value: number): number;
export declare const Validators: {
    name: typeof validateName;
    email: typeof validateEmail;
    uid: typeof validateUid;
    url: typeof validateUrl;
    nonEmpty: typeof validateNonEmpty;
    bypass: typeof validateByPass;
    positive: typeof validatePositive;
};
export declare enum ClientErrorCode
{
    Error = -1,
    InvalidParameter = -2,
    NetworkFailure = -3,
    ParseError = -4
}
export declare class APIError extends Error
{
    code: number;
    constructor(code: number, message: string);
}
declare class ApiBuilder<Method extends HTTPMethods, Path extends ParamsDeclare, Query extends ParamsDeclare, Data extends ParamsDeclare | any | undefined, Response> {
    private method;
    private url;
    private pathInfo;
    private queryInfo;
    private dataInfo;
    private redirectOption?;
    private requestMode;
    constructor(method: Method, mode: RequestMode, url: string, path: Path, query: Query, data: Data);
    base(baseUrl: string): ApiBuilder<Method, Path, Query, Data, unknown>;
    path<NewPath extends SimpleParamsDeclare>(path: NewPath): ApiBuilder<Method, FullParamsDeclare<NewPath>, Query, Data, Response>;
    mode(mode: RequestMode): ApiBuilder<Method, Path, Query, Data, unknown>;
    query<NewQuery extends SimpleParamsDeclare>(query: NewQuery): ApiBuilder<Method, Path, FullParamsDeclare<NewQuery>, Data, Response>;
    body<T>(): ApiBuilder<Method, Path, Query, T, Response>;
    body<NewData extends SimpleParamsDeclare>(data: NewData): ApiBuilder<Method, Path, Query, FullParamsDeclare<NewData>, Response>;
    redirect(redirect: "follow" | "error" | "manual"): this;
    response<Response>(): ApiFunction<Path, Query, Data, Response>;
    private send;
    private parseBody;
}
export declare function api<Method extends HTTPMethodsWithBody>(method: Method, url: string): ApiBuilder<Method, {}, {}, {}, any>;
export declare function api<Method extends HTTPMethodsWithoutBody>(method: Method, url: string): ApiBuilder<Method, {}, {}, undefined, any>;
export { };
