import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";

import Hero from "../components/hero";

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

type Product = {
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

type LoaderData = {
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
            const image = node.images.edges[0]?.node;
            const minPrice = node.priceRange.minVariantPrice;
            const compareAt = node.compareAtPriceRange.minVariantPrice;

            const isOnSale =
              compareAt?.amount &&
              parseFloat(compareAt.amount) > parseFloat(minPrice.amount);

            return (
              <li
                key={node.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                {image && (
                  <img
                    src={image.url}
                    alt={image.altText || node.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{node.title}</h3>

                  <div
                    className="text-sm text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: node.descriptionHtml }}
                  />

                  <div className="text-base font-medium">
                    {isOnSale ? (
                      <span>
                        <span className="text-red-600 mr-2">
                          €{parseFloat(minPrice.amount).toFixed(2)}
                        </span>
                        <span className="line-through text-gray-400">
                          €{parseFloat(compareAt.amount).toFixed(2)}
                        </span>
                      </span>
                    ) : (
                      <span>€{parseFloat(minPrice.amount).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
