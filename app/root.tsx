import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import "./tailwind.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { shopifyFetch } from "./utils/shopify";
import { cookie as cartCookie } from "./utils/cookie";
import { GET_CART_QUANTITY_QUERY } from "./utils/queries";
import ErrorPage from "./components/error";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Soelle – Your Favorite Shop" },
    {
      name: "description",
      content:
        "Discover unique collections at Soelle. Stylish, elegant, and made for you.",
    },
    { property: "og:title", content: "Soelle – Your Favorite Shop" },
    {
      property: "og:description",
      content: "Discover unique collections at Soelle.",
    },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/images/social-preview.jpg" },
    { property: "og:url", content: "https://soelle-shop.com" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Soelle – Your Favorite Shop" },
    {
      name: "twitter:description",
      content: "Explore our new collection online.",
    },
    { name: "twitter:image", content: "/images/social-preview.jpg" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cartSession = await cartCookie.parse(cookieHeader || "");

    let cartQuantity = 0;

    if (cartSession?.cartId) {
      const data = await shopifyFetch({
        query: GET_CART_QUANTITY_QUERY,
        variables: {
          id: cartSession.cartId,
        },
      });

      cartQuantity = data?.cart?.totalQuantity || 0;
    }

    return json({ cartQuantity });
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
};

type HandleWithStructuredData = {
  structuredData?: Record<string, unknown>;
};

export function Layout(props: { children?: React.ReactNode }) {
  let cartQuantity = 0;

  try {
    const data = useLoaderData<typeof loader>();
    cartQuantity = data?.cartQuantity ?? 0;
  } catch (e) {
    console.error("Loader data error:", e);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header cartQuantity={cartQuantity} />
        {props.children}
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorPage
        title={`${error.status} — ${error.statusText}`}
        message="Sorry, this page doesn’t exist."
      />
    );
  }

  return (
    <ErrorPage
      title="Something went wrong"
      message={error instanceof Error ? error.message : "Unknown error"}
    />
  );
}

export default function App() {
  return <Outlet />;
}
