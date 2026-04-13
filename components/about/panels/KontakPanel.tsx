export default function KontakPanel() {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <h3 className="text-5xl font-black tracking-tight text-stone-900">Hubungi Kami</h3>

        <p className="text-lg text-stone-700">
          Apakah Anda mengalami masalah?{" "}
          <a href="#" className="font-semibold text-[#d14a35] hover:underline">
            Temukan bantuan disini
          </a>
        </p>

        <p className="text-lg text-stone-700">
          Menemukan bug atau error pada halaman atau fitur?{" "}
          <a href="#" className="font-semibold text-[#d14a35] hover:underline">
            Lapor disini
          </a>
        </p>

        <p className="text-lg text-stone-700">
          Tertarik untuk kolaborasi?{" "}
          <a
            href="mailto:hello@utysoftwarehouse.dev"
            className="font-semibold text-[#d14a35] hover:underline"
          >
            hello@utysoftwarehouse.dev
          </a>
        </p>
      </div>
    </div>
  );
}
