import Image from "next/image";

import { landingFeatures } from "@/data/landing";
import { LinkButton } from "@/components/ui/button";

export default function FiturPanel() {
  return (
    <div className="space-y-10 py-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {landingFeatures.map((feature) => (
          <div
            key={feature.title}
            className="flex h-full flex-col items-center gap-4 bg-transparent px-6 py-8 text-center"
          >
            <div className="relative aspect-square w-32 bg-transparent">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-stone-900">{feature.title}</h3>
            <p className="text-lg leading-relaxed text-slate-600">{feature.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <LinkButton href="/sign-up" variant="ink" size="hero">
          Belajar Sekarang
        </LinkButton>
      </div>
    </div>
  );
}
