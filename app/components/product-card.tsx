import { Link } from "@remix-run/react";
import type { Product } from "../routes/_index";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images.edges[0]?.node;
  const minPrice = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;

  const isOnSale =
    compareAt?.amount &&
    parseFloat(compareAt.amount) > parseFloat(minPrice.amount);

  return (
    <li className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      {image && (
        <img
          src={image.url}
          alt={image.altText || product.title}
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{product.title}</h3>

        <div
          className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
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

        <Link
          to={`/product/${product.handle}`}
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Product
        </Link>
      </div>
    </li>
  );
}
