"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { cyTitleLayoutList, type CyTitleLayoutId } from "@/components/cy/headerLayout/cy-title-layout.config";

export interface CyTitleLayoutSelectProps {
  value: CyTitleLayoutId;
  onValueChange: (value: CyTitleLayoutId) => void;
  /** 传给 SelectTrigger 的 id（可访问性 / 测试） */
  id?: string;
  ariaLabel: string;
  triggerClassName?: string;
}

export function CyTitleLayoutSelect({
  value,
  onValueChange,
  id,
  ariaLabel,
  triggerClassName,
}: CyTitleLayoutSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as CyTitleLayoutId)}>
      <SelectTrigger
        id={id}
        className={cn("h-9 w-full min-w-0 cursor-pointer", triggerClassName)}
        aria-label={ariaLabel}
      >
        <SelectValue placeholder="标题区" />
      </SelectTrigger>
      <SelectContent>
        {cyTitleLayoutList.map((opt) => (
          <SelectItem key={opt.id} value={opt.id} className="cursor-pointer">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
