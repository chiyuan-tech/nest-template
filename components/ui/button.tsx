'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════════
 *  DARK-THEME BUTTON
 *  边框追光 · 流光扫过 · 鼠标立体跟踪 · 氛围发光 · 涟漪反馈
 * ═══════════════════════════════════════════════════════════════ */

const buttonVariants = cva(
  [
    "group relative inline-flex shrink-0 items-center justify-center overflow-hidden whitespace-nowrap",
    "font-medium tracking-[-0.005em] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
    "select-none will-change-[transform,box-shadow]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-35",
    // 顶部高光层 (before)
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:content-['']",
    "before:transition-opacity before:duration-300",
    // 流光层 (after)
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-['']",
    "after:translate-x-[-160%] hover:after:translate-x-[160%] after:transition-transform after:duration-1000 after:ease-[cubic-bezier(0.23,1,0.32,1)]",
    // 悬浮上移 & 按下回弹 (基础，JS 会覆盖 3D 部分)
    "active:scale-[0.98] active:before:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        /* ── Neon：纯白微光，通用默认 ── */
        neon: [
          "border border-primary text-primary rounded-[13px]",
          "bg-[color-mix(in_oklab,var(--primary)_18%,var(--background)_82%)]",
          "shadow-[0_10px_24px_-14px_color-mix(in_oklab,var(--primary)_30%,black)]",
          "before:hidden after:hidden",
          "hover:border-[color-mix(in_oklab,var(--primary)_72%,var(--foreground)_28%)] hover:bg-[color-mix(in_oklab,var(--primary)_24%,var(--background)_76%)]",
          "active:bg-[color-mix(in_oklab,var(--primary)_34%,var(--background)_66%)]",
        ].join(" "),

        /* ── Cyan：青蓝辉光，科技感 CTA ── */
        cyan: [
          "border border-primary text-primary-foreground rounded-[13px]",
          "bg-[color-mix(in_oklab,var(--primary)_92%,black)]",
          "shadow-[0_14px_28px_-14px_color-mix(in_oklab,var(--primary)_55%,black)]",
          "before:hidden after:hidden",
          "hover:bg-[color-mix(in_oklab,var(--primary)_84%,black)]",
          "active:bg-[color-mix(in_oklab,var(--primary)_80%,black)]",
        ].join(" "),

        /* ── Aurora：极光渐变，紫→青→绿 ── */
        aurora: [
          "border border-violet-600 text-white rounded-[13px]",
          "bg-violet-700",
          "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]",
          "before:hidden after:hidden",
          "hover:bg-violet-600",
          "active:bg-violet-800",
        ].join(" "),

        /* ── Ember：暖橙，启动/运行 ── */
        ember: [
          "border border-orange-500 text-white rounded-[13px]",
          "bg-orange-600",
          "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]",
          "before:hidden after:hidden",
          "hover:bg-orange-500",
          "active:bg-orange-700",
        ].join(" "),

        /* ── Frost：毛玻璃，次级操作 ── */
        frost: [
          "border border-slate-400 text-slate-100 rounded-[13px]",
          "bg-slate-700",
          "shadow-[0_6px_18px_-10px_rgba(0,0,0,0.65)]",
          "before:hidden after:hidden",
          "hover:bg-slate-600",
          "active:bg-slate-800",
        ].join(" "),

        /* ── Solid：白底实色，最强对比 ── */
        solid: [
          "border border-zinc-200 text-zinc-900 rounded-[13px]",
          "bg-zinc-100",
          "shadow-[0_6px_18px_-10px_rgba(0,0,0,0.45)]",
          "before:hidden after:hidden",
          "hover:bg-white",
          "active:bg-zinc-200",
        ].join(" "),

        /* ── WhiteOutline：白色透明底 + 白色边框（轻量） ── */
        whiteOutline: [
          "border border-[color-mix(in_oklab,var(--primary)_36%,var(--foreground)_64%)] text-foreground rounded-[13px]",
          "bg-[color-mix(in_oklab,var(--background)_82%,var(--primary)_18%)]",
          "shadow-[0_6px_16px_-10px_color-mix(in_oklab,var(--primary)_30%,black)]",
          "before:hidden after:hidden",
          "hover:border-[color-mix(in_oklab,var(--primary)_52%,var(--foreground)_48%)] hover:bg-[color-mix(in_oklab,var(--background)_72%,var(--primary)_28%)]",
          "active:bg-[color-mix(in_oklab,var(--background)_68%,var(--primary)_32%)]",
        ].join(" "),

        /* ── Legacy shadcn / Radix aliases (compat) ── */
        default: [
          "border border-[color-mix(in_oklab,var(--primary)_68%,black)] text-primary-foreground rounded-[13px]",
          "bg-[color-mix(in_oklab,var(--primary)_86%,black)]",
          "shadow-[0_10px_22px_-14px_rgba(0,0,0,0.72)]",
          "before:hidden after:hidden",
          "hover:bg-[color-mix(in_oklab,var(--primary)_80%,black)]",
          "active:bg-[color-mix(in_oklab,var(--primary)_72%,black)]",
        ].join(" "),

        ghost: [
          "border border-transparent text-foreground rounded-[13px]",
          "bg-background shadow-none",
          "before:hidden after:hidden",
          "hover:bg-accent hover:text-accent-foreground",
          "hover:shadow-none active:shadow-none",
        ].join(" "),

        destructive: [
          "border border-red-700 text-white rounded-[13px]",
          "bg-red-600",
          "shadow-[0_6px_18px_-10px_rgba(0,0,0,0.65)]",
          "before:hidden after:hidden",
          "hover:bg-red-500",
          "active:bg-red-700",
        ].join(" "),

        outline: [
          "border border-input text-foreground rounded-[13px]",
          "bg-background",
          "shadow-[0_4px_12px_-8px_rgba(0,0,0,0.5)]",
          "before:hidden after:hidden",
          "hover:bg-accent hover:text-accent-foreground",
          "active:bg-muted",
        ].join(" "),

        secondary: [
          "border border-secondary text-secondary-foreground rounded-[13px]",
          "bg-secondary",
          "shadow-[0_4px_12px_-8px_rgba(0,0,0,0.5)]",
          "before:hidden after:hidden",
          "hover:bg-secondary/90",
          "active:bg-secondary/80",
        ].join(" "),
      },
      size: {
        sm: "h-[38px] px-[18px] text-[12.5px]",
        md: "h-11 px-6 text-[13.5px]",
        default: "h-11 px-6 text-[13.5px]",
        lg: "h-[50px] px-[30px] text-[14.5px]",
        xl: "h-14 px-9 text-[15.5px]",
        icon: "h-11 w-11 shrink-0 p-0 text-[13.5px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

/* ── 每个 variant 对应的动态颜色 token ── */
const variantTokens: Record<string, { sheen: string; glow: string; ripple: string }> = {
  neon:   {
    sheen: "color-mix(in oklab, var(--primary) 44%, transparent)",
    glow: "color-mix(in oklab, var(--primary) 24%, transparent)",
    ripple: "color-mix(in oklab, var(--primary) 30%, transparent)",
  },
  cyan:   {
    sheen: "color-mix(in oklab, var(--primary) 58%, transparent)",
    glow: "color-mix(in oklab, var(--primary) 42%, transparent)",
    ripple: "color-mix(in oklab, var(--primary) 46%, transparent)",
  },
  aurora: { sheen: "rgba(180,140,255,0.25)",   glow: "rgba(124,58,237,0.10)",  ripple: "rgba(124,58,237,0.25)"  },
  ember:  { sheen: "rgba(251,191,120,0.28)",   glow: "rgba(251,146,60,0.10)",  ripple: "rgba(251,146,60,0.25)"  },
  frost:  { sheen: "rgba(255,255,255,0.14)",   glow: "rgba(255,255,255,0.04)", ripple: "rgba(255,255,255,0.12)" },
  solid:  { sheen: "rgba(255,255,255,0.60)",   glow: "rgba(255,255,255,0.12)", ripple: "rgba(0,0,0,0.08)"      },
  whiteOutline: {
    sheen: "color-mix(in oklab, var(--primary) 34%, transparent)",
    glow: "color-mix(in oklab, var(--primary) 18%, transparent)",
    ripple: "color-mix(in oklab, var(--primary) 24%, transparent)",
  },
  default: {
    sheen: "color-mix(in oklab, var(--primary) 40%, transparent)",
    glow: "color-mix(in oklab, var(--primary) 24%, transparent)",
    ripple: "color-mix(in oklab, var(--primary) 30%, transparent)",
  },
  ghost:   { sheen: "rgba(255,255,255,0.12)",  glow: "rgba(255,255,255,0.03)", ripple: "rgba(255,255,255,0.10)" },
  destructive: { sheen: "rgba(248,113,113,0.35)", glow: "rgba(239,68,68,0.12)", ripple: "rgba(248,113,113,0.28)" },
  outline: { sheen: "rgba(255,255,255,0.14)", glow: "rgba(255,255,255,0.04)", ripple: "rgba(255,255,255,0.12)" },
  secondary: { sheen: "rgba(255,255,255,0.14)", glow: "rgba(255,255,255,0.04)", ripple: "rgba(255,255,255,0.12)" },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "neon",
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const tokens = variantTokens[variant ?? "neon"] ?? variantTokens.neon

    const [hovered, setHovered] = React.useState(false)
    const [pressed, setPressed] = React.useState(false)
    const [mouse, setMouse] = React.useState({ x: 0.5, y: 0.5 })
    const [ripple, setRipple] = React.useState<{ x: number; y: number; id: number } | null>(null)
    const innerRef = React.useRef<HTMLButtonElement>(null)

    // 合并 ref
    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        ;(innerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      },
      [ref]
    )

    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        const r = e.currentTarget.getBoundingClientRect()
        setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
      },
      [disabled]
    )

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        const r = e.currentTarget.getBoundingClientRect()
        setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() })
        setTimeout(() => setRipple(null), 700)
        onClick?.(e)
      },
      [disabled, onClick]
    )

    /* 3D 立体跟踪 transform */
    const transform = pressed
      ? "perspective(1400px) translateY(1px) scale(0.982) rotateX(1.4deg)"
      : hovered
        ? `perspective(1400px) translateY(-4px) scale(1.01) rotateX(${(mouse.y - 0.5) * -6.5}deg) rotateY(${(mouse.x - 0.5) * 5.2}deg)`
        : "perspective(1400px) translateY(0) scale(1)"

    const dynamicShadow = pressed
      ? `0 8px 16px -10px rgba(0,0,0,0.75), 0 2px 8px -2px rgba(0,0,0,0.6), inset 0 1px 0 color-mix(in oklab, var(--foreground) 16%, transparent)`
      : hovered
        ? `0 18px 34px -18px rgba(0,0,0,0.82), 0 8px 18px -10px rgba(0,0,0,0.66), 0 0 24px ${tokens.glow}, inset 0 1px 0 color-mix(in oklab, var(--foreground) 20%, transparent)`
        : `0 10px 18px -14px rgba(0,0,0,0.65), 0 3px 10px -6px rgba(0,0,0,0.5), inset 0 1px 0 color-mix(in oklab, var(--foreground) 12%, transparent)`

    const dynamicStyle: React.CSSProperties = {
      transform,
      boxShadow: dynamicShadow,
    }

    const contentStyle: React.CSSProperties = {
      transform: pressed ? "translateZ(0px)" : hovered ? "translateZ(8px)" : "translateZ(3px)",
      transition: "transform 420ms cubic-bezier(0.23,1,0.32,1)",
    }

    if (asChild) {
      return (
        <Comp
          ref={mergedRef}
          className={cn(
            buttonVariants({ variant, size }),
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            className
          )}
          disabled={disabled}
          style={dynamicStyle}
          onMouseEnter={() => !disabled && setHovered(true)}
          onMouseLeave={() => {
            setHovered(false)
            setPressed(false)
            setMouse({ x: 0.5, y: 0.5 })
          }}
          onMouseDown={() => !disabled && setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        ref={mergedRef}
        className={cn(
          buttonVariants({ variant, size }),
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className
        )}
        disabled={disabled}
        style={dynamicStyle}
        onMouseEnter={() => !disabled && setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          setPressed(false)
          setMouse({ x: 0.5, y: 0.5 })
        }}
        onMouseDown={() => !disabled && setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        {...props}
      >
        {/* ── 地面接触阴影（增强 3D 体积感） ── */}
        <span
          className="pointer-events-none absolute -bottom-3 left-[10%] h-5 w-[80%] rounded-full blur-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            opacity: pressed ? 0.22 : hovered ? 0.42 : 0.28,
            transform: pressed ? "scale(0.92)" : hovered ? "scale(1.08)" : "scale(1)",
            background: `radial-gradient(ellipse at center, ${tokens.glow} 0%, transparent 72%)`,
          }}
        />

        {/* ── 鼠标追踪光晕 ── */}
        {hovered && !pressed && (
          <span
            className="pointer-events-none absolute h-[140px] w-[140px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${tokens.glow} 0%, transparent 70%)`,
              left: `${mouse.x * 100}%`,
              top: `${mouse.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* ── 边框追光 ── */}
        {hovered && !pressed && (
          <span
            className="pointer-events-none absolute -inset-px rounded-[inherit]"
            style={{
              background: `radial-gradient(circle 80px at ${mouse.x * 100}% ${mouse.y * 100}%, ${tokens.sheen}, transparent 70%)`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: 1,
            }}
          />
        )}

        {/* ── 点击涟漪 ── */}
        {ripple && (
          <span
            key={ripple.id}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full animate-[ripple-expand_0.65s_cubic-bezier(0.23,1,0.32,1)_forwards]"
            style={{
              background: tokens.ripple,
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%) scale(1)",
            }}
          />
        )}

        {/* ── 内容 ── */}
        <span className="relative z-10 inline-flex items-center gap-2" style={contentStyle}>
          {leftIcon ? (
            <span className="inline-flex items-center">{leftIcon}</span>
          ) : null}
          <span>{children}</span>
          {rightIcon ? (
            <span className="inline-flex items-center transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-[3px]">
              {rightIcon}
            </span>
          ) : null}
        </span>
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }

/* ═══════════════════════════════════════════════════════════════
 *  tailwind.config 中需要添加的 keyframes:
 *
 *  keyframes: {
 *    "ripple-expand": {
 *      to: { transform: "translate(-50%, -50%) scale(35)", opacity: "0" },
 *    },
 *  },
 *  animation: {
 *    "ripple-expand": "ripple-expand 0.65s cubic-bezier(0.23, 1, 0.32, 1) forwards",
 *  },
 * ═══════════════════════════════════════════════════════════════ */