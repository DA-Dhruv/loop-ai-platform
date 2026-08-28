import Link from "next/link";
import Navbar from "../components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar title="LOOP AI" />

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
        <h1 className="text-5xl font-bold text-black mb-6">
          Welcome to LOOP AI
        </h1>

        <p className="text-xl text-gray-600 mb-8 text-center">
          AI Powered Customer Feedback Platform
        </p>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </main>
    </>
  );
}