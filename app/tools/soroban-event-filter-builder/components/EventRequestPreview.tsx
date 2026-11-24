export function EventRequestPreview({ preview }: { preview: string }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-[#172033] p-4 text-xs text-white" aria-label="getEvents request preview">
      {preview}
    </pre>
  );
}
