import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Impressum | Soelle" },
  {
    name: "description",
    content: "Impressum (Legal Notice) for Soelle portfolio project.",
  },
];

export default function Impressum() {
  return (
    <main className="px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Impressum</h1>
      <p>
        This is a portfolio project. The information on this page is provided
        for demonstration purposes only.
      </p>
    </main>
  );
}
