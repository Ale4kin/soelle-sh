// app/components/Footer.tsx
import { Link } from "@remix-run/react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/collections" className="hover:underline">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/collections/new-arrivals" className="hover:underline">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/contacts" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:underline">
                Returns
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:underline">
                Shipping Info
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/impressum" className="hover:underline">
                Impressum
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm mb-4">
            Subscribe and get 10% off your first order!
          </p>
          <form className="flex">
            <label htmlFor="footer-newsletter" className="sr-only">
              Your email
            </label>
            <input
              id="footer-newsletter"
              type="email"
              placeholder="Your email"
              required
              className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 rounded-r-md hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-sm text-center text-gray-500">
        <p>
          <strong>Notice:</strong> This site is a portfolio project and is not a
          real online store. Any data here is for demonstration purposes only.
        </p>
      </div>

      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between text-sm space-y-2 sm:space-y-0">
          <p>© {year} Soelle GmbH. All rights reserved.</p>
          <p>
            Soelle GmbH, Musterstraße 1, 80333 München, Germany | HRB 123456 |
            USt-IdNr. DE123456789
          </p>
        </div>
      </div>
    </footer>
  );
}
