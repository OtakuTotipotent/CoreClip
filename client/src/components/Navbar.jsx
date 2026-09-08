import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    label: "Create",
    path: "/create",
  },
  {
    label: "Community",
    path: "/community",
  },
];

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();

      setMobileOpen(false);

      toast.success("Logged out successfully");

      navigate("/");
    } catch {
      toast.error("Unable to logout");
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--background)/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary) text-white">
            <Sparkles size={18} strokeWidth={2.4} />
          </div>

          <span className="text-lg font-bold tracking-tight sm:text-xl">
            CoreClip
          </span>
        </Link>

        {/* Desktop navigation */}
        {isAuthenticated && (
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
        )}

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-(--surface-secondary)"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--primary-soft) text-[10px] font-semibold text-(--primary)">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <span className="max-w-24 truncate">{user?.name}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="rounded-lg p-2 text-(--muted) transition hover:bg-(--surface-secondary) hover:text-(--foreground)"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--border) bg-(--surface) text-(--muted) transition hover:text-(--foreground) md:hidden"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-(--border) bg-(--background) md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {isAuthenticated ? (
              <div className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-(--primary-soft) text-(--primary)"
                          : "text-(--muted) hover:bg-(--surface-secondary) hover:text-(--foreground)"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-(--surface-secondary)"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary-soft) text-xs font-semibold text-(--primary)">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate">{user?.name}</p>

                    <p className="truncate text-xs text-(--muted)">
                      {user?.email}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-(--muted) transition hover:bg-(--surface-secondary) hover:text-(--foreground)"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-sm font-medium transition hover:bg-(--surface-secondary)"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center rounded-xl bg-(--primary) px-4 py-3 text-sm font-medium text-white transition hover:bg-(--primary-hover)"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
