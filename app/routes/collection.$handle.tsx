import { json, Link, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";
import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import Collection from "../components/collection";
import { LoaderData as ProductLoaderData } from "./_index";

export const meta: MetaFunction = ({ params }) => {
  const handle = params.handle || "Collection";
  return [
    { title: `${handle} | Soelle Shop` },
    {
      name: "description",
      content: `Browse products from the ${handle} collection at Soelle Shop.`,
    },
  ];
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

export default function CollectionPage() {
  const { products, title } = useLoaderData<
    ProductLoaderData & { title: string }
  >();

  return <Collection products={products} title={title} />;
}
