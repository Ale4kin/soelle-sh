// app/components/Header.tsx
import { Link, NavLink } from "@remix-run/react";

export default function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-black underline" : "text-gray-600 hover:text-black"
    }`;

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-black">
          Soelle
        </Link>

        <nav className="flex gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/collections" className={navLinkClass}>
            Collections
          </NavLink>
          <NavLink to="/faq" className={navLinkClass}>
            FAQ
          </NavLink>
          <NavLink to="/contacts" className={navLinkClass}>
            Contacts
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
