declare const DEBUG: boolean;

export const API_ADDR = DEBUG ? "http://localhost:3000" : "https://www.sardinefish.com";

export const API = SardineFish.Games(API_ADDR);