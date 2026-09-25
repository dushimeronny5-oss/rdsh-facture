import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { DisplayInvoiceStatus, STATUS_BADGE_VARIANTS, STATUS_LABELS } from "@/lib/invoice/status";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: DisplayInvoiceStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = STATUS_BADGE_VARIANTS[status] || "secondary";
  const label = STATUS_LABELS[status] || status;

  const dotColors: Record<DisplayInvoiceStatus, string> = {
    draft: "bg-slate-400",
    sent: "bg-blue-500",
    paid: "bg-emerald-500",
    overdue: "bg-amber-500",
    cancelled: "bg-red-500",
  };

  return (
    <Badge
      variant={variant}
      className={cn("gap-1.5 py-1 px-2.5 font-medium rounded-full", className)}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", dotColors[status] || "bg-slate-400")}
      />
      {label}
    </Badge>
  );
}
