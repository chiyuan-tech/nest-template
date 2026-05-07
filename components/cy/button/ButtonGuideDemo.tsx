"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Trash2 } from "lucide-react";

const variantDocs = [
  { name: "neon", desc: "默认霓虹风格，适合通用主按钮。" },
  { name: "cyan", desc: "强 CTA 风格，强调转化操作。" },
  { name: "whiteOutline", desc: "浅描边次级按钮，适合辅助行为。" },
  { name: "ghost", desc: "弱化按钮，适合工具栏和轻操作。" },
  { name: "outline", desc: "边框型按钮，适合保守次级操作。" },
  { name: "destructive", desc: "危险操作按钮，用于删除等高风险行为。" },
] as const;

const sizeDocs = [
  { name: "sm", desc: "紧凑场景，如表格操作列。" },
  { name: "md", desc: "默认尺寸，常规场景优先。" },
  { name: "lg", desc: "强调操作按钮，常用于 Hero CTA。" },
  { name: "icon", desc: "纯图标按钮，搭配 tooltip 使用。" },
] as const;

const propsDocs = [
  { name: "variant", type: "Button variant", desc: "按钮视觉风格类型，如 cyan / outline / destructive。" },
  { name: "size", type: "Button size", desc: "按钮尺寸，支持 sm / md / lg / icon 等。" },
  { name: "asChild", type: "boolean", desc: "把 Button 样式透传给子元素（常用于 Link）。" },
  { name: "leftIcon", type: "ReactNode", desc: "内容左侧图标插槽。" },
  { name: "rightIcon", type: "ReactNode", desc: "内容右侧图标插槽。" },
  { name: "children", type: "ReactNode", desc: "按钮文案或内容。" },
  { name: "className", type: "string", desc: "额外样式类，可覆盖微调。" },
  { name: "disabled", type: "boolean", desc: "禁用状态，不可交互。" },
  { name: "type", type: "'button'|'submit'|'reset'", desc: "原生按钮类型（表单行为关键）。" },
  { name: "onClick", type: "(e) => void", desc: "点击事件处理函数。" },
  { name: "id", type: "string", desc: "原生 id 属性，用于关联 label 或测试。" },
  { name: "name", type: "string", desc: "原生 name 属性，常用于 form 提交。" },
  { name: "value", type: "string", desc: "原生 value 属性。" },
  { name: "title", type: "string", desc: "鼠标悬浮提示文本。" },
  { name: "aria-label", type: "string", desc: "无文本按钮时的可访问性名称。" },
] as const;

function renderVariantCode(variant: string) {
  return [
    "import { Button } from '@/components/ui/button';",
    "",
    `export function Example() {`,
    `  return <Button variant="${variant}">Click me</Button>;`,
    `}`,
  ].join("\n");
}

function renderStateCode() {
  return [
    "import { Button } from '@/components/ui/button';",
    "",
    "export function States() {",
    "  return (",
    "    <div className='flex gap-3'>",
    "      <Button>Normal</Button>",
    "      <Button disabled>Disabled</Button>",
    "      <Button variant='cyan' disabled>Loading...</Button>",
    "    </div>",
    "  );",
    "}",
  ].join("\n");
}

function renderPropsCode() {
  return [
    "import Link from 'next/link';",
    "import { ArrowRight, Play } from 'lucide-react';",
    "import { Button } from '@/components/ui/button';",
    "",
    "export function PropsExample() {",
    "  return (",
    "    <div className='flex flex-wrap gap-3'>",
    "      <Button",
    "        variant='cyan'",
    "        size='lg'",
    "        leftIcon={<Play className='h-4 w-4' />}",
    "        rightIcon={<ArrowRight className='h-4 w-4' />}",
    "        onClick={() => console.log('clicked')}",
    "      >",
    "        Create Video",
    "      </Button>",
    "",
    "      <Button asChild variant='outline'>",
    "        <Link href='/docs'>Open Docs</Link>",
    "      </Button>",
    "    </div>",
    "  );",
    "}",
  ].join("\n");
}

export function ButtonGuideDemo() {
  return (
    <section className="space-y-5">
      <article className="rounded-xl border bg-card p-5">
        <h3 className="text-lg font-semibold">Button Props 全说明</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          `ButtonProps` 由自定义 props（variant/size/asChild/icon）+ 原生 Button HTML props 组成。
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[140px_180px_1fr] border-b bg-muted/40 px-3 py-2 text-xs font-semibold">
            <span>Prop</span>
            <span>Type</span>
            <span>Description</span>
          </div>
          {propsDocs.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[140px_180px_1fr] border-b px-3 py-2 text-xs last:border-b-0"
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">{item.type}</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="cyan"
            size="lg"
            className="cursor-pointer"
            leftIcon={<Play className="h-4 w-4" />}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Icon + CTA
          </Button>
          <Button variant="outline" className="cursor-pointer" aria-label="icon button">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <pre className="mt-4 overflow-auto rounded-md bg-muted/30 p-3 text-xs">
          <code>{renderPropsCode()}</code>
        </pre>
      </article>

      <article className="rounded-xl border bg-card p-5">
        <h3 className="text-lg font-semibold">Button Variant Type</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          每个 variant 对应不同语义层级和视觉强度，推荐按场景选择。
        </p>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        {variantDocs.map((item) => (
          <article key={item.name} className="rounded-xl border bg-card p-5">
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant={item.name} className="cursor-pointer">
                {item.name}
              </Button>
              <Button variant={item.name} className="cursor-pointer" disabled>
                {item.name} disabled
              </Button>
            </div>
            <pre className="mt-4 overflow-auto rounded-md bg-muted/30 p-3 text-xs">
              <code>{renderVariantCode(item.name)}</code>
            </pre>
          </article>
        ))}
      </div>

      <article className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold">Button Size Type</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          尺寸决定信息密度与操作优先级，保持同一区域尺寸一致。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {sizeDocs.map((item) => (
            <Button
              key={item.name}
              size={item.name}
              variant="outline"
              className="cursor-pointer"
              aria-label={`size-${item.name}`}
            >
              {item.name === "icon" ? "+" : item.name}
            </Button>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          {sizeDocs.map((item) => (
            <li key={item.name}>
              {item.name}: {item.desc}
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold">Button State Type</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          常用状态包括 normal / disabled / loading(可通过 disabled + 文案表达)。
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button className="cursor-pointer">Normal</Button>
          <Button className="cursor-pointer" disabled>
            Disabled
          </Button>
          <Button variant="cyan" className="cursor-pointer" disabled>
            Loading...
          </Button>
        </div>
        <pre className="mt-4 overflow-auto rounded-md bg-muted/30 p-3 text-xs">
          <code>{renderStateCode()}</code>
        </pre>
      </article>
    </section>
  );
}
