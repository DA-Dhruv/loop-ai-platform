import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1 min-w-0">

        <Navbar title="LOOP AI Dashboard" />

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}