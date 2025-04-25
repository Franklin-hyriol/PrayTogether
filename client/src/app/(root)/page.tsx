import Image from "next/image"
import Link from "next/link";
import "./Home.scss";

export default function Home() {
  return (
    <section className="hero-section">

      <div className="hero-text">
        <h1>Pray Together, Never Alone</h1>
        <p className="paragraph">
          Step into a peaceful space where prayers are shared, hearts are lifted, and faith unites us all. Be part of a community that believes in the power of prayer.
        </p>
        <Link href="/prayer-room" className="btn btn-primary">Enter the Prayer Room</Link>
      </div>

      <div className="hero-image">
        <Image src="/images/pray.jpg" alt="Hero Image" width={500} height={500} />
      </div>

    </section>
  );
}
