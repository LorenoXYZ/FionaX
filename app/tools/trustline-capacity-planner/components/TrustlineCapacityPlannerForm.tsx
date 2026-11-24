"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { copy } from "@/app/tools/trustline-capacity-planner/copy";
import type { SubmitFields } from "@/app/tools/trustline-capacity-planner/hooks/useTrustlineCapacityPlanner";

interface Props {
  onSubmit: (fields: SubmitFields) => void;
  loading: boolean;
}

export function TrustlineCapacityPlannerForm({ onSubmit, loading }: Props) {
  const [accountId, setAccountId] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [issuerId, setIssuerId] = useState("");
  const [rawRecord, setRawRecord] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ accountId, assetCode, issuerId, rawRecord });
      }}
      className="space-y-4"
    >
      <label htmlFor="tcp-account-id" className="text-sm font-bold text-[#4e5c73]">
        Account ID
      </label>
      <Input
        id="tcp-account-id"
        value={accountId}
        onChange={(event) => setAccountId(event.target.value)}
        placeholder="G… account that holds the trustline"
        autoComplete="off"
        spellCheck={false}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tcp-asset-code" className="text-sm font-bold text-[#4e5c73]">
            Asset code
          </label>
          <Input
            id="tcp-asset-code"
            value={assetCode}
            onChange={(event) => setAssetCode(event.target.value)}
            placeholder="USDC"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div>
          <label htmlFor="tcp-issuer-id" className="text-sm font-bold text-[#4e5c73]">
            Issuer ID
          </label>
          <Input
            id="tcp-issuer-id"
            value={issuerId}
            onChange={(event) => setIssuerId(event.target.value)}
            placeholder="G… issuer of the asset"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
      <label htmlFor="tcp-record" className="text-sm font-bold text-[#4e5c73]">
        Horizon balance record
      </label>
      <textarea
        id="tcp-record"
        value={rawRecord}
        onChange={(event) => setRawRecord(event.target.value)}
        rows={8}
        placeholder='{"balance":"12.0000000","limit":"100.0000000", …}'
        className="min-h-24 w-full rounded-md border border-[#c7d6e8] bg-white/78 px-4 py-3 font-mono text-sm text-[#172033] outline-none transition placeholder:text-[#8a98aa] focus:border-[#47a8c7] focus:ring-2 focus:ring-[#8edcf4]/35"
        spellCheck={false}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Planning…" : copy.submit}
      </Button>
    </form>
  );
}
