"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthProvider";
import Loading from "../components/GobalComponents/LoadingComponent/LoadingComponent";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user && !loading) {
    return null; 
  }

  return children;
}
