"use client";
import { useAppSelector } from "@/store/hooks/hooks";
import { useEffect, useState } from "react";

export function UserRoleRenderer({ user, admin, dev, fallback }) {
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [error, setError] = useState(null);
  const userState =
    "user"; /* useAppSelector((state) => state.authReducer.user); */

  const fetchUserRole = async () => {
    setLoadingRole(true);
    try {
      setRole(userState);
    } catch (error) {
      setRole(null);
      setError(error.message || "Error fetching user role");
    } finally {
      setLoadingRole(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [userState]);

  if (loadingRole) {
    return <main></main>;
  }

  if (role === "admin") {
    return admin;
  } else if (role === "user") {
    return user;
  } else if (role === "dev") {
    return dev;
  } else if (userState === "none") {
    return fallback;
  } else {
    return fallback;
  }
}
