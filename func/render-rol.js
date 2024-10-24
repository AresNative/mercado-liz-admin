"use client";
import { useAppSelector } from "@/store/hooks/hooks";
import { useEffect, useState } from "react";

export function UserRoleRenderer({ user, admin, dev, fallback }) {
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [error, setError] = useState(null);
  const userState =
    "dev"; /* useAppSelector((state) => state.authReducer.user); */

  const fetchUserRole = async () => {
    setLoadingRole(true);
    try {
      setRole("dev");
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
    return (
      <main>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          cargando...
        </div>
      </main>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
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
