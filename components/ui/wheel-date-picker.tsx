"use client";

import * as React from "react";
import { format, addDays, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X, Calendar as CalendarIcon, ChevronUp, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
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

// French day abbreviations matching screenshot: Dim, Lun, Mar, Mer, Jeu, Ven, Sa
const SHORT_DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sa"];
const SHORT_MONTHS_FR = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
];

const YEARS = [2025, 2026, 2027, 2028];

interface WheelDayItem {
  text: string;
  dayText: string;
  monthText: string;
  year: number;
  dateStr: string;
  dateObj: Date;
  isFirstDayOfMonth: boolean;
  isFirstDayOfYear: boolean;
}

// Full continuous chronological calendar from 2025-01-01 through 2028-12-31
function buildFullCalendarDays(): WheelDayItem[] {
  const list: WheelDayItem[] = [];
  const start = new Date(2025, 0, 1);
  const end = new Date(2028, 11, 31);
  const cur = new Date(start);

  while (cur <= end) {
    const dayName = SHORT_DAYS_FR[cur.getDay()];
    const dayNum = cur.getDate();
    const monthName = SHORT_MONTHS_FR[cur.getMonth()];
    const year = cur.getFullYear();

    list.push({
      text: `${dayName} ${dayNum} ${monthName} ${year}`,
      dayText: `${dayName} ${dayNum}`,
      monthText: monthName,
      year,
      dateStr: format(cur, "yyyy-MM-dd"),
      dateObj: new Date(cur),
      isFirstDayOfMonth: dayNum === 1,
      isFirstDayOfYear: dayNum === 1 && cur.getMonth() === 0,
    });

    cur.setDate(cur.getDate() + 1);
  }

  return list;
}

