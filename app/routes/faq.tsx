import { MetaFunction } from "@remix-run/node";
import FAQ, { faqData } from "../components/faq";
export default function FAQPage() {
  return <FAQ />;
}

export const meta: MetaFunction = () => {
  return [
    { title: "FAQ | Soelle Shop" },
    {
      name: "description",
      content:
        "Find answers to frequently asked questions about Soelle Shop, orders, shipping, and more.",
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    },
  ];
};
