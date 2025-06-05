import type { Product } from "~/routes/_index";
import Cover from "./cover";
import { Link } from "@remix-run/react";
import ProductCard from "./product-card";

type CollectionProps = {
  products: {
    node: Product;
  }[];
  title: string;
  subtitle?: string;
  backgroundImage?: string;
};

export default function Collection({
  products,
  title,
  subtitle,
  backgroundImage = "/images/collections-bg.jpg",
}: CollectionProps) {
  return (
    <main className="px-4 py-8">
      <Cover backgroundImage={backgroundImage} />

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
