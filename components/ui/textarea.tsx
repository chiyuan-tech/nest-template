import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-16 w-full min-w-0 max-w-full rounded-[24px] border bg-white px-5 py-4 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // PC 端滚动条优化 - 使用 Webkit 和 Firefox 兼容样式
        "overflow-y-auto",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2",
        "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:bg-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:hover:bg-foreground/40",
        "[&::-webkit-scrollbar-thumb]:transition-colors",
        className
      )}
      style={{
        // Firefox 滚动条样式
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgb(20 20 19 / 0.3) transparent',
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Textarea }
