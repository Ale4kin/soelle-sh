import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import Cover from "./cover";

export const meta: MetaFunction = () => {
  return [
    { title: "Your Cart | Soelle Shop" },
    {
      name: "description",
      content:
        "Review the items in your cart and proceed to checkout. Enjoy seamless shopping with Soelle Shop.",
    },
  ];
};

type FetcherData = {
  success?: boolean;
};

export default function Cart({
  items,
  cost,
}: {
  items: any[];
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}) {
  const fetcher = useFetcher<FetcherData>();
  return (
    <main className="px-4 py-8">
      <Cover
        title="Your Shopping Cart"
        subtitle="Review your selected items below before checking out. Need help? We're here for you!"
        backgroundImage="/images/cart-bg.jpg"
      />

      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          {items.length > 0 ? (
            <ul className="space-y-6">
              {items.map((item) => {
                const { priceV2, product = [] } = item.merchandise;
                const image = product.images?.edges?.[0]?.node;
                return (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded shadow-md"
                  >
                    {image && (
                      <img
                        src={image.url}
                        alt={image.altText || product.title}
                        className="w-full sm:w-32 h-32 object-cover rounded"
                      />
                    )}

                    <div className="flex-1 w-full">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {product.title}
                      </h3>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          €{priceV2.amount}
                        </p>
                      </div>

                      <div className="mt-3 text-right">
                        <fetcher.Form method="delete" action="/cart">
                          <input type="hidden" name="lineId" value={item.id} />
                          <button
                            type="submit"
                            className="text-sm text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
                            aria-label={`Remove ${product.title} from cart`}
                          >
                            Remove
                          </button>
                        </fetcher.Form>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        {/* Right: Summary Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Order Summary
          </h2>
          <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
            <span>Subtotal</span>
            <span>€{cost.totalAmount.amount}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-4">
            <span>Shipping</span>
            <span className="text-sm">Calculated at checkout</span>
          </div>
          <hr className="border-gray-300 dark:border-gray-700 mb-4" />
          <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-lg mb-6">
            <span>Total</span>
            <span>€{cost.totalAmount.amount}</span>
          </div>

          <button
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-900 transition-colors"
            aria-label="Proceed to Checkout"
            type="button"
          >
            Proceed to Checkout
          </button>
        </div>
      </section>
    </main>
  );
}
