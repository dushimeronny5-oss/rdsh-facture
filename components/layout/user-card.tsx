"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, ChevronDown, User, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUserAction, signOutAction } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";

export function UserCard() {
  let router: any = null;
  try {
    router = useRouter();
  } catch {
    // In test mock environments
  }
  const [user, setUser] = React.useState<{
    id: string;
    email?: string;
    name?: string;
  } | null>(null);

  React.useEffect(() => {
    getCurrentUserAction().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutAction();
      toast.success("Vous avez été déconnecté.");
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const displayName = user?.name || "RDSH Solutions Tech";
  const displayEmail = user?.email || "contact@rdsh-digital.bi";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "RD";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors cursor-pointer dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate dark:text-slate-100">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {displayEmail}
              </p>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-lg">
        <DropdownMenuLabel className="font-normal px-2.5 py-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Paramètres entreprise</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/clients"
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Annuaire clients</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/40 rounded-lg cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 text-red-600" />
          <span className="font-semibold">Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
