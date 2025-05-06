import Link from "next/link";
// import "./Footer.scss";

function Footer() {
    return (
        <>
            <footer className="flex justify-between items-center bg-base-300 text-base-content p-3 pl-6 pr-6">
                <p>Copyright © {new Date().getFullYear()} - Pray Together | All rights reserved</p>
                <p className="text-gray-500 hover:text-gray-800 underline">
                    <Link href="/about" className="footer-link">Site guide & data policy</Link>
                </p>
                <p className="text-gray-500 ">Designed & developed with 🖤 by <a href="#" className="hover:text-gray-800 underline" target="_blank" rel="noopener noreferrer">Franklin Hyriol</a></p>
            </footer>
        </>
    )
}

export default Footer;