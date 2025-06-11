import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";

export default function ErrorPage({
  title = "",
  message = "",
}: {
  title?: string;
  message?: string;
}) {
  const error = useRouteError();
  console.error("App Error:", error);

  if (isRouteErrorResponse(error)) {
    title = `Oops! ${error.status} ${error.statusText}`;
    message = error.data?.message || message;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-red-600 mb-4">{title}</h1>
      <p className="text-gray-700 mb-6">{message}</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}
