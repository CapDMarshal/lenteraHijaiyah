"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { IonIcon } from "@/components/ui/ion-icon";
import { TextField } from "@/components/ui/text-field";

const tabs = [
  { key: "profil", label: "Profil", icon: "person-outline" },
  { key: "akun", label: "Akun", icon: "settings-outline" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1.5 12C3.7 7.8 7.5 5.5 12 5.5C16.5 5.5 20.3 7.8 22.5 12C20.3 16.2 16.5 18.5 12 18.5C7.5 18.5 3.7 16.2 1.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6 6.3C11.1 6.2 11.5 6.2 12 6.2C16.2 6.2 19.7 8.4 21.8 12C20.9 13.6 19.7 14.9 18.3 15.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.1 14.3C13.5 14.9 12.8 15.2 12 15.2C10.2 15.2 8.8 13.8 8.8 12C8.8 11.2 9.1 10.5 9.7 9.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 8.2C4.5 9.2 3 10.5 2.2 12C4.3 15.6 7.8 17.8 12 17.8C13.4 17.8 14.7 17.5 15.9 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profil");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [stats, setStats] = useState({
    modulesCompleted: 0,
    hasQuranProgress: false,
    lastModule: "Belum ada aktivitas",
    lastQuran: "Belum ada aktivitas",
  });
  const [accountEmail, setAccountEmail] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fullName = useMemo(() => {
    const parts = [profileForm.firstName.trim(), profileForm.lastName.trim()].filter(Boolean);
    return parts.join(" ");
  }, [profileForm.firstName, profileForm.lastName]);

  const avatarInitials = useMemo(() => {
    if (!fullName) return "U";
    return fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  }, [fullName]);

  const username = useMemo(() => {
    if (!profileForm.email) return "username";
    return profileForm.email.split("@")[0];
  }, [profileForm.email]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/sign-in");
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/v1/user/profile");
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setProfileError(payload?.message || "Gagal memuat profil.");
          return;
        }

        const payload = (await response.json()) as {
          user: { 
            name: string; 
            email: string;
            quranProgress?: { surahNumber: number; ayahNumber: number } | null;
            moduleProgresses?: Array<{ module: { title: string } }>;
          };
        };
        const nameParts = payload.user.name?.split(" ") ?? [];
        const firstName = nameParts.shift() ?? "";
        const lastName = nameParts.join(" ");

        let lastQuranText = "Belum ada aktivitas";
        if (payload.user.quranProgress) {
          try {
            const res = await fetch(`https://equran.id/api/v2/surat/${payload.user.quranProgress.surahNumber}`);
            if (res.ok) {
              const data = await res.json();
              lastQuranText = `${data.data.namaLatin} Ayat ${payload.user.quranProgress.ayahNumber}`;
            } else {
              lastQuranText = `Surah Ke-${payload.user.quranProgress.surahNumber} Ayat ${payload.user.quranProgress.ayahNumber}`;
            }
          } catch {
            lastQuranText = `Surah Ke-${payload.user.quranProgress.surahNumber} Ayat ${payload.user.quranProgress.ayahNumber}`;
          }
        }

        setStats({
          modulesCompleted: payload.user.moduleProgresses?.length || 0,
          hasQuranProgress: !!payload.user.quranProgress,
          lastModule: payload.user.moduleProgresses?.[0]?.module.title || "Belum ada aktivitas",
          lastQuran: lastQuranText,
        });

        setProfileForm({
          email: payload.user.email ?? "",
          firstName,
          lastName,
        });
        setAccountEmail(payload.user.email ?? "");
      } catch (error) {
        console.error("PROFILE_LOAD_ERROR", error);
        setProfileError("Terjadi kesalahan jaringan.");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSubmit = async () => {
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const response = await fetch("/api/v1/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setProfileError(payload?.message || "Gagal menyimpan profil.");
        return;
      }

      setProfileSuccess("Profil berhasil diperbarui.");
    } catch (error) {
      console.error("PROFILE_UPDATE_ERROR", error);
      setProfileError("Terjadi kesalahan jaringan.");
    }
  };

  const handleEmailSubmit = async () => {
    setEmailError(null);
    setEmailSuccess(null);

    try {
      const response = await fetch("/api/v1/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: accountEmail.trim() }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setEmailError(payload?.message || "Gagal memperbarui email.");
        return;
      }

      setEmailSuccess("Email berhasil diperbarui.");
      setProfileForm((prev) => ({ ...prev, email: accountEmail.trim() }));
    } catch (error) {
      console.error("EMAIL_UPDATE_ERROR", error);
      setEmailError("Terjadi kesalahan jaringan.");
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      const response = await fetch("/api/v1/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        setPasswordError(payload?.message || "Gagal mengubah password.");
        return;
      }

      setPasswordSuccess(payload?.message || "Password berhasil diperbarui.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("PASSWORD_UPDATE_ERROR", error);
      setPasswordError("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-10 md:flex-row">

      {/* Left Column: Profile Dashboard (Mockup) */}
      <div className="flex w-full md:max-w-sm flex-col gap-6">

        {/* Profile Card */}
        <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[6px_6px_0_#9ca3af] flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full border-2 border-stone-900 bg-[#d14a35] text-white flex items-center justify-center text-4xl font-black mb-4 shadow-[4px_4px_0_#1c1917]">
            {profileLoading ? "..." : avatarInitials}
          </div>
          <h1 className="text-2xl font-bold text-stone-900 leading-tight">
            {profileLoading ? "Memuat..." : fullName}
          </h1>
          <p className="text-sm font-bold text-stone-500 mb-4">
            @{profileLoading ? "loading" : username}
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-full border-2 border-[#d14a35] bg-white px-4 py-1 text-xs font-black text-[#d14a35]">
              Siswa
            </span>
          </div>

          {/* Logout Button (Replacing Point) */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-stone-900 bg-black py-4 text-sm font-bold text-white shadow-[4px_4px_0_#d14a35] transition-all hover:translate-y-px hover:translate-x-px hover:shadow-[3px_3px_0_#d14a35] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-60"
          >
            {isLoggingOut ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : <IonIcon name="log-out-outline" className="text-lg" />}
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>

        {/* Statistik Belajar */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-stone-900">Statistik Belajar</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-stone-900 bg-white p-5 shadow-[4px_4px_0_#9ca3af]">
              <p className="text-xs font-bold text-stone-500 mb-1">Modul Selesai</p>
              <p className="text-3xl font-black text-stone-900">{profileLoading ? "-" : stats.modulesCompleted}</p>
            </div>
            <div className="rounded-2xl border-2 border-stone-900 bg-white p-5 shadow-[4px_4px_0_#9ca3af]">
              <p className="text-xs font-bold text-stone-500 mb-1">Surah Dibaca</p>
              <p className="text-3xl font-black text-stone-900">{profileLoading ? "-" : (stats.hasQuranProgress ? 1 : 0)}</p>
            </div>
          </div>
        </div>

        {/* Aktivitas Terakhir */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-stone-900">Aktivitas Terakhir</h2>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border-2 border-stone-900 bg-white p-4 shadow-[4px_4px_0_#9ca3af] flex flex-col justify-center">
              <p className="text-xs font-bold text-stone-500 mb-1">Modul</p>
              <p className="text-sm font-bold text-stone-900">{profileLoading ? "Memuat..." : stats.lastModule}</p>
            </div>
            <div className="rounded-2xl border-2 border-stone-900 bg-white p-4 shadow-[4px_4px_0_#9ca3af] flex flex-col justify-center">
              <p className="text-xs font-bold text-stone-500 mb-1">Al-Qur'an</p>
              <p className="text-sm font-bold text-stone-900">{profileLoading ? "Memuat..." : stats.lastQuran}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Settings Forms */}
      <div className="flex-1 flex flex-col gap-6">

        {/* Settings Navigation Tabs */}
        <div className="rounded-2xl border-2 border-stone-900 bg-white p-2 shadow-[4px_4px_0_#9ca3af] flex gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${isActive
                  ? "bg-black text-white shadow-[2px_2px_0_#d14a35]"
                  : "bg-white text-stone-600 hover:bg-stone-100 border-2 border-transparent hover:border-stone-200"
                  }`}
              >
                <IonIcon name={tab.icon} className="text-lg" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="flex-1">
          {activeTab === "profil" ? (
            <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[6px_6px_0_#9ca3af]">
              <div className="border-b-2 border-stone-100 pb-4">
                <h2 className="text-lg font-black text-stone-900">Profil Pengguna</h2>
              </div>

              <div className="mt-5 space-y-5">
                {profileLoading ? (
                  <p className="text-sm text-slate-500 font-bold">Memuat profil...</p>
                ) : null}

                {profileError ? (
                  <p className="rounded-xl border-2 border-stone-900 bg-red-100 px-4 py-3 text-sm font-bold text-red-700 shadow-[2px_2px_0_#1c1917]">
                    {profileError}
                  </p>
                ) : null}

                {profileSuccess ? (
                  <p className="rounded-xl border-2 border-stone-900 bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800 shadow-[2px_2px_0_#1c1917]">
                    {profileSuccess}
                  </p>
                ) : null}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700">Email</label>
                  <TextField value={profileForm.email} disabled wrapperClassName="bg-stone-100 border-2 border-stone-200 cursor-not-allowed" className="text-stone-500 font-medium" />
                  <p className="text-[11px] font-bold text-stone-500">
                    *Anda dapat mengubah alamat email melalui menu{" "}
                    <span className="text-[#d14a35]">Akun</span>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700">Nama Depan *</label>
                  <TextField
                    placeholder="Nama depan"
                    value={profileForm.firstName}
                    wrapperClassName="bg-white border-2 border-stone-900 shadow-[2px_2px_0_#9ca3af] focus-within:shadow-[3px_3px_0_#d14a35]"
                    className="font-bold text-stone-900"
                    onChange={(event) =>
                      setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700">Nama Belakang *</label>
                  <TextField
                    placeholder="Nama belakang"
                    value={profileForm.lastName}
                    wrapperClassName="bg-white border-2 border-stone-900 shadow-[2px_2px_0_#9ca3af] focus-within:shadow-[3px_3px_0_#d14a35]"
                    className="font-bold text-stone-900"
                    onChange={(event) =>
                      setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  className="mt-4 w-full rounded-xl bg-black px-4 py-4 text-sm font-bold text-white shadow-[4px_4px_0_#d14a35] transition-all hover:translate-y-px hover:translate-x-px hover:shadow-[3px_3px_0_#d14a35] active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "akun" ? (
            <div className="space-y-6">
              {/* Ubah Email */}
              <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[6px_6px_0_#9ca3af]">
                <div className="border-b-2 border-stone-100 pb-4">
                  <h2 className="text-lg font-black text-stone-900">Ubah Email</h2>
                </div>
                <div className="mt-5 space-y-5">
                  {emailError ? (
                    <p className="rounded-xl border-2 border-stone-900 bg-red-100 px-4 py-3 text-sm font-bold text-red-700 shadow-[2px_2px_0_#1c1917]">
                      {emailError}
                    </p>
                  ) : null}

                  {emailSuccess ? (
                    <p className="rounded-xl border-2 border-stone-900 bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800 shadow-[2px_2px_0_#1c1917]">
                      {emailSuccess}
                    </p>
                  ) : null}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700">Email baru *</label>
                    <TextField
                      value={accountEmail}
                      wrapperClassName="bg-white border-2 border-stone-900 shadow-[2px_2px_0_#9ca3af] focus-within:shadow-[3px_3px_0_#d14a35]"
                      className="font-bold text-stone-900"
                      onChange={(event) => setAccountEmail(event.target.value)}
                    />
                    <p className="text-[11px] font-bold text-stone-500 leading-relaxed">
                      *Email akan berubah ketika Anda sudah menekan link verifikasi yang
                      dikirimkan ke email baru Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    className="w-full rounded-xl bg-black px-4 py-4 text-sm font-bold text-white shadow-[4px_4px_0_#d14a35] transition-all hover:translate-y-px hover:translate-x-px hover:shadow-[3px_3px_0_#d14a35] active:translate-y-1 active:translate-x-1 active:shadow-none"
                  >
                    Ubah Email
                  </button>
                </div>
              </div>

              {/* Ubah Password */}
              <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[6px_6px_0_#9ca3af]">
                <div className="border-b-2 border-stone-100 pb-4">
                  <h2 className="text-lg font-black text-stone-900">Ubah Password</h2>
                </div>
                <div className="mt-5 space-y-5">
                  {passwordError ? (
                    <p className="rounded-xl border-2 border-stone-900 bg-red-100 px-4 py-3 text-sm font-bold text-red-700 shadow-[2px_2px_0_#1c1917]">
                      {passwordError}
                    </p>
                  ) : null}

                  {passwordSuccess ? (
                    <p className="rounded-xl border-2 border-stone-900 bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800 shadow-[2px_2px_0_#1c1917]">
                      {passwordSuccess}
                    </p>
                  ) : null}

                  <p className="text-[11px] font-bold text-stone-500">*Isi jika Anda ingin mengubah password.</p>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700">Password saat ini *</label>
                    <TextField
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Masukkan password saat ini"
                      value={passwordForm.currentPassword}
                      wrapperClassName="bg-white border-2 border-stone-900 shadow-[2px_2px_0_#9ca3af] focus-within:shadow-[3px_3px_0_#d14a35]"
                      className="font-bold text-stone-900"
                      onChange={(event) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: event.target.value,
                        }))
                      }
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="text-stone-700 hover:text-stone-900 px-2"
                          aria-label={showCurrentPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                          {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700">Password baru *</label>
                    <TextField
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Masukkan password baru"
                      value={passwordForm.newPassword}
                      wrapperClassName="bg-white border-2 border-stone-900 shadow-[2px_2px_0_#9ca3af] focus-within:shadow-[3px_3px_0_#d14a35]"
                      className="font-bold text-stone-900"
                      onChange={(event) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: event.target.value,
                        }))
                      }
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="text-stone-700 hover:text-stone-900 px-2"
                          aria-label={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                          {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700">Konfirmasi password baru *</label>
                    <TextField
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi password baru"
                      value={passwordForm.confirmPassword}
                      wrapperClassName="bg-white border-2 border-stone-900 shadow-[2px_2px_0_#9ca3af] focus-within:shadow-[3px_3px_0_#d14a35]"
                      className="font-bold text-stone-900"
                      onChange={(event) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: event.target.value,
                        }))
                      }
                      endAdornment={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="text-stone-700 hover:text-stone-900 px-2"
                          aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                        >
                          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePasswordSubmit}
                    className="w-full rounded-xl bg-black px-4 py-4 text-sm font-bold text-white shadow-[4px_4px_0_#d14a35] transition-all hover:translate-y-px hover:translate-x-px hover:shadow-[3px_3px_0_#d14a35] active:translate-y-1 active:translate-x-1 active:shadow-none"
                  >
                    Simpan Password
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </section>
  );
}
