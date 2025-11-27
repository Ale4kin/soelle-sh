import type { Product } from "~/routes/_index";
import Cover from "./cover";
import { Form, Link } from "@remix-run/react";
import ProductCard from "./product-card";

type CollectionProps = {
  products: {
    node: Product;
  }[];
  handle: string;
  title: string;
  color?: string;
  colorOptions?: string[];
  backgroundImage?: { url: string; altText: string | null };
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
};

export default function Collection({
  products,
  handle,
  title,
  color = "",
  colorOptions = [],
  //   backgroundImage = "/images/collections-bg.jpg",
  backgroundImage,
  pageInfo,
}: CollectionProps) {
  const coverImage = backgroundImage?.url || "/images/collections-bg.jpg";
  const showPagination =
    !!pageInfo &&
    (pageInfo.hasNextPage || pageInfo.hasPreviousPage) &&
    products.length >= 12;

  return (
    <main className="px-4 py-8">
      <Cover backgroundImage={coverImage} />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-6xl font-semibold text-center mb-8">
          {title.toLocaleUpperCase().replace(/-/g, " ")}
        </h2>

        <Form
          method="get"
          replace
          preventScrollReset
          className="mb-8 flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Filter
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Narrow products by color across this collection.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label
              className="text-sm text-gray-700 dark:text-gray-200"
              htmlFor="color-select"
            >
              Color
            </label>
            <select
              name="color"
              id="color-select"
              defaultValue={color}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="">Any</option>
              {colorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:hover:bg-black/80"
            >
              Apply
            </button>
              {color && (
                <Link
                  to={`/collection/${handle}`}
                  preventScrollReset
                  replace
                  prefetch="intent"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Clear
                </Link>
            )}
          </div>
        </Form>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(({ node }) => {
            return <ProductCard key={node.id} product={node} />;
          })}
        </ul>

        {showPagination && (
          <div className="flex items-center justify-between mt-10">
            {pageInfo.hasPreviousPage ? (
              <Link
                to={
                  pageInfo.startCursor
                    ? `/collection/${handle}?before=${encodeURIComponent(pageInfo.startCursor)}${color ? `&color=${encodeURIComponent(color)}` : ""}`
                    : `/collection/${handle}${color ? `?color=${encodeURIComponent(color)}` : ""}`
                }
                prefetch="intent"
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
                    ? `/collection/${handle}?after=${encodeURIComponent(pageInfo.endCursor)}${color ? `&color=${encodeURIComponent(color)}` : ""}`
                    : `/collection/${handle}${color ? `?color=${encodeURIComponent(color)}` : ""}`
                }
                prefetch="intent"
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
        )}
      </section>
      <div className="text-center py-12">
        <Link
          to="/collections"
          className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          Back to All Collections
        </Link>
      </div>
    </main>
  );
}
