export function formatSize(size: string): string {
  return `${size} bytes`;
}

export function formatStatus(status: string): string {
  if (status === "missing") return "not in this module";
  if (status === "undecodable") return "present, XDR not decoded";
  return "present";
}
