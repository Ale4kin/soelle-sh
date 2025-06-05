import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";

import Hero from "../components/hero";
import ProductCard from "~/components/product-card";

export const meta: MetaFunction = () => {
  return [
    { title: "Soelle Shop" },
    { name: "description", content: "Welcome to Soelle Shop!" },
  ];
};

export const loader = async () => {
  const query = `
    {
        collectionByHandle(handle: "new-arrivals") {
          id,
          products(first: 6) {
           edges {
             node {
               id
               title
               handle
               descriptionHtml
               priceRange {
                 maxVariantPrice {
                   amount
                   currencyCode
                 }
                 minVariantPrice {
                   amount
                   currencyCode
                 }
               }
                 compareAtPriceRange{
                 maxVariantPrice {
                   amount
                   currencyCode
                 }
                 minVariantPrice {
                   amount
                   currencyCode
                 }
               }
               images(first: 1) {
                 edges {
                   node {
                     url
                     altText
                   }
                 }
               }
             }
           }
         }
        }
    }
    `;

  const data = await shopifyFetch({ query });
  if (!data.collectionByHandle) {
    throw new Response("Collection not found", { status: 404 });
  }
  return json({ products: data.collectionByHandle.products.edges });
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
};

export type LoaderData = {
  products: {
    node: Product;
  }[];
};

export default function Index() {
  const { products } = useLoaderData<LoaderData>();

  return (
    <main className="px-4 py-8">
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          New Arrivals
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(({ node }) => {
            return (
              <li
                key={node.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                <ProductCard product={node} />
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
