"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatFBu } from "@/lib/format";

interface RevenueChartProps {
  data: Array<{
    month: string;
    billed: number;
    paid: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="h-[380px] flex items-center justify-center border-slate-200/90 dark:border-slate-800">
        <div className="text-sm text-slate-400">Chargement du graphique...</div>
      </Card>
    );
  }

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg dark:bg-slate-900 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 mb-1">{label} 2026</p>
          <div className="space-y-1">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Encaissé : <span className="font-bold">{formatFBu(payload[0]?.value)}</span>
            </p>
            {payload[1] && (
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Facturé : <span className="font-bold">{formatFBu(payload[1]?.value)}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-slate-200/90 shadow-sm dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            Évolution des encaissements
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Comparatif facturé vs encaissé (en Francs Burundais FBu)
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Encaissé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">Facturé</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="billedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={customTooltip} />
              <Area
                type="monotone"
                dataKey="paid"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#paidGrad)"
              />
              <Area
                type="monotone"
                dataKey="billed"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#billedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
