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

export function Calender28({ onChange }) {
  const [open, setOpen] = React.useState(false);

  // DEFAULT TODAY
  const today = new Date();
  const [date, setDate] = React.useState(today);
  const [month, setMonth] = React.useState(today);
  const [value, setValue] = React.useState(formatDate(today));

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={formatDate(today)}
          className="bg-background pr-10"
          onChange={(e) => {
            const d = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(d)) {
              setDate(d);
              setMonth(d);
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
              onSelect={(d) => {
                setDate(d);
                setValue(formatDate(d));
                setOpen(false);
                if (onChange) onChange(formatDate(d));
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
