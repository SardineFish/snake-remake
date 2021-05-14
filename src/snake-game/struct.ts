import b64 from "base64-js";

type NumericTypes = "i32" | "u32" | "i64" | "f32";
type ArrayTypes = "[u8]" | "[f32]";
type Types = NumericTypes | ArrayTypes;

interface TypeInfo<T extends Types>
{
    id: T;
    byteSize: number;
}

type ValueOfType<T extends Types> =
    T extends NumericTypes ? number
    : T extends "[u8]" ? Uint8Array
    : T extends "[f32]" ? Float32Array
    : never;

type ValueOf<T extends Types | TypeInfo<Types>> =
    T extends TypeInfo<Types> ? ValueOfType<T["id"]>
    : T extends Types ? ValueOfType<T>
    : never;

type TypeOf<T extends NumericTypes | TypeInfo<Types>> =
    T extends NumericTypes ? NumericTypes
    : T extends TypeInfo<Types> ? T["id"]
    : never;


export interface Structure
{
    [key: string]: NumericTypes | TypeInfo<Types>;
}

const sizeof: { [key in Types]: (info: TypeInfo<Types>) => number } = {
    f32: () => 4,
    i64: () => 8,
    i32: () => 4,
    u32: ()=>4,
    "[u8]": t => t.byteSize,
    "[f32]": t => t.byteSize,
};

export const internalBuffer = Symbol("buffer");

type ArrayEncoding = "array" | "hex" | "b64";
type SerializedStruct<T extends Structure, Enc extends ArrayEncoding> =
    Enc extends "array" ? { [key in keyof T]: TypeOf<T[key]> extends NumericTypes ? number : TypeOf<T[key]> extends ArrayTypes ? number[] : never }
    : Enc extends "hex" | "b64" ? { [key in keyof T]: TypeOf<T[key]> extends NumericTypes ? number : TypeOf<T[key]> extends ArrayTypes ? string : never }
    : never;

interface StructInstanceBase
{
    [internalBuffer]: ArrayBuffer,
}
interface StructSerialize<T extends Structure>
{
    sereialize<Enc extends ArrayEncoding>(typedArrayEncoding: Enc): SerializedStruct<T, Enc>;
}

export type StructInstance<T extends Structure> = StructInstanceBase & StructSerialize<T> & { [key in keyof T]: ValueOf<T[key]> };

type StructConstructor<T extends Structure> = new () => StructInstance<T>;

type Getters = { [key in Types]: (buf: ArrayBuffer, type: TypeInfo<Types>, offset: number, le?: boolean) => () => ValueOfType<key> };

const getter: Getters = {
    f32: (buf, t,  offset, le = true) =>
    {
        const view = new DataView(buf);
        return () => view.getFloat32(offset, le);
    },
    i32: (buf, t,  offset, le = true) =>
    {
        const view = new DataView(buf);
        return () => view.getInt32(offset, le);
    },
    u32: (buf, t, offset, le = true) =>
    {
        const view = new DataView(buf);
        return () => view.getUint32(offset, le);
    },
    i64: (buf, t,  offset, le = true) =>
    {
        const view = new DataView(buf);
        return () => Number(view.getBigInt64(offset, le));
    },
    "[u8]": (buf, t, offset) =>
    {
        const arr = new Uint8Array(buf, offset, t.byteSize);
        return () => arr;
    },
    "[f32]": (buf, t, offset) =>
    {
        const arr = new Float32Array(buf, offset, t.byteSize / 4);
        return () => arr;
    }
}

type Setters = { [key in Types]: (buf: ArrayBuffer, type: TypeInfo<Types>, offset: number, le?: boolean) => (value: Readonly<ValueOfType<key>>) => void };

const setter: Setters = {
    f32: (buf, t, offset, le = true) =>
    {
        const view = new DataView(buf);
        return (v) => view.setFloat32(offset, v, le);
    },
    i32: (buf, t, offset, le = true) =>
    {
        const view = new DataView(buf);
        return (v) => view.setInt32(offset, v, le);
    },
    u32: (buf, t, offset, le = true) =>
    {
        const view = new DataView(buf);
        return (v) => view.setUint32(offset, v, le);
    },
    i64: (buf, t, offset, le = true) =>
    {
        const view = new DataView(buf);
        return (v) => view.setBigInt64(offset, BigInt(v), le);
    },
    "[u8]": (buf, t, offset) =>
    {
        const arr = new Uint8Array(buf, offset, t.byteSize);
        return (v) => arr.set(v);
    },
    "[f32]": (buf, t, offset) =>
    {
        const arr = new Float32Array(buf, offset, t.byteSize / 4);
        return (v) => arr.set(v);
    }
}

