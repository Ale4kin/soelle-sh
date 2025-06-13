import { MetaFunction } from "@remix-run/node";
import Contact from "../components/contact";

export default function ContactsPage() {
  return <Contact />;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Contact | Soelle Shop" },
    { name: "description", content: "Get in touch with Soelle Shop" },
  ];
};
