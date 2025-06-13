// app/routes/terms.tsx
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Terms & Conditions | Soelle" },
  {
    name: "description",
    content:
      "Terms and Conditions for Soelle portfolio project. Read before using the site.",
  },
];

export default function Terms() {
  return (
    <main className="px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>

      <section className="space-y-6 text-gray-700">
        <p>
          <strong>1. Introduction.</strong> This website is a portfolio project
          and not a real online store. By using this site you acknowledge that
          all content is for demonstration purposes only.
        </p>
        <p>
          <strong>2. Intellectual Property.</strong> All images, text, and code
          on this site are the property of the author and may not be reused
          without permission.
        </p>
        <p>
          <strong>3. Use of Site.</strong> You may browse and interact with this
          site, but any data you enter will not be stored or processed in any
          way.
        </p>
        <p>
          <strong>4. No Warranty.</strong> This project is provided “as is”
          without any warranties of any kind, express or implied.
        </p>
        <p>
          <strong>5. Limitation of Liability.</strong> In no event shall the
          author of this portfolio be liable for any damages arising out of your
          use of this site.
        </p>
        <p>
          <strong>6. Governing Law.</strong> These Terms are governed by German
          law. Any dispute related to these Terms shall be subject to the
          exclusive jurisdiction of the courts of Munich, Germany.
        </p>
        <p>
          <strong>7. Changes.</strong> The author may update these Terms at any
          time; the latest version will always be posted here.
        </p>
      </section>
    </main>
  );
}
