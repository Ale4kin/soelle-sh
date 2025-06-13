import { json, Link, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";
import type { MetaFunction } from "@remix-run/node";
import Cover from "../components/cover";

type CollectionNode = {
  id: string;
  title: string;
  handle: string;
};

type LoaderData = {
  collections: { node: CollectionNode }[];
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

export const meta: MetaFunction = ({ data }) => {
  const collections = (data as LoaderData).collections;
  const siteUrl = "https://soelle-shop.com";

  // Генерируем JSON-LD в формате ItemList
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: collections.map(({ node }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: node.title,
      url: `${siteUrl}/collections/${node.handle}`,
    })),
  };

  return [
    { title: "Collections | Soelle Shop" },
    {
      name: "description",
      content: "Browse curated collections of modern fashion and lifestyle.",
    },
    // Open Graph
    { property: "og:title", content: "Collections | Soelle Shop" },
    {
      property: "og:description",
      content: "Browse curated collections of modern fashion and lifestyle.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${siteUrl}/collections` },
    { property: "og:image", content: "/images/collections-og.jpg" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Collections | Soelle Shop" },
    {
      name: "twitter:description",
      content: "Browse curated collections of modern fashion and lifestyle.",
    },
    { name: "twitter:image", content: "/images/collections-og.jpg" },

    {
      "script:ld+json": structuredData,
    },
  ];
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
