// app/routes/faq.tsx
import { useState } from "react";

import Cover from "../components/cover";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "What sizes do you offer?",
    answer:
      "We currently offer sizes XS to XL. You can find a detailed size guide on each product page.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping usually takes 3–7 business days depending on your location. You'll receive a tracking link once your order ships.",
  },
  {
    question: "Do you accept returns?",
    answer:
      "Yes. We accept returns and exchanges within 14 days of delivery. Items must be unworn and in original condition.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us anytime at support@soelle.com. We typically reply within 24 hours.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <main className="px-4 py-8">
      <Cover
        title="Have Questions?"
        subtitle="We’ve got answers. Find everything you need to know about our products, shipping, and returns."
        backgroundImage="/images/faq-background.jpg"
      />

      <div className="space-y-4 max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h1>
        {faqData.map((item, index) => (
          <div key={index} className="border rounded-lg">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 flex justify-between items-center"
            >
              {item.question}
              <span className="ml-2">{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-700 animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
