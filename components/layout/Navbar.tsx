"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type NavbarProps = {
  title: string;
};

export default function Navbar({ title }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 text-white">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex gap-6 items-center">
        <Link href="/">Home</Link>

        <Link href="/dashboard">Dashboard</Link>

        <button
          onClick={handleLogout}
          className="cursor-pointer hover:text-gray-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}