import Illustration from "@/components/Illustration/Illustration";
import Link from "next/link";

export default function Home() {
  return (
    <section className="max-w-[75rem] mx-auto sm:my-8 flex sm:flex-row flex-col-reverse items-center gap-8 md:gap-16 sm:p-8 p-4">

      <div className="flex-1">
        <h1 className="mb-3 sm:text-6xl text-4xl font-bold">Pray Together, <br /> Never Alone</h1>
        <p className="mb-5 text-base-content">
          Step into a peaceful space where prayers are shared, hearts are lifted, and faith unites us all. Be part of a community that believes in the power of prayer.
        </p>
        <Link href="/prayer-room" className="btn btn-primary p-5.5 text-xl font-normal">Enter the Prayer Room</Link>
      </div>

      <div className="flex-1 w-full max-w-[350px] max-h-[350px] sm:max-w-[500px] sm:max-h-[500px]">
        <Illustration />
      </div>

    </section>
  );
}
