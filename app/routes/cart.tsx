import { useLoaderData } from "@remix-run/react";
import Cart from "../components/cart";
import {
  createCookie,
  json,
  LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";

import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  GET_CART_QUERY,
  REMOVE_FROM_CART_MUTATION,
} from "~/utils/queries";
import { shopifyFetch } from "~/utils/shopify";
import type {
  CartResponse,
  CreateCartResponse,
  AddToCartResponse,
} from "~/utils/cart-types";
import { cookie } from "~/utils/cookie";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const quantity = formData.get("quantity");
  const lineId = formData.get("lineId");

  const method = request.method.toLowerCase();

  const cookieHeader = request.headers.get("Cookie");

  const cartSession = await cookie.parse(cookieHeader || "");

  console.log("Action method:", method);

  if (method === "delete") {
    if (!lineId) {
      throw new Response("Line ID is required", { status: 400 });
    }

    if (!cartSession?.cartId) {
      throw new Response("Cart not found", { status: 404 });
    }
    const data = await shopifyFetch({
      query: REMOVE_FROM_CART_MUTATION,
      variables: {
        cartId: cartSession.cartId,
        lineIds: [lineId],
      },
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      return json(
        { success: false, errors: data.cartLinesRemove.userErrors },
        { status: 400 }
      );
    }

    return json({ success: true });
  }

  if (method === "post") {
    if (!productId) {
      throw new Response("Product is required", { status: 400 });
    }

    const input = {
      lines: [
        {
          merchandiseId: productId,
          quantity: quantity ? parseInt(quantity as string, 10) : 1,
        },
      ],
    };

    if (!cartSession?.cartId) {
      // If no cartId exists, create a new one
      const data = await shopifyFetch<CreateCartResponse>({
        query: CREATE_CART_MUTATION,
        variables: { input },
      });

      const cartId = data.cartCreate.cart.id;
      const cookieValue = await cookie.serialize({ cartId });

      return json(
        { success: true, cartId },
        { headers: { "Set-Cookie": cookieValue } }
      );
    } else {
      const data = await shopifyFetch<AddToCartResponse>({
        query: ADD_TO_CART_MUTATION,
        variables: {
          cartId: cartSession.cartId,
          lines: input.lines,
        },
      });

      if (data.cartLinesAdd.userErrors.length > 0) {
        return json(
          { success: false, errors: data.cartLinesAdd.userErrors },
          { status: 400 }
        );
      }

      return json({ success: true });
    }
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");

  const cartSession = await cookie.parse(cookieHeader || "");

  if (!cartSession?.cartId) {
    return {
      items: [],
      cost: {
        totalAmount: {
          amount: "0.00",
          currencyCode: "EUR",
        },
      },
    };
  } else {
    const data = await shopifyFetch<CartResponse>({
      query: GET_CART_QUERY,
      variables: { cartId: cartSession.cartId },
    });

    return json({
      items: data.cart.lines.edges.map((edge: any) => edge.node),
      cost: data.cart.cost,
    });
  }
};

export default function CartPage() {
  const { items, cost } = useLoaderData<any>();

  return <Cart items={items} cost={cost} />;
}
