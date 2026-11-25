import { balance } from "./normal.fixture";
export const pageOf20=Array.from({length:20},(_,i)=>({...balance,id:i.toString(16).padStart(72,"0"),paging_token:String(i+1)}));
export const futureEpoch="1893456000";
export const pastEpoch="946684800";
