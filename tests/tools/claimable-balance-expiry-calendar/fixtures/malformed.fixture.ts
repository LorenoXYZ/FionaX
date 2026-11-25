import { balance } from "./normal.fixture";
export const missingPredicate={...balance,claimants:[{destination:balance.claimants[0].destination}]};
export const unknownPredicate={...balance,claimants:[{destination:balance.claimants[0].destination,predicate:{laterThan:"123"}}]};
export const oversizedAmount={...balance,amount:"922337203685.4775808"};
