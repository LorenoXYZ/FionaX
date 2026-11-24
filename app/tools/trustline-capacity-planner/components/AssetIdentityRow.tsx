interface Props {
  accountId: string;
  assetCode: string;
  issuerId: string;
}

/**
 * Shows the complete asset identity — account, code, and issuer — so a reader
 * can confirm the result was bound to the intended trustline.
 */
export function AssetIdentityRow({ accountId, assetCode, issuerId }: Props) {
  return (
    <div className="space-y-2 rounded-lg border border-[#cfe0ea] bg-white/70 p-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-[#68758a]">Account</span>
          <p className="break-all font-mono text-[#172033]">{accountId}</p>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-[#68758a]">Asset</span>
          <p className="break-all font-mono text-[#172033]">{assetCode.toUpperCase()}</p>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-[#68758a]">Issuer</span>
          <p className="break-all font-mono text-[#172033]">{issuerId}</p>
        </div>
      </div>
    </div>
  );
}
