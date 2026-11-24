import { formatTopic } from "@/app/tools/soroban-event-filter-builder/lib/format";
import type { EncodedSegment } from "@/app/tools/soroban-event-filter-builder/types";

export function TopicFilterRows({ topics }: { topics: EncodedSegment[][] }) {
  if (topics.length === 0) return <p className="text-sm text-[#4e5c73]">No topic filter. Every topic matches.</p>;
  return (
    <ul className="space-y-2">
      {topics.map((topic, index) => (
        <li key={index} className="break-all font-mono text-sm text-[#172033]">
          {formatTopic(topic)}
        </li>
      ))}
    </ul>
  );
}
