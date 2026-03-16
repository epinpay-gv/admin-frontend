"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangeFilter } from "../hooks/useDataTable";

interface DataTableDatePickerProps {
  value: DateRangeFilter;
  onChange: (range: DateRangeFilter) => void;
  onClear: () => void;
}

export default function DataTableDatePicker({
  value,
  onChange,
  onClear,
}: DataTableDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const hasValue = value.from || value.to;

  const handleSelect = (range: DateRange | undefined) => {
    onChange({
      from: range?.from,
      to: range?.to,
    });
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-5 h-5 rounded flex items-center justify-center transition-all"
          style={{
            background: hasValue ? "rgba(0,198,162,0.2)" : "transparent",
            color: hasValue ? "#00C6A2" : "var(--text-muted)",
          }}
        >
          <CalendarIcon size={11} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-4 border"
        align="start"
        style={{
          background: "var(--background-secondary)",
          borderColor: "var(--border)",
          zIndex: 50,
        }}
      >
        <DayPicker
          mode="range"
          defaultMonth={value.from ?? new Date()}
          selected={{ from: value.from, to: value.to }}
          onSelect={handleSelect}
          numberOfMonths={1}
          locale={tr}
          toDate={new Date()}
          classNames={{
            months: "flex flex-col",
            month_caption: "flex justify-center items-center mb-3 relative",
            caption_label: "text-xs font-mono font-semibold uppercase tracking-wider",
            nav: "flex items-center gap-1",
            button_previous: "absolute left-0 p-1 rounded-lg transition-colors hover:opacity-70",
            button_next: "absolute right-0 p-1 rounded-lg transition-colors hover:opacity-70",
            month_grid: "w-full border-collapse",
            weekdays: "flex mb-1",
            weekday: "w-8 text-[10px] font-mono font-semibold text-center opacity-40",
            weeks: "flex flex-col gap-0.5",
            week: "flex",
            day: "w-8 h-8 text-center text-xs p-0",
            day_button: "w-8 h-8 rounded-lg text-xs font-mono transition-all hover:opacity-80 focus:outline-none w-full h-full flex items-center justify-center",
            selected: "",
            range_start: "!bg-[#00C6A2] !text-white rounded-lg",
            range_end: "!bg-[#00C6A2] !text-white rounded-lg",
            range_middle: "!bg-[rgba(0,198,162,0.15)] !text-[#00C6A2] rounded-none",
            today: "font-bold",
            outside: "opacity-20",
            disabled: "opacity-20 cursor-not-allowed",
          }}
          styles={{
            root: {
              fontSize: "13px",
              color: "var(--text-primary)",
            },
          }}
        />

        {/* Alt bilgi */}
        <div
          className="flex items-center justify-between pt-3 mt-1"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
            {value.from && !value.to
              ? `${format(value.from, "dd MMM", { locale: tr })} → bugün`
              : value.from && value.to
              ? `${format(value.from, "dd MMM", { locale: tr })} → ${format(value.to, "dd MMM", { locale: tr })}`
              : "Başlangıç tarihi seçin"}
          </p>
          {hasValue && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-[11px] font-mono transition-opacity hover:opacity-70"
              style={{ color: "#FF5050" }}
            >
              <X size={10} />
              Temizle
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}