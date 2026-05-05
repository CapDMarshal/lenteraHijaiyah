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
      <path
        d="M1.5 12C3.7 7.8 7.5 5.5 12 5.5C16.5 5.5 20.3 7.8 22.5 12C20.3 16.2 16.5 18.5 12 18.5C7.5 18.5 3.7 16.2 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6 6.3C11.1 6.2 11.5 6.2 12 6.2C16.2 6.2 19.7 8.4 21.8 12C20.9 13.6 19.7 14.9 18.3 15.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1 14.3C13.5 14.9 12.8 15.2 12 15.2C10.2 15.2 8.8 13.8 8.8 12C8.8 11.2 9.1 10.5 9.7 9.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 8.2C4.5 9.2 3 10.5 2.2 12C4.3 15.6 7.8 17.8 12 17.8C13.4 17.8 14.7 17.5 15.9 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
          user: { name: string; email: string };
        };
        const nameParts = payload.user.name?.split(" ") ?? [];
        const firstName = nameParts.shift() ?? "";
        const lastName = nameParts.join(" ");

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
      <aside className="w-full max-w-xs space-y-4">
        <div>
          <p className="text-sm font-semibold text-stone-900">Pengaturan akun</p>
          <div className="mt-4 flex flex-col gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200 ${isActive ? "text-stone-900" : "text-stone-600 hover:text-stone-900"
                    }`}
                >
                  {/* Animated left border */}
                  <span
                    className={`absolute left-0 top-0 h-full w-1 origin-center rounded-full bg-[#d14a35] transition-transform duration-200 ease-out ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                      }`}
                  />
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md text-sm">
                    <IonIcon name={tab.icon} />
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition-colors duration-200 hover:text-stone-900 disabled:opacity-60"
          >
            {/* Animated left border */}
            <span className="absolute left-0 top-0 h-full w-1 origin-center scale-y-0 rounded-full bg-[#d14a35] transition-transform duration-200 ease-out group-hover:scale-y-100" />
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md text-sm">
              {isLoggingOut ? (
                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ) : <IonIcon name="log-out-outline" />}
            </span>
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        {activeTab === "profil" ? (
          <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af]">
            <div className="border-b border-stone-200 pb-3">
              <h2 className="text-base font-semibold text-stone-900">Profil Pengguna</h2>
            </div>

            <div className="mt-5 space-y-4">
              {profileLoading ? (
                <p className="text-sm text-slate-500">Memuat profil...</p>
              ) : null}

              {profileError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {profileError}
                </p>
              ) : null}

              {profileSuccess ? (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {profileSuccess}
                </p>
              ) : null}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700">Email</label>
                <TextField value={profileForm.email} disabled wrapperClassName="bg-stone-200 cursor-not-allowed" className="text-stone-400" />
                <p className="text-xs text-slate-500">
                  *Anda dapat mengubah alamat email melalui menu{" "}
                  <span className="text-[#d14a35]">Akun</span>.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700">Nama Depan *</label>
                <TextField
                  placeholder="Nama depan"
                  value={profileForm.firstName}
                  wrapperClassName="bg-white"
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700">Nama Belakang *</label>
                <TextField
                  placeholder="Nama belakang"
                  value={profileForm.lastName}
                  wrapperClassName="bg-white"
                  onChange={(event) =>
                    setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                />
              </div>

              <button
                type="button"
                onClick={handleProfileSubmit}
                className="mt-2 inline-flex rounded-md bg-black px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#9ca3af]"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        ) : null}

        {activeTab === "akun" ? (
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af]">
              <div className="border-b border-stone-200 pb-3">
                <h2 className="text-base font-semibold text-stone-900">Ubah Email</h2>
              </div>
              <div className="mt-5 space-y-4">
                {emailError ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {emailError}
                  </p>
                ) : null}

                {emailSuccess ? (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {emailSuccess}
                  </p>
                ) : null}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">Email baru *</label>
                  <TextField
                    value={accountEmail}
                    wrapperClassName="bg-white"
                    onChange={(event) => setAccountEmail(event.target.value)}
                  />
                  <p className="text-xs text-slate-500">
                    *Email akan berubah ketika Anda sudah menekan link verifikasi yang
                    dikirimkan ke email baru Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="inline-flex rounded-md bg-black px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#9ca3af]"
                >
                  Ubah email
                </button>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_#9ca3af]">
              <div className="border-b border-stone-200 pb-3">
                <h2 className="text-base font-semibold text-stone-900">Ubah Password</h2>
              </div>
              <div className="mt-5 space-y-4">
                {passwordError ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {passwordError}
                  </p>
                ) : null}

                {passwordSuccess ? (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {passwordSuccess}
                  </p>
                ) : null}
                <p className="text-xs text-slate-500">*Isi jika Anda ingin mengubah password.</p>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">Password saat ini *</label>
                  <TextField
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="password saat ini"
                    value={passwordForm.currentPassword}
                    wrapperClassName="bg-white"
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
                        className="text-stone-700"
                        aria-label={showCurrentPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">Password baru *</label>
                  <TextField
                    type={showNewPassword ? "text" : "password"}
                    placeholder="masukkan password baru"
                    value={passwordForm.newPassword}
                    wrapperClassName="bg-white"
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
                        className="text-stone-700"
                        aria-label={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700">Konfirmasi password baru *</label>
                  <TextField
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="konfirmasi password"
                    value={passwordForm.confirmPassword}
                    wrapperClassName="bg-white"
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
                        className="text-stone-700"
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
                  className="inline-flex rounded-md bg-black px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#9ca3af]"
                >
                  Simpan Password
                </button>
              </div>
            </div>
          </div>
        ) : null}


      </div>
    </section>
  );
}
