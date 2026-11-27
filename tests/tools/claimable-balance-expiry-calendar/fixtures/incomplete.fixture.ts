import { pageOf20 } from "./boundary.fixture";
export const fiveFullPages=Array.from({length:5},(_,page)=>pageOf20.map((balance,i)=>({...balance,id:(page*20+i).toString(16).padStart(72,"0"),paging_token:String(page*20+i+1)})));
