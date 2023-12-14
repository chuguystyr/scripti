"use client";
import { FC, ReactElement, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { authContext } from "./authContext";

interface ProtectorProps {
  children: ReactElement;
}

const WithProtection: FC<ProtectorProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useContext(authContext);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
};

export default WithProtection;
