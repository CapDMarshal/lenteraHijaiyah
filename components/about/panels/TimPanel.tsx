import { aboutTimItems } from "@/data/about";

export default function TimPanel() {
  return (
    <div className="space-y-12 py-10">
      {aboutTimItems.map((item) => (
        <article key={item.title} className="grid items-center gap-8 md:grid-cols-[1fr_1fr] md:gap-10">
          <div className={item.imageLeft ? "order-1" : "order-2"}>
            <div className="h-56 w-full rounded-2xl border-2 border-stone-900 bg-[#f0d0ca] shadow-[5px_5px_0_#111]" />
          </div>

          <div className={`${item.imageLeft ? "order-2" : "order-1"} space-y-4`}>
            <h3 className="text-5xl font-black tracking-tight text-stone-900">{item.title}</h3>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
