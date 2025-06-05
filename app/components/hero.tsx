// app/components/Hero.tsx
import { Link } from "@remix-run/react";

export default function Hero() {
  return (
    <section
      style={{
        backgroundImage: `url('/images/hero-background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "70vh",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Timeless Style</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Discover new arrivals that fit your lifestyle.
      </p>
      <Link
        to="/collections/new-arrivals"
        style={{
          background: "white",
          color: "black",
          padding: "10px 20px",
          borderRadius: "5px",
          textDecoration: "none",
        }}
      >
        Shop Now
      </Link>
    </section>
  );
}
