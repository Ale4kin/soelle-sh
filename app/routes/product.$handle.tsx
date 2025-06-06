import { json, Link, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";
import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import Product from "../components/product";

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
      productByHandle(handle: "${handle}") {
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
          totalInventory
        category {
        name
        }
         metafields(identifiers: [
            { namespace: "shopify", key: "material" },
            { namespace: "shopify", key: "color-pattern" },
            { namespace: "shopify", key: "fit" },
            { namespace: "shopify", key: "waist-rise" },
            { namespace: "shopify", key: "pants-length-type" },
            { namespace: "shopify", key: "age-group" },
            { namespace: "shopify", key: "neckline" },
            { namespace: "shopify", key: "fabric" },
            { namespace: "shopify", key: "target-gender" },
            { namespace: "shopify", key: "clothing-features" }
        ]) {
            key
            value
            type
            description
        
        }
      }

      collectionByHandle(handle: "new-arrivals") {
      title
      products(first: 3) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
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

  if (!data) {
    throw new Response("Product not found", { status: 404 });
  }
  const product = data.productByHandle;
  const metafields = product.metafields || [];
  const metaobjectGids: string[] = metafields
    .filter((mf: any) => mf?.type === "list.metaobject_reference" && mf?.value)
    .flatMap((mf: any) => {
      try {
        return JSON.parse(mf.value);
      } catch {
        return [];
      }
    });
  let metaobjectsData = [];
  if (metaobjectGids.length > 0) {
    const nodesQuery = `
      {
        nodes(ids: [${metaobjectGids.map((id) => `"${id}"`).join(",")}]) {
          ... on Metaobject {
            id
            type
            fields {
              key
              value
            }
          }
        }
      }
    `;

    const nodesResult = await shopifyFetch({ query: nodesQuery });
    metaobjectsData = nodesResult?.nodes || [];
  }

  return json({
    product: data.productByHandle,
    relatedProducts: data.collectionByHandle?.products?.edges || [],
    metaobjects: metaobjectsData,
  });
};

export default function ProductPage() {
  const { product, relatedProducts, metaobjects } = useLoaderData<any>();

  return (
    <Product
      product={product}
      relatedProducts={relatedProducts}
      metaobjects={metaobjects}
    />
  );
}
