import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl p-10 rounded-xl shadow-md text-center">
        <h1 className="text-4xl font-bold text-black mb-4">
          LOOP AI
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Feedback Management and Analytics Platform
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/demo-admin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto min-w-[150px]"
          >
            Review Data
          </Link>

          <Link
            href="/demo"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto min-w-[150px]"
          >
            Try Demo
          </Link>

          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto min-w-[150px]"
          >
            Sign In
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Review the live project data or explore the interactive demo.
        </p>
      </div>
    </main>
  );
}