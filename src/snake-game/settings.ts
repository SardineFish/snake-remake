export interface GameSettings
{
    resolutionScale: number,
    msaaSamples: number,
    hdr: "disable" | "16bit" | "32bit",
    postprocess: boolean,
}