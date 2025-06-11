import { Link, NavLink } from "@remix-run/react";

export default function Header({ cartQuantity }: { cartQuantity: number }) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-black underline" : "text-gray-600 hover:text-black"
    }`;

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
        >
          Soelle
        </Link>

        <nav className="flex gap-6" aria-label="Main navigation">
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
          <NavLink to="/cart" className={navLinkClass}>
            Cart
            {cartQuantity > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                {cartQuantity}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
