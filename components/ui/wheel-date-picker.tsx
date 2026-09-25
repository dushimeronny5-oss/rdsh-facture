"use client";

import * as React from "react";
import { format, addDays, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Calendar as CalendarIcon, ChevronUp, ChevronDown, Sparkles, Clock, Smartphone } from "lucide-react";
import { Button } from "./button";

interface WheelDatePickerProps {
  value: string; // ISO date string YYYY-MM-DD
  onChange: (newDate: string) => void;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  fieldLabel?: string;
}

// French day abbreviations matching screenshot exactly: Dim, Lun, Mar, Mer, Jeu, Ven, Sa
const SHORT_DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sa"];
const SHORT_MONTHS_FR = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
];

function formatWheelDay(d: Date): { text: string; dateStr: string; dateObj: Date } {
  const dayName = SHORT_DAYS_FR[d.getDay()];
  const dayNum = d.getDate();
  const monthName = SHORT_MONTHS_FR[d.getMonth()];
  return {
    text: `${dayName} ${dayNum} ${monthName}`,
    dateStr: format(d, "yyyy-MM-dd"),
    dateObj: d,
  };
}

export function WheelDatePicker({
  value,
  onChange,
  isOpen,
  onClose,
  title = "Réservez en ligne",
  subtitle = "Disponibilités :",
  fieldLabel = "Date de facturation",
}: WheelDatePickerProps) {
  // Parse initial date
  const initialDate = React.useMemo(() => {
    try {
      if (value && isValid(parseISO(value))) {
        return parseISO(value);
      }
    } catch {}
    return new Date();
  }, [value]);

  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);
  const [selectedHour, setSelectedHour] = React.useState<number>(10);
  const [selectedMinute, setSelectedMinute] = React.useState<number>(0);

  // Generate 120 days window centered around the selected date (±60 days)
  const daysList = React.useMemo(() => {
    const list: Array<{ text: string; dateStr: string; dateObj: Date }> = [];
    const base = new Date(selectedDate);
    // 60 days before to 60 days after
    for (let i = -60; i <= 60; i++) {
      const d = addDays(base, i);
      list.push(formatWheelDay(d));
    }
    return list;
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  // Hours: 0 to 23
  const hoursList = React.useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i);
  }, []);

  // Minutes: 0 to 59
  const minutesList = React.useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => i);
  }, []);

  // Sync internal state when value or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      try {
        if (value && isValid(parseISO(value))) {
          setSelectedDate(parseISO(value));
        }
      } catch {}
    }
  }, [isOpen, value]);

  // Refs for scroll columns
  const daysColRef = React.useRef<HTMLDivElement>(null);
  const hoursColRef = React.useRef<HTMLDivElement>(null);
  const minutesColRef = React.useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 44; // px per row

  // Scroll to active index
  const scrollToActive = React.useCallback(() => {
    const activeDateStr = format(selectedDate, "yyyy-MM-dd");
    const dayIdx = daysList.findIndex((d) => d.dateStr === activeDateStr);
    if (dayIdx >= 0 && daysColRef.current) {
      daysColRef.current.scrollTop = dayIdx * ITEM_HEIGHT;
    }
    if (hoursColRef.current) {
      hoursColRef.current.scrollTop = selectedHour * ITEM_HEIGHT;
    }
    if (minutesColRef.current) {
      minutesColRef.current.scrollTop = selectedMinute * ITEM_HEIGHT;
    }
  }, [daysList, selectedDate, selectedHour, selectedMinute]);

  // When opened, scroll into position
  React.useEffect(() => {
    if (isOpen) {
      const t = setTimeout(scrollToActive, 80);
      return () => clearTimeout(t);
    }
  }, [isOpen, scrollToActive]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    onChange(formattedDate);
    onClose();
  };

  const setPreset = (offsetDays: number) => {
    const target = addDays(new Date(), offsetDays);
    setSelectedDate(target);
  };

  const setEndOfMonth = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setSelectedDate(lastDay);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Smartphone Shell Mockup matching the screenshot */}
        <div className="relative bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 overflow-hidden">
          
          {/* Phone Speaker Cutout & Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2 z-30">
            <div className="w-12 h-1 bg-slate-700 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700" />
          </div>

          {/* Phone Screen Canvas */}
          <div className="bg-white rounded-[34px] pt-8 pb-5 px-5 text-slate-900 shadow-inner flex flex-col items-center dark:bg-white dark:text-slate-900">
            
            {/* Phone Top Status Bar */}
            <div className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 px-3 pb-3">
              <span className="font-medium tracking-tight">SiteExact / RDSH</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">12:30</span>
                <div className="w-4 h-2 border border-slate-400 rounded-xs p-0.5 flex items-center">
                  <div className="h-full w-2.5 bg-slate-700 rounded-xs" />
                </div>
              </div>
            </div>

            {/* Main Title matching screenshot */}
            <div className="text-center w-full mt-1">
              <h3 className="text-2xl font-light tracking-tight text-slate-800">
                {title}
              </h3>
              
              {/* Horizontal Divider Line matching screenshot */}
              <div className="w-20 h-0.5 bg-slate-400 mx-auto my-3 rounded-full" />

              {/* Subtitle / Availability Label matching screenshot */}
              <p className="text-base font-normal text-slate-600 mb-1">
                {subtitle}
              </p>
              
              {/* Highlight of currently active date */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>
                  {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                </span>
              </div>
            </div>

            {/* 3-Column Roller / Drum Calendar matching screenshot */}
            <div className="relative w-full h-[220px] my-4 overflow-hidden select-none bg-slate-50/50 rounded-2xl border border-slate-100">
              
              {/* Center Selection Frame: 2 subtle horizontal separator lines */}
              <div 
                className="absolute left-0 right-0 top-[88px] h-[44px] border-y border-slate-300 pointer-events-none z-20 bg-slate-200/20"
              />

              {/* Top & Bottom Vignette / Drum Fade Gradients */}
              <div className="absolute top-0 left-0 right-0 h-[88px] bg-gradient-to-b from-white via-white/85 to-transparent pointer-events-none z-20" />
              <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none z-20" />

              {/* The 3 Columns Grid */}
              <div className="grid grid-cols-12 h-full relative z-10">
                
                {/* Column 1: Dates (French Day + Num + Month, ex: Mer 9 Sep) */}
                <div 
                  ref={daysColRef}
                  className="col-span-6 h-full overflow-y-auto no-scrollbar scroll-smooth py-[88px]"
                  style={{ scrollSnapType: "y mandatory" }}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const idx = Math.round(target.scrollTop / ITEM_HEIGHT);
                    const item = daysList[idx];
                    if (item && item.dateStr !== format(selectedDate, "yyyy-MM-dd")) {
                      setSelectedDate(item.dateObj);
                    }
                  }}
                >
                  {daysList.map((item, idx) => {
                    const isSelected = item.dateStr === format(selectedDate, "yyyy-MM-dd");
                    return (
                      <div
                        key={item.dateStr + idx}
                        onClick={() => {
                          setSelectedDate(item.dateObj);
                          if (daysColRef.current) {
                            daysColRef.current.scrollTop = idx * ITEM_HEIGHT;
                          }
                        }}
                        style={{ height: `${ITEM_HEIGHT}px`, scrollSnapAlign: "center" }}
                        className={`flex items-center justify-end pr-4 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "font-bold text-slate-950 text-base scale-105"
                            : "text-slate-400 font-normal text-sm hover:text-slate-600"
                        }`}
                      >
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Column 2: Hours (ex: 7, 8, 9, 10, 11...) */}
                <div 
                  ref={hoursColRef}
                  className="col-span-3 h-full overflow-y-auto no-scrollbar scroll-smooth py-[88px]"
                  style={{ scrollSnapType: "y mandatory" }}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const idx = Math.round(target.scrollTop / ITEM_HEIGHT);
                    if (hoursList[idx] !== undefined && hoursList[idx] !== selectedHour) {
                      setSelectedHour(hoursList[idx]);
                    }
                  }}
                >
                  {hoursList.map((h) => {
                    const isSelected = h === selectedHour;
                    return (
                      <div
                        key={h}
                        onClick={() => {
                          setSelectedHour(h);
                          if (hoursColRef.current) {
                            hoursColRef.current.scrollTop = h * ITEM_HEIGHT;
                          }
                        }}
                        style={{ height: `${ITEM_HEIGHT}px`, scrollSnapAlign: "center" }}
                        className={`flex items-center justify-center cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "font-bold text-slate-950 text-base scale-105"
                            : "text-slate-400 font-normal text-sm hover:text-slate-600"
                        }`}
                      >
                        <span>{String(h).padStart(2, "0")}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Column 3: Minutes (ex: 57, 58, 59, 00, 01, 02...) */}
                <div 
                  ref={minutesColRef}
                  className="col-span-3 h-full overflow-y-auto no-scrollbar scroll-smooth py-[88px]"
                  style={{ scrollSnapType: "y mandatory" }}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const idx = Math.round(target.scrollTop / ITEM_HEIGHT);
                    if (minutesList[idx] !== undefined && minutesList[idx] !== selectedMinute) {
                      setSelectedMinute(minutesList[idx]);
                    }
                  }}
                >
                  {minutesList.map((m) => {
                    const isSelected = m === selectedMinute;
                    return (
                      <div
                        key={m}
                        onClick={() => {
                          setSelectedMinute(m);
                          if (minutesColRef.current) {
                            minutesColRef.current.scrollTop = m * ITEM_HEIGHT;
                          }
                        }}
                        style={{ height: `${ITEM_HEIGHT}px`, scrollSnapAlign: "center" }}
                        className={`flex items-center justify-start pl-4 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "font-bold text-slate-950 text-base scale-105"
                            : "text-slate-400 font-normal text-sm hover:text-slate-600"
                        }`}
                      >
                        <span>{String(m).padStart(2, "0")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Preset Buttons for Invoicing */}
            <div className="w-full flex items-center justify-center gap-1.5 flex-wrap pt-1 pb-2">
              <button
                type="button"
                onClick={() => setPreset(0)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                type="button"
                onClick={() => setPreset(15)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                +15 jours
              </button>
              <button
                type="button"
                onClick={() => setPreset(30)}
                className="px-2.5 py-1 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors"
              >
                +30 jours
              </button>
              <button
                type="button"
                onClick={() => setEndOfMonth()}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Fin du mois
              </button>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="flex-1 h-10 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Appliquer la date</span>
              </Button>
            </div>

          </div>
        </div>

        {/* Floating close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 h-8 w-8 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center shadow-lg border border-slate-600 transition-colors"
          title="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
