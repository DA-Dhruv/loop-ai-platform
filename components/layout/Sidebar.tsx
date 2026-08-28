import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-blue-700 text-white p-6 flex flex-col">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          LOOP AI
        </h1>

        <p className="text-blue-200 text-sm mt-1">
          AI Feedback Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        <Link
          href="/dashboard"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/feedback"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Feedback
        </Link>

        <Link
          href="/dashboard/reports"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Reports
        </Link>

        <Link
          href="/dashboard/settings"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Settings
        </Link>

      </nav>

    </aside>
  );
}