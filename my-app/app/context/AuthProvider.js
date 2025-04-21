"use client";

import React, { useEffect, useState, createContext } from "react";
import Swal from "sweetalert2";
import useRequest from "../api/useRequest";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [postRequest, getRequest] = useRequest();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleLoginData = async (userCreds) => {
    try {
      setLoading(true); 
      const loginUser = await postRequest("/auth/login", userCreds);
      const userData = loginUser?.data?.data;

      localStorage.setItem("userCreds", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      Swal.fire("Credentials Don't Match");
      return null;
    } finally {
      setLoading(false); 
    }
  };

  const getUserData = () => {
    try {
      setLoading(true); 
      const getUserDetails = JSON.parse(localStorage.getItem("userCreds"));
      if (getUserDetails) {
        setUser(getUserDetails);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    return new Promise((resolve) => {
      localStorage.removeItem("userCreds");
      setUser(null);

      Swal.fire({
        title: "Logged Out",
        text: "You have been successfully logged out",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        resolve(result.isConfirmed);
      });
    });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    handleLoginData,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
