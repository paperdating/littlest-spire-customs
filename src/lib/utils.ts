/** Generate a tracking code like LSP-A3K9P2 */
export function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LSP-${code}`;
}

/** Simple CSV parser (handles quoted fields) */
export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    if (values.length === 0 || values.every((v) => !v.trim())) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export type CommissionStatus =
  | "queued"
  | "accepted"
  | "materials_ordered"
  | "in_progress"
  | "quality_check"
  | "shipped"
  | "completed"
  | "cancelled";

export const STATUS_LABELS: Record<string, string> = {
  queued: "Queued",
  accepted: "Accepted",
  materials_ordered: "Materials Ordered",
  in_progress: "In Progress",
  quality_check: "Quality Check",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
  queued: "bg-slate-600",
  accepted: "bg-blue-600",
  materials_ordered: "bg-indigo-600",
  in_progress: "bg-violet-600",
  quality_check: "bg-amber-600",
  shipped: "bg-emerald-600",
  completed: "bg-green-600",
  cancelled: "bg-red-700",
};
