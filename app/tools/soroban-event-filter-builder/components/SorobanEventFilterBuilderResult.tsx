import { EventRequestPreview } from "@/app/tools/soroban-event-filter-builder/components/EventRequestPreview";
import { FilterLimitNotice } from "@/app/tools/soroban-event-filter-builder/components/FilterLimitNotice";
import { TopicFilterRows } from "@/app/tools/soroban-event-filter-builder/components/TopicFilterRows";
import { copy } from "@/app/tools/soroban-event-filter-builder/copy";
import type { EventFilterResult } from "@/app/tools/soroban-event-filter-builder/types";

export function SorobanEventFilterBuilderResult({ result }: { result: EventFilterResult }) {
  return (
    <section aria-label={copy.resultTitle} className="space-y-4">
      <h2 className="text-lg font-bold text-[#172033]">{copy.resultTitle}</h2>
      {result.completeness === "incomplete" ? <FilterLimitNotice missing={result.missing} /> : null}
      {result.filters.map((filter, index) => (
        <div key={index}>
          <p className="text-sm font-bold text-[#4e5c73]">
            Filter {index + 1}
            {filter.contractIds.length > 0 ? `: ${filter.contractIds.join(", ")}` : ""}
          </p>
          <TopicFilterRows topics={filter.topics} />
        </div>
      ))}
      <EventRequestPreview preview={result.preview} />
    </section>
  );
}
