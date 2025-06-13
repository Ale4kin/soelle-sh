import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Privacy Policy | Soelle" },
  {
    name: "description",
    content: "Privacy Policy for Soelle portfolio project.",
  },
];

export default function Privacy() {
  return (
    <main className="px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p>
        This site is a portfolio project. We do not collect any personal data.
        Any data submitted here is not stored.
      </p>
    </main>
  );
}
