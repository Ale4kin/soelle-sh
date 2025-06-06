import type { MetaFunction } from "@remix-run/node";
import Cover from "./cover";

export const meta: MetaFunction = () => {
  return [
    { title: "Contact | Soelle Shop" },
    { name: "description", content: "Get in touch with Soelle Shop" },
  ];
};

export default function Contact() {
  return (
    <main className="px-4 py-8">
      <Cover
        title="Contact Us"
        subtitle="Have questions or feedback? We'd love to hear from you!"
        backgroundImage="/images/cart-bg.jpg"
      />

      <section className="max-w-2xl mx-auto px-4 py-12">
        <form className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
