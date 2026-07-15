import { Link, NavLink } from "react-router-dom";
import { Radio, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAccount } from "../context/AccountContext";

const links = [
  { to: "/dashboard", label: "Categories" },
  { to: "/feed", label: "Live Feed" },
  { to: "/report", label: "Report Emergency" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { account } = useAccount();

  return (
    <header className="sticky top-0 z-50 border-b border-base-700 bg-base-950/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600">
            <Radio className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Silent Earth</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-base-800 text-white"
                    : "text-gray-400 hover:bg-base-800 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {account && (
            <span className="ml-2 rounded-full border border-base-600 px-3 py-1.5 text-xs font-medium text-gray-400">
              {account.name}
            </span>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-gray-300 hover:bg-base-800 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-base-700 bg-base-950 px-4 pb-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive ? "bg-base-800 text-white" : "text-gray-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {account && (
            <div className="mt-2 rounded-lg border border-base-600 px-4 py-2 text-xs text-gray-400">
              Reporting as {account.name}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
