import { createCookie } from "@remix-run/node";

export const cookie = createCookie("cartId", {
  httpOnly: true,
  maxAge: 60 * 60 * 24,
  path: "/",
  sameSite: "lax",
  secrets: ["s3cret1"],
  secure: process.env.NODE_ENV === "production",
});