type TypeInfoStruct<T extends Structure> = { [key in keyof T]: T[key] extends TypeInfo<Types> ? T[key] : T[key] extends Types ? TypeInfo<T[key]> : never };

function toTypeInfo<T extends Structure>(structure: T): TypeInfoStruct<T>
{
    const result: { [key in keyof T]: TypeInfo<Types> } = {} as any;
    for (const key in structure)
    {
        if (typeof (structure[key]) === "string")
        {
            result[key] = <TypeInfo<Types>>{
                id: structure[key],
                byteSize: sizeof[structure[key] as Types](undefined as any)
            }
        }
        else if (typeof (structure[key]) === "object")
            result[key] = structure[key] as TypeInfo<Types>;
    }
    return result as unknown as TypeInfoStruct<T>;
}

function hex(bufferView: ArrayBufferView)
{
    const buffer = new Uint8Array(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
    return [...buffer].map(x => x.toString(16).padStart(2, "0")).join("");
}

export function struct<T extends Structure>(structure: T): StructConstructor<T>
{
    const structInfo = toTypeInfo(structure);
    const size = Object.keys(structure).reduce((v, k) => v + sizeof[structInfo[k].id as Types](structInfo[k]), 0);

    // const obj = { [symbolBuf]: buffer };
    class Structure implements StructInstanceBase, StructSerialize<T>
    {
        [internalBuffer]: ArrayBuffer;
        constructor()
        {
            const buffer = new ArrayBuffer(size);
            this[internalBuffer] = buffer;
            let totalOffset = 0;
            for (const key in structure)
            {
                const offset = totalOffset;
                totalOffset += structInfo[key].byteSize;
                Object.defineProperty(this, key, {
                    get: getter[structInfo[key].id as Types](buffer, structInfo[key], offset),
                    set: setter[structInfo[key].id as Types](buffer, structInfo[key], offset)
                });
            }
        }
        sereialize<Enc extends ArrayEncoding>(typedArrayEncoding: Enc): SerializedStruct<T, Enc>
        {
            const obj: SerializedStruct<T, typeof typedArrayEncoding> = {} as any;
            for (const key in structInfo)
            {
                switch (structInfo[key].id)
                {
                    case "f32":
                    case "i32":
                    case "i64":
                    case "u32":
                        (obj[key] as number) = (this as unknown as StructInstance<T>)[key] as number;
                        break;
                    case "[f32]":
                    case "[u8]":
                        switch (typedArrayEncoding)
                        {
                            case "array":
                                (obj[key] as number[]) = Array.from((this as unknown as StructInstance<T>)[key] as ArrayLike<number>);
                                break;
                            case "hex":
                                (obj[key] as string) = hex((this as unknown as StructInstance<T>)[key] as ArrayBufferView);
                                break;
                            case "b64":
                                const bufView = (this as unknown as StructInstance<T>)[key] as ArrayBufferView;
                                (obj[key] as string) = b64.fromByteArray(new Uint8Array(bufView.buffer, bufView.byteOffset, bufView.byteLength));
                                break;
                        }
                        break;
                }
            }
            return obj;
        }
    }
    return Structure as unknown as StructConstructor<T>;
}

type ArrayDefine<T extends ArrayTypes> = (length: number) => TypeInfo<T>;

export const u8: ArrayDefine<"[u8]"> = (length) => ({
    id: "[u8]",
    byteSize: length
});

export const f32: ArrayDefine<"[f32]"> = (length) => ({
    id: "[f32]",
    byteSize: length * 4
});

{ // test

    const TypedStruct = struct({
        foo: "f32",
        bar: "i64",
        data: u8(32),
        fdata: f32(16),
    });

    const value = new TypedStruct();

    value.fdata as Float32Array;
    value.data as Uint8Array;
    value.foo as number;
    value[internalBuffer] as ArrayBuffer;

    const serHex = value.sereialize("hex");
    serHex.bar as number;
    serHex.data as string;

    const serArr = value.sereialize("array");
    serArr.bar as number;
    serArr.data as number[];
    
}