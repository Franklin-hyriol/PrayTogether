import Link from "next/link";

function Footer() {
    return (
        <>
            <footer className="flex sm:flex-row flex-col justify-between items-center bg-base-300 p-3 pl-6 pr-6 text-base-content text-center sm:text-left gap-2">
                <p className="sm:order-1 order-2">Copyright © {new Date().getFullYear()} - Pray Together | All rights reserved</p>
                <p className="sm:order-2 order-1 underline">
                    <Link href="/site-guide" className="footer-link">User Guide & data policy</Link>
                </p>
                <p className="sm:order-3 order-3">Designed & developed with ❤ by <a href="https://www.linkedin.com/in/franklin-hyriol-razafinandrasana-4b9a71217/" className="hover:text-base-content underline" target="_blank" rel="noopener noreferrer">Franklin Hyriol</a></p>
            </footer>
        </>
    )
}

export default Footer;