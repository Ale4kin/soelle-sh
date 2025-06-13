import { json, Link, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";
import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import Product from "../components/product";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const handle = params.handle;
  if (!handle) throw new Response("No handle provided", { status: 400 });
  const query = `
  {
      productByHandle(handle: "${handle}") {
        id
        title
        handle
        descriptionHtml
        variants(first:2) {
        edges{
        node {
          id
          title
          price {
            amount
            currencyCode
          }
            }
        }
        }
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return [{ title: "Product not found – Soelle" }];
  }
  const { product } = data;
  const siteUrl = "https://soelle-shop.com";
  const productUrl = `${siteUrl}/products/${product.handle}`;
  const imageUrl = product.images.edges[0]?.node.url;
  const price = parseFloat(product.priceRange.minVariantPrice.amount).toFixed(
    2
  );
  const currency = product.priceRange.minVariantPrice.currencyCode;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [imageUrl],
    description: product.description,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: price,
      priceCurrency: currency,
      availability:
        product.totalInventory > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const tags = [
    { title: `${product.title} | Soelle` },
    {
      name: "description",
      content:
        product.description || "Shop this exclusive product on Soelle Shop.",
    },

    { property: "og:title", content: `${product.title} | Soelle` },
    {
      property: "og:description",
      content: product.description || "",
    },
    { property: "og:image", content: imageUrl },
    { property: "og:url", content: productUrl },
    { property: "og:type", content: "product" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${product.title} | Soelle` },
    {
      name: "twitter:description",
      content: product.description || "",
    },
    { name: "twitter:image", content: imageUrl },
  ] as any[];

  tags.push({
    "script:ld+json": structuredData,
  } as any);

  return tags;
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
