import Link from "next/link";
import "./Footer.scss";

function Footer() {
    return (
        <footer className="footer-single">
            <p className="paragraph">© {new Date().getFullYear()} Pray Together | All rights reserved</p>
            <p className="paragraph">
                <Link href="/about" className="footer-link">Site guide & data policy</Link>
            </p>
            <p className="paragraph">Designed & developed with ❤️ by <a href="#" target="_blank" rel="noopener noreferrer">Franklin Hyriol</a></p>
        </footer>
    )
}

export default Footer;