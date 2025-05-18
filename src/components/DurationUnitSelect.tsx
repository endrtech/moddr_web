"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DurationUnitSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] text-white">
        <SelectValue placeholder="Select unit of time..." />
      </SelectTrigger>
      <SelectContent className="dark text-white z-[999]">
        <SelectItem value="minute(s)">Minute(s)</SelectItem>
        <SelectItem value="hour(s)">Hour(s)</SelectItem>
      </SelectContent>
    </Select>
  );
}
