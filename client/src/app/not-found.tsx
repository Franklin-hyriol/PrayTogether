import "./globals.css";
import Link from 'next/link';
import Image from "next/image";

function notFound() {
    return (
        <>
            <main className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
                <section className="text-center px-4">
                    <div className="max-w-md mx-auto">
                        <div className="mb-8">
                            <Image
                                src="/images/404.svg"
                                width={200}
                                height={200}
                                alt="404 Not Found"
                                className="mx-auto"
                            />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
                        <p className="mb-6 text-lg text-gray-500">
                            Oops! The page you are looking for does not exist or has been moved.
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Return to home page
                        </Link>
                    </div>
                </section>
            </main>
        </>
    )
}

export default notFound;