import { getHorizonServer, STELLAR_NETWORK, type StellarNetwork } from "@/lib/stellar/horizon";

/**
 * The minimal Horizon account-loading surface this tool needs. `Horizon.Server`
 * already satisfies this; tests inject a fake instead — there is no mocking
 * library in this project, so dependency injection is the mock seam.
 */
export interface SequenceAccountLoader {
  loadAccount: (accountId: string) => Promise<{ sequence: string }>;
}

/**
 * Fetches the account's current sequence number from Horizon.
 *
 * The Stellar SDK already types `AccountResponse.sequence` as a `string`
 * (a 64-bit integer serialized as decimal text), so the raw value is
 * returned as-is — never routed through `Number()`.
 */
export async function fetchAccountSequence(
  accountId: string,
  network: StellarNetwork = STELLAR_NETWORK,
  loader: SequenceAccountLoader = getHorizonServer(network)
): Promise<string> {
  const account = await loader.loadAccount(accountId);
  return account.sequence;
}
