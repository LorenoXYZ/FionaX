import { formatSignerKey, formatSignerType, formatWeight } from "@/app/tools/signer-quorum-simulator/lib/format";
import type { AccountSigner } from "@/app/tools/signer-quorum-simulator/types";

/**
 * Show the public signer identities available on the account so the user can
 * pick a local subset without re-reading the raw JSON. Purely informational;
 * selection is typed into the form, never mutated here.
 */
export function SignerSelection({ signers }: { signers: AccountSigner[] }) {
  if (signers.length === 0) {
    return <p className="text-sm text-[#68758a]">This account has no listed signers.</p>;
  }

  return (
    <div>
      <h3 className="text-sm font-extrabold text-[#172033]">Available signers</h3>
      <ul className="mt-2 divide-y divide-[#e3ecf5] rounded-lg border border-[#c7d6e8] bg-white/70">
        {signers.map((s) => (
          <li key={s.key} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <div className="min-w-0">
              <p className="truncate font-mono text-xs text-[#172033]" title={s.key}>
                {s.isMasterKey ? "master key" : formatSignerKey(s.key)}
              </p>
              <p className="text-xs text-[#68758a]">{formatSignerType(s.type)}</p>
            </div>
            <span className="font-bold text-[#172033]">{formatWeight(s.weight)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
