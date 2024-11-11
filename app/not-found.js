import Link from "next/link";
export default function NotFound() {
  return (
    <main>
      <section>
        <h1>404</h1>
        <h2>Not Found</h2>
        <p>
          Could not find requested resource <Link href="/">Return to Home</Link>
        </p>
      </section>
    </main>
  );
}
