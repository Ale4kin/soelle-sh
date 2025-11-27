import { json, useLoaderData } from "@remix-run/react";
import { shopifyFetch } from "~/utils/shopify";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import Collection from "../components/collection";

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  colors?: string[];
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
  metafields?: {
    key: string;
    value: string | null;
    type?: string;
    references?: {
      edges: { node: { fields?: { key: string; value: string }[] } }[];
    };
  }[];
};

type ProductEdge = {
  node: ProductNode;
};

type LoaderData = {
  title: string;
  products: ProductEdge[];
  color?: string;
  colorOptions: string[];
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
  handle: string;
  image?: { url: string; altText: string | null };
};

function extractColorsFromMetafields(
  metafields?: {
    key: string;
    value: string | null;
    type?: string;
    references?: {
      edges: { node: { fields?: { key: string; value: string }[] } }[];
    };
  }[]
) {
  if (!metafields) return [];
  const set = new Set<string>();

  metafields
    .filter((mf) => mf?.key === "color" || mf?.key === "color-pattern")
    .forEach((mf) => {
      const type = mf.type || "";
      const rawValue = (mf.value || "").trim();

      if (rawValue && !type.includes("metaobject_reference")) {
        if (type.startsWith("list.single_line_text_field")) {
          try {
            const parsed = JSON.parse(rawValue);
            if (Array.isArray(parsed)) {
              parsed
                .map((c) => (typeof c === "string" ? c.trim() : ""))
                .filter(Boolean)
                .forEach((c) => set.add(c));
              return;
            }
          } catch {
            // fall through to add raw value
          }
        }

        set.add(rawValue);
      }

      if (type.includes("metaobject_reference")) {
        const refs = mf.references?.edges || [];
        refs.forEach(({ node }) => {
          const fields = node.fields || [];
          const labelField =
            fields.find((f) => f.key === "label") ||
            fields.find((f) => f.key === "color") ||
            fields.find((f) => f.key === "value") ||
            fields[0];
          if (labelField?.value) {
            set.add(labelField.value.trim());
          }
        });
      }
    });

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const handle = params.handle;
  if (!handle) throw new Response("No handle provided", { status: 400 });

  const url = new URL(request.url);
  const colorParam = url.searchParams.get("color")?.trim() || "";
  const query = `
    query CollectionWithProducts($handle: String!, $first: Int, $after: String, $last: Int, $before: String) {
      collectionByHandle(handle: $handle) {
        id
        image { url altText }
        title
        products(first: $first, after: $after, last: $last, before: $before) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              priceRange {
                maxVariantPrice { amount currencyCode }
                minVariantPrice { amount currencyCode }
              }
              compareAtPriceRange {
                maxVariantPrice { amount currencyCode }
                minVariantPrice { amount currencyCode }
              }
              images(first: 1) {
                edges { node { url altText } }
              }
              metafields(
                identifiers: [
                  { namespace: "shopify", key: "color" },
                  { namespace: "shopify", key: "color-pattern" }
                ]
              ) {
                key
                value
                type
                references(first: 20) {
                  edges {
                    node {
                      ... on Metaobject {
                        id
                        handle
                        fields {
                          key
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
  `;

  const productListQuery = `
    query AllProducts($first: Int, $after: String, $last: Int, $before: String) {
      products(first: $first, after: $after, last: $last, before: $before) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            priceRange {
              maxVariantPrice { amount currencyCode }
              minVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              maxVariantPrice { amount currencyCode }
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText } }
            }
            metafields(
              identifiers: [
                { namespace: "shopify", key: "color" },
                { namespace: "shopify", key: "color-pattern" }
              ]
            ) {
              key
              value
              type
              references(first: 20) {
                edges {
                  node {
                    ... on Metaobject {
                      id
                      handle
                      fields {
                        key
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

  const after = url.searchParams.get("after");
  const before = url.searchParams.get("before");

  const variables =
    before !== null
      ? {
          last: 12,
          before,
        }
      : {
          first: 12,
          after: after ?? undefined,
        };

  if (handle === "all") {
    const data = await shopifyFetch({
      query: productListQuery,
      variables,
    });

    if (!data?.products) {
      throw new Response("Products not found", { status: 404 });
    }

    const enrichedEdges = data.products.edges.map((edge: ProductEdge) => ({
      ...edge,
      node: {
        ...edge.node,
        colors: extractColorsFromMetafields(edge.node.metafields),
      },
      })
    );

    const filteredEdges = colorParam
      ? enrichedEdges.filter((edge: ProductEdge) =>
          (edge.node.colors || []).some(
            (c: string) => c.toLowerCase() === colorParam.toLowerCase()
          )
        )
      : enrichedEdges;

    const colorOptions = Array.from(
      new Set<string>(
        enrichedEdges.flatMap((edge: ProductEdge) => edge.node.colors || [])
      )
    ).sort((a: string, b: string) => a.localeCompare(b));

    return json({
      products: filteredEdges,
      title: "All Products",
      pageInfo: data.products.pageInfo,
      handle,
      image: { url: "/images/collections-bg.jpg", altText: null },
      colorOptions,
      color: colorParam,
    });
  }

  const data = await shopifyFetch<{
    products: {
      edges: ProductEdge[];
      pageInfo: LoaderData["pageInfo"];
    };
    collectionByHandle?: {
      title: string;
      image?: { url: string; altText: string | null };
      products: {
        edges: ProductEdge[];
        pageInfo: LoaderData["pageInfo"];
      };
    };
  }>({
    query,
    variables: { handle, ...variables },
  });

  if (!data.collectionByHandle) {
    throw new Response("Collection not found", { status: 404 });
  }

  const enrichedEdges = data.collectionByHandle.products.edges.map(
    (edge: ProductEdge) => ({
      ...edge,
      node: {
        ...edge.node,
        colors: extractColorsFromMetafields(edge.node.metafields),
      },
    })
  );

  const filteredEdges = colorParam
    ? enrichedEdges.filter((edge: ProductEdge) =>
        (edge.node.colors || []).some(
          (c: string) => c.toLowerCase() === colorParam.toLowerCase()
        )
      )
    : enrichedEdges;

  const colorOptions = Array.from(
    new Set<string>(
      enrichedEdges.flatMap((edge: ProductEdge) => edge.node.colors || [])
    )
  ).sort((a: string, b: string) => a.localeCompare(b));

  return json({
    products: filteredEdges,
    title: data.collectionByHandle.title || handle,
    image: data.collectionByHandle.image,
    pageInfo: data.collectionByHandle.products.pageInfo,
    handle,
    colorOptions,
    color: colorParam,
  });
};

export const meta: MetaFunction = ({ data, params }) => {
  const collectionTitle =
    (data as LoaderData | undefined)?.title ?? params.handle;
  const siteUrl = "https://soelle-shop.com";
  const pageUrl = `${siteUrl}/collection/${params.handle}`;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  return metaTags;
};

export default function CollectionPage() {
  const { products, title, image, pageInfo, handle, color, colorOptions } =
    useLoaderData<LoaderData>();
  console.log(products);
  return (
    <Collection
      products={products}
      title={title}
      backgroundImage={image}
      pageInfo={pageInfo}
      handle={handle}
      color={color}
      colorOptions={colorOptions}
    />
  );
}
