import { json, Link, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";
import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import Collection from "../components/collection";
import { LoaderData as ProductLoaderData } from "./_index";

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: { node: { url: string; altText: string | null } }[];
  };
};

type LoaderData = {
  title: string;
  products: { node: ProductNode }[];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const handle = params.handle;
  if (!handle) throw new Response("No handle provided", { status: 400 });
  const query = `
    {
        collectionByHandle(handle: "${handle}") {
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
  return json({
    products: data.collectionByHandle.products.edges,
    title: handle,
  });
};

export const meta: MetaFunction = ({ data, params }) => {
  const collectionTitle =
    (data as LoaderData | undefined)?.title ?? params.handle;
  const siteUrl = "https://soelle-shop.com";
  const pageUrl = `${siteUrl}/collections/${params.handle}`;

  const structuredData =
    data &&
    typeof data === "object" &&
    "products" in data &&
    Array.isArray((data as LoaderData).products)
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: collectionTitle,
          itemListElement: (data as LoaderData).products.map(({ node }, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: node.title,
            url: `${siteUrl}/products/${node.handle}`,
          })),
        }
      : null;

  const metaTags = [
    { title: `${collectionTitle} | Soelle Shop` },
    {
      name: "description",
      content: `Browse products in our "${collectionTitle}" collection at Soelle Shop.`,
    },

    { property: "og:title", content: `${collectionTitle} | Soelle Shop` },
    {
      property: "og:description",
      content: `Browse products in our "${collectionTitle}" collection.`,
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: "/images/collections-bg.jpg" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${collectionTitle} | Soelle Shop` },
    {
      name: "twitter:description",
      content: `Browse products in our "${collectionTitle}" collection.`,
    },
    { name: "twitter:image", content: "/images/collections-bg.jpg" },
  ];

  if (structuredData) {
    metaTags.push({
      "script:ld+json": structuredData,
    } as any);
  }

  return metaTags;
};

export default function CollectionPage() {
  const { products, title } = useLoaderData<
    ProductLoaderData & { title: string }
  >();

  return <Collection products={products} title={title} />;
}
