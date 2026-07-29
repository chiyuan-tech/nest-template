'use client';
import { FadeIn } from "@/components/animations/FadeIn";

export function HeaderVertical({ sectionTitle, subtitle }: { sectionTitle: string; subtitle: string }) {
    return (
        <>
            <FadeIn duration={800} delay={100}>
                <div className="mb-16 text-center">
                    <h2 className="mb-6 text-4xl font-bold  md:text-5xl lg:text-6xl">{sectionTitle}</h2>
                    <p className="mx-auto max-w-3xl text-lg text-zinc-300 sm:text-xl">{subtitle}</p>
                </div>
            </FadeIn>
        </>
    );
}

