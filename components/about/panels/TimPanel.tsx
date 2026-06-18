import Image from "next/image";

import { aboutTimItems } from "@/data/about";

export default function TimPanel() {
  return (
    <div className="space-y-8 py-10">
      {aboutTimItems.map((item) => (
        <article key={item.title} className="grid items-center gap-6 md:grid-cols-2">
          <div className={item.imageLeft ? "order-2 md:order-1" : "order-2 md:order-2"}>
            <div className="relative h-[272px] w-full overflow-hidden rounded-2xl border-[3px] border-stone-900 bg-[#f0d0ca] shadow-[6px_6px_0_#111111]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className={`${item.imageLeft ? "order-1 md:order-2" : "order-1 md:order-1"} space-y-3`}>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">{item.title}</h3>
            <p className="text-base sm:text-lg leading-relaxed text-slate-600">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
