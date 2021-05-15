export interface RankedScore
{
    name: String;
    score: number;
    time: number;
}
declare const GameAPI: (baseUrl?: string) => {
    Rank: {
        getRankedScores: (params: Required<{
            key: string;
        }> & Partial<{}> & Required<{}> & Partial<{
            skip: number;
            count: number;
        }>) => Promise<RankedScore[]>;
        postScore: (params: Required<{
            key: string;
        }> & Partial<{}> & Required<{}> & Partial<{}>, body: {
            name: string;
            score: number;
            data?: any;
        }) => Promise<number>;
    };
};
declare global
{
    namespace SardineFish
    {
        const Games: typeof GameAPI;
    }
}