import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Cover from "~/components/cover";
import ProductCard from "~/components/product-card";
import type { Product } from "./_index";
import { shopifyFetch } from "~/utils/shopify";

type LoaderData = {
  products: { node: Product; cursor: string }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
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
  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");

  const variables =
    before !== null
      ? { last: 12, before }
      : { first: 12, after: after ?? undefined };

  const query = `
    query AllProducts($first: Int, $after: String, $last: Int, $before: String) {
      products(first: $first, after: $after, last: $last, before: $before) {
        edges {
          cursor
          node {
            ${PRODUCT_FIELDS}
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: {
      edges: LoaderData["products"];
      pageInfo: LoaderData["pageInfo"];
    };
  }>({ query, variables });

  if (!data?.products) {
    throw new Response("Products not found", { status: 404 });
  }

  return json({
    products: data.products.edges,
    pageInfo: data.products.pageInfo,
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "All Products | Soelle Shop" },
    {
      name: "description",
      content: "Browse every product from Soelle with easy pagination.",
    },
  ];
};

export default function AllProductsPage() {
  const { products, pageInfo } = useLoaderData<LoaderData>();

  return (
    <main className="px-4 py-8">
      <Cover
        title="All Products"
        subtitle="Explore the full Soelle catalog"
        backgroundImage="/images/collections-bg.jpg"
      />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">All products</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing {products.length} items per page
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No products available right now.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map(({ node, cursor }) => (
              <ProductCard key={`${node.id}-${cursor}`} product={node} />
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between mt-10">
          {pageInfo.hasPreviousPage ? (
            <Link
              to={
                pageInfo.startCursor
                  ? `/collections/all?before=${encodeURIComponent(pageInfo.startCursor)}`
                  : "/collections/all"
              }
              className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-400">
              Previous
            </span>
          )}

          {pageInfo.hasNextPage ? (
            <Link
              to={
                pageInfo.endCursor
                  ? `/collections/all?after=${encodeURIComponent(pageInfo.endCursor)}`
                  : "/collections/all"
              }
              className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Next
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-gray-400">
              Next
            </span>
          )}
        </div>
      </section>
    </main>
  );
}
