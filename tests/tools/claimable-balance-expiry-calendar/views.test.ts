import { it,expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { ClaimableBalanceExpiryCalendarResult } from "@/app/tools/claimable-balance-expiry-calendar/components/ClaimableBalanceExpiryCalendarResult";
import { ClaimableBalanceExpiryCalendarEmptyState } from "@/app/tools/claimable-balance-expiry-calendar/components/ClaimableBalanceExpiryCalendarEmptyState";
import type { Result } from "@/app/tools/claimable-balance-expiry-calendar/types";
const base:Result={network:"testnet",claimant:"G",known:[],unresolved:[],pagesFetched:5,recordsFetched:100,complete:false,nextCursor:"100",source:"https://horizon-testnet.stellar.org"};
it("renders initial guidance and incomplete evidence with an accessible notice",()=>{expect(renderToStaticMarkup(createElement(ClaimableBalanceExpiryCalendarEmptyState))).toContain("public Stellar G address");const html=renderToStaticMarkup(createElement(ClaimableBalanceExpiryCalendarResult,{result:base}));expect(html).toContain("Incomplete evidence");expect(html).toContain('role="status"');expect(html).toContain("100 balance records");});
it("shows empty result only when a complete empty page is observed",()=>{const html=renderToStaticMarkup(createElement(ClaimableBalanceExpiryCalendarResult,{result:{...base,complete:true,pagesFetched:1,recordsFetched:0,nextCursor:undefined}}));expect(html).toContain("No claimable balances");expect(html).toContain("End of claimant pages observed");});
