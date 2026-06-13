import type { LeadStatus } from "@/lib/constants";

const MAP: Record<string, [string, string]> = {
  new: ["new", "NEW"],
  contacted: ["info", "CONTACTED"],
  scheduled: ["warn", "SCHEDULED"],
  done: ["good", "DONE"],
};

export function StatusBadge({ status }: { status: LeadStatus | string }) {
  const [cls, label] = MAP[status] ?? ["muted", status];
  return (
    <span className={"badge badge--" + cls}>
      <span className="dot" />
      {label}
    </span>
  );
}
