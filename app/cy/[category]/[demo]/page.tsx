import { notFound } from "next/navigation";
import { getCyDemoRenderer } from "@/components/cy/demo-map";
import { PreviewShell } from "@/components/cy/layout/PreviewShell";
import { findCyDemo, type CyCategorySlug } from "@/components/cy/registry";

interface CyDemoPageProps {
  params: Promise<{
    category: string;
    demo: string;
  }>;
}

export default async function CyDemoPage({ params }: CyDemoPageProps) {
  const { category, demo } = await params;
  const matched = findCyDemo(category, demo);
  if (!matched) {
    notFound();
  }

  const renderer = getCyDemoRenderer(category as CyCategorySlug, demo);
  if (!renderer) {
    notFound();
  }

  const DemoComponent = renderer;

  return (
    <PreviewShell
      categoryLabel={matched.category.label}
      demoTitle={matched.demo.title}
      description={matched.demo.description}
    >
      <DemoComponent />
    </PreviewShell>
  );
}
