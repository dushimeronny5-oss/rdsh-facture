"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  DisplayInvoiceStatus,
  STATUS_BADGE_VARIANTS,
  STATUS_LABELS,
} from "@/lib/invoice/status";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { updateInvoiceStatusAction } from "@/app/actions/invoices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StatusBadgeProps {
  status: DisplayInvoiceStatus;
  invoiceId?: string;
  invoiceNumber?: string;
  interactive?: boolean;
  className?: string;
  onStatusChange?: (newStatus: DisplayInvoiceStatus) => void;
}

const STATUS_OPTIONS: Array<{
  value: DisplayInvoiceStatus;
  label: string;
  dotColor: string;
  description: string;
}> = [
  {
    value: "paid",
    label: "Payée",
    dotColor: "bg-emerald-500",
    description: "Règlement encaissé avec succès",
  },
  {
    value: "sent",
    label: "En attente",
    dotColor: "bg-blue-500",
    description: "Facture envoyée au client",
  },
  {
    value: "overdue",
    label: "En retard",
    dotColor: "bg-amber-500",
    description: "Date d'échéance dépassée",
  },
  {
    value: "draft",
    label: "Brouillon",
    dotColor: "bg-slate-400",
    description: "Non encore envoyée au client",
  },
  {
    value: "cancelled",
    label: "Annulée",
    dotColor: "bg-red-500",
    description: "Facture caduque ou annulée",
  },
];

const dotColors: Record<DisplayInvoiceStatus, string> = {
  draft: "bg-slate-400",
  sent: "bg-blue-500",
  paid: "bg-emerald-500",
  overdue: "bg-amber-500",
  cancelled: "bg-red-500",
};

export function StatusBadge({
  status,
  invoiceId,
  invoiceNumber,
  interactive = false,
  className,
  onStatusChange,
}: StatusBadgeProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = React.useState<DisplayInvoiceStatus>(status);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const variant = STATUS_BADGE_VARIANTS[currentStatus] || "secondary";
  const label = STATUS_LABELS[currentStatus] || currentStatus;

  const handleSelectStatus = async (newStatus: DisplayInvoiceStatus) => {
    if (newStatus === currentStatus) return;
    if (!invoiceId) return;

    const prev = currentStatus;
    setCurrentStatus(newStatus);
    setIsUpdating(true);

    try {
      const res = await updateInvoiceStatusAction(invoiceId, newStatus);
      if (!res.success) {
        throw new Error(res.error || "Erreur de mise à jour");
      }
      onStatusChange?.(newStatus);
      toast.success(
        `Statut ${invoiceNumber ? `de ${invoiceNumber}` : ""} mis à jour : ${STATUS_LABELS[newStatus]}`
      );
      router.refresh();
    } catch (err: any) {
      console.error("Erreur changement de statut:", err);
      setCurrentStatus(prev);
      toast.error(err?.message || "Impossible de mettre à jour le statut.");
    } finally {
      setIsUpdating(false);
    }
  };

  const badgeContent = (
    <Badge
      variant={variant}
      className={cn(
        "gap-1.5 py-1 px-2.5 font-medium rounded-full transition-all select-none",
        interactive &&
          "cursor-pointer hover:shadow-sm hover:scale-[1.03] active:scale-[0.98] group ring-1 ring-black/5 dark:ring-white/10",
        className
      )}
    >
      {isUpdating ? (
        <Loader2 className="h-3 w-3 animate-spin text-current" />
      ) : (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            dotColors[currentStatus] || "bg-slate-400"
          )}
        />
      )}
      <span>{label}</span>
      {interactive && (
        <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 group-hover:opacity-100 transition-opacity" />
      )}
    </Badge>
  );

  if (!interactive || !invoiceId) {
    return badgeContent;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild title="Cliquer pour changer le statut">
        <button
          type="button"
          className="focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-full"
        >
          {badgeContent}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 p-1.5 shadow-xl">
        <DropdownMenuLabel className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
          Changer le statut
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = opt.value === currentStatus;
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => handleSelectStatus(opt.value)}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors",
                isSelected
                  ? "bg-slate-100 dark:bg-slate-800 font-semibold"
                  : "hover:bg-slate-50 dark:hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", opt.dotColor)} />
                <div>
                  <p className="text-slate-800 dark:text-slate-100 font-medium">
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-slate-400">{opt.description}</p>
                </div>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