export function WheelDatePicker({
  value,
  onChange,
  isOpen,
  onClose,
  title = "Sélection de la date",
  subtitle = "Disponibilités :",
  fieldLabel = "Date de facturation",
}: WheelDatePickerProps) {
  // Stable full calendar days list spanning 2025 to 2028
  const daysList = React.useMemo(() => buildFullCalendarDays(), []);

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

  // Active year dynamically calculated from current selectedDate
  const currentYear = selectedDate.getFullYear();
  const currentMonthIdx = selectedDate.getMonth();

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
  const scrollToActive = React.useCallback(
    (smooth = false) => {
      const activeDateStr = format(selectedDate, "yyyy-MM-dd");
      const dayIdx = daysList.findIndex((d) => d.dateStr === activeDateStr);
      if (dayIdx >= 0 && daysColRef.current) {
        if (smooth) {
          daysColRef.current.scrollTo({
            top: dayIdx * ITEM_HEIGHT,
            behavior: "smooth",
          });
        } else {
          daysColRef.current.scrollTop = dayIdx * ITEM_HEIGHT;
        }
      }
      if (hoursColRef.current) {
        hoursColRef.current.scrollTop = selectedHour * ITEM_HEIGHT;
      }
      if (minutesColRef.current) {
        minutesColRef.current.scrollTop = selectedMinute * ITEM_HEIGHT;
      }
    },
    [daysList, selectedDate, selectedHour, selectedMinute]
  );

  // When opened, scroll into position
  React.useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => scrollToActive(false), 60);
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
    const targetStr = format(target, "yyyy-MM-dd");
    const idx = daysList.findIndex((d) => d.dateStr === targetStr);
    if (idx >= 0 && daysColRef.current) {
      setSelectedDate(target);
      daysColRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
    }
  };

  const setEndOfMonth = () => {
    const now = selectedDate;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const targetStr = format(lastDay, "yyyy-MM-dd");
    const idx = daysList.findIndex((d) => d.dateStr === targetStr);
    if (idx >= 0 && daysColRef.current) {
      setSelectedDate(lastDay);
      daysColRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
    }
  };

  // Jump to specific year smoothly
  const handleJumpToYear = (year: number) => {
    const d = new Date(selectedDate);
    d.setFullYear(year);
    const targetStr = format(d, "yyyy-MM-dd");
    let idx = daysList.findIndex((item) => item.dateStr === targetStr);
    if (idx === -1) {
      // Fallback to Jan 1st of that year
      const fallback = new Date(year, 0, 1);
      idx = daysList.findIndex((item) => item.dateStr === format(fallback, "yyyy-MM-dd"));
    }
    if (idx >= 0 && daysColRef.current) {
      setSelectedDate(daysList[idx].dateObj);
      daysColRef.current.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }
  };

  // Jump to specific month smoothly
  const handleJumpToMonth = (monthIdx: number) => {
    const d = new Date(currentYear, monthIdx, 1);
    const targetStr = format(d, "yyyy-MM-dd");
    const idx = daysList.findIndex((item) => item.dateStr === targetStr);
    if (idx >= 0 && daysColRef.current) {
      setSelectedDate(daysList[idx].dateObj);
      daysColRef.current.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean, bold Card Frame with complete 2026/2027 continuous calendar */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 flex flex-col items-center dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
          
          {/* Main Title - in bold */}
          <div className="text-center w-full">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            
            {/* Horizontal Divider Line matching screenshot */}
            <div className="w-16 h-1 bg-slate-900 dark:bg-slate-200 mx-auto my-3 rounded-full" />

            {/* Subtitle / Availability Label - in bold */}
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              {subtitle}
            </p>
            
            {/* Highlight of currently active date - prominent, bold with active year */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-200 rounded-full text-xs font-extrabold shadow-xs">
              <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="capitalize text-sm">
                {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>

          {/* Dynamic Year Switcher matching user request (2025, 2026, 2027, 2028) */}
          <div className="w-full mt-4 flex items-center justify-between gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase px-2 tracking-wider">
              Année :
            </span>
            <div className="flex items-center gap-1">
              {YEARS.map((yr) => {
                const isActive = currentYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => handleJumpToYear(yr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 scale-105"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Month Bar for fast navigation through all 12 months */}
          <div className="w-full mt-2 flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-0.5">
            {SHORT_MONTHS_FR.map((m, idx) => {
              const isSelectedMonth = currentMonthIdx === idx;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleJumpToMonth(idx)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${
                    isSelectedMonth
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-black"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* 3-Column Roller / Drum Calendar matching screenshot */}
          <div className="relative w-full h-[220px] my-3 overflow-hidden select-none bg-slate-50 rounded-2xl border border-slate-200/80 dark:bg-slate-950/50 dark:border-slate-800">
            
            {/* Center Selection Frame: 2 subtle horizontal separator lines */}
            <div 
              className="absolute left-0 right-0 top-[88px] h-[44px] border-y-2 border-slate-400/80 dark:border-slate-600 pointer-events-none z-20 bg-slate-200/30 dark:bg-slate-800/40"
            />

            {/* Top & Bottom Vignette / Drum Fade Gradients */}
            <div className="absolute top-0 left-0 right-0 h-[88px] bg-gradient-to-b from-slate-50 via-slate-50/85 to-transparent pointer-events-none z-20 dark:from-slate-900 dark:via-slate-900/85" />
            <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-slate-50 via-slate-50/85 to-transparent pointer-events-none z-20 dark:from-slate-900 dark:via-slate-900/85" />

            {/* The 3 Columns Grid */}
            <div className="grid grid-cols-12 h-full relative z-10">
              
              {/* Column 1: Dates (Day, Month, and Year badge) */}
              <div 
                ref={daysColRef}
                className="col-span-7 h-full overflow-y-auto no-scrollbar scroll-smooth py-[88px]"
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
                  const isThisYear = item.year === currentYear;
                  return (
                    <div
                      key={item.dateStr}
                      onClick={() => {
                        setSelectedDate(item.dateObj);
                        if (daysColRef.current) {
                          daysColRef.current.scrollTop = idx * ITEM_HEIGHT;
                        }
                      }}
                      style={{ height: `${ITEM_HEIGHT}px`, scrollSnapAlign: "center" }}
                      className={`flex items-center justify-end pr-3 cursor-pointer transition-all duration-150 gap-1.5 ${
                        isSelected
                          ? "font-black text-slate-950 dark:text-white text-base scale-105 tracking-wide"
                          : isThisYear
                          ? "text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-slate-950"
                          : "text-slate-400 dark:text-slate-500 font-semibold text-xs hover:text-slate-700"
                      }`}
                    >
                      <span>
                        {item.dayText} {item.monthText}
                      </span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : item.year === 2027
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : item.year === 2026
                            ? "bg-slate-200/90 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.year}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: Hours (ex: 7, 8, 9, 10, 11...) */}
              <div 
                ref={hoursColRef}
                className="col-span-2 h-full overflow-y-auto no-scrollbar scroll-smooth py-[88px]"
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
                          ? "font-black text-slate-950 dark:text-white text-base scale-105"
                          : "text-slate-600 dark:text-slate-400 font-semibold text-sm hover:text-slate-900"
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
                      className={`flex items-center justify-start pl-3 cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "font-black text-slate-950 dark:text-white text-base scale-105"
                          : "text-slate-600 dark:text-slate-400 font-semibold text-sm hover:text-slate-900"
                      }`}
                    >
                      <span>{String(m).padStart(2, "0")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons for Invoicing - in bold */}
          <div className="w-full flex items-center justify-center gap-2 flex-wrap pb-3">
            <button
              type="button"
              onClick={() => setPreset(0)}
              className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => setPreset(15)}
              className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              +15 jours
            </button>
            <button
              type="button"
              onClick={() => setPreset(30)}
              className="px-3 py-1 text-xs font-extrabold bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-900/60 dark:text-blue-200 rounded-lg transition-colors shadow-xs"
            >
              +30 jours
            </button>
            <button
              type="button"
              onClick={() => setEndOfMonth()}
              className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              Fin du mois
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 h-11 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Appliquer la date</span>
            </Button>
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
