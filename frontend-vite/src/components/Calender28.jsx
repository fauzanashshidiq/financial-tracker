"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  return date && !isNaN(date.getTime());
}

export function Calender28({ value, onChange }) {
  const [open, setOpen] = React.useState(false);

  const parsedDate = value ? new Date(value) : new Date(); // pakai value dari parent
  const [date, setDate] = React.useState(parsedDate);
  const [month, setMonth] = React.useState(parsedDate);
  const [displayValue, setDisplayValue] = React.useState(
    value ? formatDate(parsedDate) : formatDate(new Date())
  );

  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setDate(d);
        setMonth(d);
        setDisplayValue(formatDate(d));
      }
    }
  }, [value]);

  const handleSelect = (d) => {
    setDate(d);
    setMonth(d);
    const formatted = formatDate(d);
    setDisplayValue(formatted);
    setOpen(false);
    if (onChange) onChange(formatted); // kirim ke parent
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={displayValue}
          placeholder={formatDate(new Date())}
          className="bg-background pr-10"
          onChange={(e) => {
            setDisplayValue(e.target.value);
            const d = new Date(e.target.value);
            if (isValidDate(d)) {
              setDate(d);
              setMonth(d);
              if (onChange) onChange(formatDate(d));
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="end" alignOffset={-8}>
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
