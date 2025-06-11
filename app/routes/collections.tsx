import { json, Link, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";
import type { MetaFunction } from "@remix-run/node";
import Cover from "../components/cover";

export const meta: MetaFunction = () => {
  return [
    { title: "Collections | Soelle Shop" },
    {
      name: "description",
      content: "Browse curated collections of modern fashion and lifestyle.",
    },
  ];
};

export const loader = async () => {
  const query = `
    {
        collections(first: 6) {
            edges {
                node {
                    id
                    title
                    handle
                }
            }
        }
    }
    `;

  const data = await shopifyFetch({ query });
  if (!data || !data.collections || !data.collections.edges) {
    throw new Response("Collections not found", { status: 404 });
  }

  return json({ collections: data.collections.edges });
};
type CollectionNode = {
  id: string;
  title: string;
  handle: string;
};

type LoaderData = {
  collections: { node: CollectionNode }[];
};

export default function Collections() {
  const { collections } = useLoaderData<LoaderData>();

  return (
    <main className="px-4 py-8">
      <Cover
        title="Our Collections"
        subtitle="Explore all product collections from Soelle Shop"
        backgroundImage="/images/collections-bg.jpg"
      />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {(collections || []).map(({ node }) => (
            <div
              key={node.id}
              className="border rounded-lg bg-white dark:bg-gray-800 p-6 shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-semibold mb-3">{node.title}</h2>
              <Link
                to={`/collection/${node.handle}`}
                className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Collection
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
