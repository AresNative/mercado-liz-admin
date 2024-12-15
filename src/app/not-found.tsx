import Link from "next/link";
export default function NotFound() {
    return (
        <div className="bg-gray-200 h-screen flex items-center">
            <section className="bg-white rounded-lg shadow-md w-fit p-2 m-auto">
                <h1 className="text-8xl text-center font-bold">404</h1>
                <h2>Not Found</h2>
                <p>
                    Could not find requested resource <Link href="/" className="text-primary-500">Return to Home</Link>
                </p>
            </section>
        </div>
    );
}