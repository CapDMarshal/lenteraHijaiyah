import Image from "next/image";

import { aboutTimItems } from "@/data/about";

export default function TimPanel() {
  return (
    <div className="space-y-8 py-10">
      {aboutTimItems.map((item) => (
        <article key={item.title} className="grid items-center gap-6 md:grid-cols-2">
          <div className={item.imageLeft ? "order-1" : "order-2"}>
            <div className="relative h-[272px] w-full overflow-hidden rounded-2xl bg-[#f0d0ca]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className={`${item.imageLeft ? "order-2" : "order-1"} space-y-3`}>
            <h3 className="text-5xl font-black tracking-tight text-stone-900">{item.title}</h3>
            <p className="text-lg leading-relaxed text-slate-600">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
