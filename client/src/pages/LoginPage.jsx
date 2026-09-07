import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      await login(form.email, form.password);

      toast.success("Welcome back");

      const destination = location.state?.from || "/create";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>

          <p className="mt-2 text-(--muted)">
            Login to continue creating with CoreClip.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-(--shadow)"
        >
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-(--border) bg-transparent px-4 py-3 outline-none transition focus:border-(--primary)"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              required
              className="w-full rounded-xl border border-(--border) bg-transparent px-4 py-3 outline-none transition focus:border-(--primary)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 font-medium text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}

            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--muted)">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-(--primary) hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
