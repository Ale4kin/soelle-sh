import { Link } from "@remix-run/react";

export default function ProductPage({
  product,
  metaobjects,
  relatedProducts = [],
}: {
  product: any;
  relatedProducts?: any[];
  metaobjects: any[];
}) {
  const image = product.images.edges[0]?.node;
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAt = parseFloat(
    product.compareAtPriceRange.minVariantPrice.amount
  );
  const isOnSale = compareAt > minPrice;

  const groupedAttributes = Object.entries(
    metaobjects.reduce((acc, obj) => {
      const type = obj.type.replace("shopify--", ""); // e.g. material
      const label = obj.fields.find(
        (f: { key: string }) => f.key === "label"
      )?.value;

      if (label) {
        if (!acc[type]) acc[type] = [];
        acc[type].push(label);
      }

      return acc;
    }, {} as Record<string, string[]>)
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {image && (
          <img
            src={image.url}
            alt={image.altText || product.title}
            className="w-full rounded-lg shadow"
          />
        )}

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-blue-600">{product.title}</h1>

          <div
            className="text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          <div className="text-xl font-semibold">
            {isOnSale ? (
              <>
                <span className="text-red-600 mr-2">
                  €{minPrice.toFixed(2)}
                </span>
                <span className="line-through text-gray-400">
                  €{compareAt.toFixed(2)}
                </span>
              </>
            ) : (
              <span>€{minPrice.toFixed(2)}</span>
            )}
          </div>

          <form method="post" action="/cart">
            <input type="hidden" name="productHandle" value={product.handle} />
            <button
              type="submit"
              className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Add to Cart
            </button>
          </form>

          {/* Product attributes (placeholder) */}
          {groupedAttributes.length > 0 && (
            <div className="pt-8 border-t mt-8 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <h2 className="text-lg font-semibold mb-4 text-blue-600">
                Product Details
              </h2>
              {groupedAttributes.map(([type, labels]) => (
                <div key={type}>
                  <strong className="capitalize">{type}:</strong>{" "}
                  {(labels as string[]).join(", ")}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          You might also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map(({ node }) => {
            const img = node.images.edges[0]?.node;
            return (
              <Link
                to={`/products/${node.handle}`}
                key={node.id}
                className="block border rounded overflow-hidden hover:shadow-md transition"
              >
                {img && (
                  <img
                    src={img.url}
                    alt={img.altText || node.title}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-4 text-sm">
                  <h3 className="font-semibold">{node.title}</h3>
                  <p>
                    €
                    {parseFloat(node.priceRange.minVariantPrice.amount).toFixed(
                      2
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
