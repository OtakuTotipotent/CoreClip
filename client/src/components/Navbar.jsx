import { Link, NavLink } from "react-router";
import { Sparkles } from "lucide-react";

const navItems = [
  { label: "Create", path: "/create" },
  { label: "Community", path: "/community" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--background)/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary) text-white">
            <Sparkles size={18} strokeWidth={2.4} />
          </div>

          <span className="text-xl font-bold tracking-tight">CoreClip</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-(--surface-secondary) text-(--foreground)"
                    : "text-(--muted) hover:text-(--foreground)"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-(--muted) transition hover:text-(--foreground)"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-(--primary) px-4 py-2 text-sm font-medium text-white transition hover:bg-(--primary-hover)"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
