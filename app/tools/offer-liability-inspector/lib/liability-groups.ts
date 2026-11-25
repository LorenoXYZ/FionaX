import type { HorizonAccount, LiabilityGroup, OfferEvidence } from "../types";
import { InspectorFailure } from "../types";
import { amountToStroops, assetFromWire } from "./format";
export function groupLiabilities(offers: OfferEvidence[], account: HorizonAccount): LiabilityGroup[] {
  if (!account || !Array.isArray(account.balances)) throw new InspectorFailure("malformed_data", "Account balances are missing.");
  const groups = new Map<string, LiabilityGroup>();
  for (const raw of account.balances) {
    if (!raw || typeof raw !== "object") throw new InspectorFailure("malformed_data", "Invalid account balance.");
    const balance = raw as Record<string, unknown>, asset = assetFromWire(balance);
    if (groups.has(asset.key)) throw new InspectorFailure("malformed_data", "Duplicate account balance asset.");
    groups.set(asset.key, { asset, balance: balance.balance === undefined ? undefined : amountToStroops(balance.balance), expectedSelling: 0n, expectedBuying: 0n, declaredSelling: balance.selling_liabilities === undefined ? undefined : amountToStroops(balance.selling_liabilities), declaredBuying: balance.buying_liabilities === undefined ? undefined : amountToStroops(balance.buying_liabilities), status: "incomplete" });
  }
  if (!groups.has("native")) throw new InspectorFailure("malformed_data", "Native balance is missing from the account response.");
  for (const offer of offers) {
    for (const asset of [offer.selling, offer.buying]) if (!groups.has(asset.key)) groups.set(asset.key, { asset, expectedSelling: 0n, expectedBuying: 0n, status: "incomplete" });
    groups.get(offer.selling.key)!.expectedSelling += offer.amount;
    groups.get(offer.buying.key)!.expectedBuying += offer.buyingAmount;
  }
  return [...groups.values()].sort((a, b) => a.asset.key.localeCompare(b.asset.key));
}
