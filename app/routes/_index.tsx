import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";

import Hero from "../components/hero";
import ProductCard from "~/components/product-card";

export const meta: MetaFunction = () => {
  return [
    { title: "Soelle Shop" },
    { name: "description", content: "Welcome to Soelle Shop!" },
  ];
};

const PRODUCT_FIELDS = `
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
  compareAtPriceRange {
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
`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q")?.trim() ?? "";
  const isSearching = Boolean(searchTerm);

  const searchQuery = `
    query SearchProducts($search: String!) {
      products(first: 12, query: $search) {
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  `;

  if (isSearching) {
    const searchData = await shopifyFetch({
      query: searchQuery,
      variables: { search: searchTerm },
    });

    return json({
      products: searchData?.products?.edges ?? [],
      searchTerm,
    });
  }

  const newArrivalsQuery = `
    {
        collectionByHandle(handle: "new-arrivals") {
          id
          products(first: 6) {
           edges {
             node {
               ${PRODUCT_FIELDS}
             }
           }
         }
        }
    }
    `;

  const data = await shopifyFetch({ query: newArrivalsQuery });
  if (!data.collectionByHandle) {
    throw new Response("Collection not found", { status: 404 });
  }

  return json({
    products: data.collectionByHandle.products.edges,
    searchTerm: "",
  });
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
  searchTerm: string;
};

export default function Index() {
  const { products, searchTerm } = useLoaderData<LoaderData>();
  const isSearching = Boolean(searchTerm);

  return (
    <main className="px-4 py-8">
      <Hero />

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Search
              </p>
              <h2 className="text-2xl font-semibold">
                Find your next favorite piece
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Look up products by name, fabric, or color right from the home
                page.
              </p>
            </div>

            <Form
              method="get"
              preventScrollReset
              className="flex w-full flex-col gap-3 md:w-1/2"
            >
              <div className="flex items-center gap-3">
                <input
                  type="search"
                  name="q"
                  defaultValue={searchTerm}
                  placeholder="Search dresses, fabrics, or colors"
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-base focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  onChange={(event) => {
                    if (isSearching && event.currentTarget.value === "") {
                      if (event.currentTarget.form) {
                        event.currentTarget.form.requestSubmit();
                      }
                    }
                  }}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-black px-4 py-3 text-white transition hover:bg-gray-800 dark:hover:bg-black/80"
                >
                  Search
                </button>
              </div>
              {isSearching && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  Showing results for &quot;{searchTerm}&quot;
                  <Link
                    to="/"
                    className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Clear
                  </Link>
                </div>
              )}
            </Form>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-8">
          {isSearching ? `Search results for "${searchTerm}"` : "New Arrivals"}
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No products found. Try a different keyword or{" "}
            <Link
              to="/collections"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              browse all collections
            </Link>
            .
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map(({ node }) => {
              return <ProductCard key={node.id} product={node} />;
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
