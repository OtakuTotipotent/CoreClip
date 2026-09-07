import { Link, NavLink, useNavigate } from "react-router";
import { LogOut, Sparkles } from "lucide-react";
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

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully");

      navigate("/");
    } catch {
      toast.error("Unable to logout");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--background)/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary) text-white">
            <Sparkles size={18} strokeWidth={2.4} />
          </div>

          <span className="text-xl font-bold tracking-tight">CoreClip</span>
        </Link>

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

        <div className="flex items-center gap-2">
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
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-(--surface-secondary) sm:flex"
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
      </div>
    </header>
  );
};

export default Navbar;
