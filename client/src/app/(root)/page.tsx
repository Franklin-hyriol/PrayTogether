import Image from "next/image"
import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-[75rem] mx-auto my-8 flex items-center gap-16 p-8">

      <div className="flex-1">
        <h1 className="mb-3 text-6xl font-bold">Pray Together, Never Alone</h1>
        <p className="mb-5 text-gray-600">
          Step into a peaceful space where prayers are shared, hearts are lifted, and faith unites us all. Be part of a community that believes in the power of prayer.
        </p>
        <Link href="/prayer-room" className="btn btn-primary p-5.5 text-xl font-normal">Enter the Prayer Room</Link>
      </div>

      <div className="flex-1">
        <Image className="pointer-events-none" src="/images/pray_illustration.svg" alt="Hero Image" width={500} height={500} priority />
      </div>

    </section>
  );
}
