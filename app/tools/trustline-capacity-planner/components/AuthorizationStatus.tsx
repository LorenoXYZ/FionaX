import { copy } from "@/app/tools/trustline-capacity-planner/copy";
import type { AuthorizationState } from "@/app/tools/trustline-capacity-planner/types";

const stateCopy: Record<AuthorizationState, { label: string; tone: "success" | "warning" | "error"; note: string }> = {
  authorized: {
    label: "Fully authorized",
    tone: "success",
    note: "This trustline can receive new funds up to the headroom shown above."
  },
  authorized_to_maintain_liabilities: {
    label: "Maintain liabilities only",
    tone: "warning",
    note: "This trustline can keep existing balances and pay down liabilities, but cannot receive new funds."
  },
  unauthorized: {
    label: "Unauthorized",
    tone: "error",
    note: "This trustline cannot receive any funds until the issuer authorizes it."
  }
};

const toneStyles: Record<AuthorizationState, string> = {
  authorized: "border-[#70c7a7]/70 bg-[#e1f8ef] text-[#17664b]",
  authorized_to_maintain_liabilities: "border-[#ffc3a8]/80 bg-[#fff2e9] text-[#9a513f]",
  unauthorized: "border-[#ff9a8b]/75 bg-[#fff0ee] text-[#9f342d]"
};

/**
 * Renders authorization state separately from numeric headroom: a
 * maintain-liabilities-only or unauthorized trustline has zero real receiving
 * capacity even when the number is positive.
 */
export function AuthorizationStatus({ authorization }: { authorization: AuthorizationState }) {
  const info = stateCopy[authorization];
  return (
    <div className={`rounded-lg border p-4 ${toneStyles[authorization]}`}>
      <p className="text-sm font-extrabold">
        {copy.authorizationLabel}: {info.label}
      </p>
      <p className="mt-1 text-sm text-[#4e5c73]">{info.note}</p>
    </div>
  );
}
