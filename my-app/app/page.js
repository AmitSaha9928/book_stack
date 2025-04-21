import Image from "next/image";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./dashboard/page";
import ProtectedRoute from "./hooks/ProtectedRoute";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-black">
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
}
