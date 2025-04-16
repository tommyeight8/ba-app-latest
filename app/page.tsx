// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-black text-white
       flex-col"
    >
      <Image
        src="/images/ba-logo-alt.png"
        width={150}
        height={50}
        alt="Ba Logo"
        className="invert-20"
      />
      <div className="flex gap-2 mt-4">
        <Link
          href="/signup"
          className="px-2 py-0.5 border border-gray-400 rounded-md"
        >
          Signup
        </Link>
        <Link
          href="/login"
          className="px-2 py-0.5 border border-gray-400 rounded-md"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
