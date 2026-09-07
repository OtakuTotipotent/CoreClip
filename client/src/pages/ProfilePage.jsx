import { useState } from "react";
import {
  Camera,
  Check,
  Crown,
  Loader2,
  LogOut,
  Mail,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";

const ProfilePageContent = () => {
  const navigate = useNavigate();

  const { user, updateProfile, logout } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      form.name.trim() === user?.name &&
      form.email.trim().toLowerCase() === user?.email
    ) {
      toast.info("No changes to save");
      return;
    }

    setSaving(true);

    try {
      await updateProfile(form.name, form.email);

      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();

      toast.success("Logged out successfully");

      navigate("/", {
        replace: true,
      });
    } catch {
      toast.error("Unable to logout");
      setLoggingOut(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CC";

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Profile
        </h1>

        <p className="mt-2 text-(--muted)">
          Manage your account and CoreClip preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow) sm:p-8">
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative w-fit">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-(--primary-soft) text-2xl font-semibold text-(--primary)">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <button
                  type="button"
                  disabled
                  title="Profile image upload will be enabled with Cloudinary"
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full border border-(--border) bg-(--surface) text-(--muted) shadow-sm"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>

                <p className="mt-1 text-sm text-(--muted)">{user?.email}</p>

                <span className="mt-3 inline-flex rounded-full bg-(--primary-soft) px-3 py-1 text-xs font-medium capitalize text-(--primary)">
                  {user?.plan} plan
                </span>
              </div>
            </div>

            <div className="mb-6 border-t border-(--border)" />

            <div className="mb-6">
              <h2 className="text-lg font-semibold">Personal information</h2>

              <p className="mt-1 text-sm text-(--muted)">
                Update your basic account information.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
                >
                  Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-(--border) bg-transparent py-3 pl-11 pr-4 outline-none transition focus:border-(--primary)"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-(--border) bg-transparent py-3 pl-11 pr-4 outline-none transition focus:border-(--primary)"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-5 py-3 text-sm font-medium text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}

                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow) sm:p-8">
            <h2 className="text-lg font-semibold">Session</h2>

            <p className="mt-1 text-sm text-(--muted)">
              Sign out of your CoreClip account on this device.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-5 flex items-center gap-2 rounded-xl border border-(--border) px-4 py-2.5 text-sm font-medium transition hover:bg-(--surface-secondary) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <LogOut size={17} />
              )}

              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary-soft) text-(--primary)">
              <Crown size={19} />
            </div>

            <h2 className="text-lg font-semibold">Current plan</h2>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-2xl font-semibold capitalize">
                  {user?.plan}
                </div>

                <p className="mt-1 text-sm text-(--muted)">CoreClip account</p>
              </div>
            </div>

            <div className="my-5 border-t border-(--border)" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-(--primary)" />
                AI ad generation
              </div>

              <div className="flex items-center gap-2">
                <Check size={16} className="text-(--primary)" />
                Community access
              </div>

              <div className="flex items-center gap-2">
                <Check size={16} className="text-(--primary)" />
                Personal ad library
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-xl border border-(--border) px-4 py-2.5 text-sm font-medium text-(--muted)"
            >
              Upgrade coming later
            </button>
          </div>

          <div className="rounded-2xl border border-(--border) bg-(--surface-secondary) p-5">
            <p className="text-sm leading-6 text-(--muted)">
              Generated ads, uploads, and community activity will be associated
              with this account.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  const userKey = user?.id || user?._id || user?.email || "profile";

  return <ProfilePageContent key={userKey} />;
};

export default ProfilePage;
