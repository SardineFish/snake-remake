import { internalBuffer, struct, StructInstance, Structure, u8 } from "./struct";
import { hex } from "./utils";
import { sha256 } from "hash.js";
import b64 from "base64-js";

export interface GameScore
{
    length: number;
}

export interface Block<T extends Structure = {}, P extends Structure = Structure>
{
    readonly hash: Readonly<Uint8Array>,
    readonly time: number,
    readonly prev: Readonly<Uint8Array>,
    readonly data: Readonly<StructInstance<T>>,
    readonly prevBlock?: Block<Structure, P>,
}

export const InitialData = struct({
    length: "i32",
    seed: "u32",
});
export const EatEvent = struct({
    x: "i32",
    y: "i32",
    food: u8(32),
});
export const GenFoodEvent = struct({
    x: "i32",
    y: "i32",
    score: "i32",
});

export const Block = {
    new<T extends Structure, P extends Structure>(data: StructInstance<T>, previous?: Block<P>): Readonly<Block<T, P>>
    {
        const Block = struct({
            time: "i64",
            prev: u8(32),
            data: u8(data[internalBuffer].byteLength),
        });
        const block = new Block();
        block.time = Date.now();
        if (previous)
            block.prev = previous.hash as Uint8Array;
        block.data = new Uint8Array(data[internalBuffer]);
        // createHash("sha256").write(new Uint8Array(block[internalBuffer])).digest();
        const hash = Uint8Array.from(sha256().update(new Uint8Array(block[internalBuffer])).digest());
        return Object.seal(<Block<T, P>>{
            hash: hash,
            time: block.time,
            prev: block.prev,
            data: data,
            prevBlock: previous
        });
    },
    serialize<T extends Structure>(block: Block<T>)
    {
        return {
            hash: b64.fromByteArray(block.hash as Uint8Array),
            time: block.time,
            prev: b64.fromByteArray(block.prev as Uint8Array),
            data: block.data.sereialize("b64"),
        }
    }
}