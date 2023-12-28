import { ReactElement } from "react";
import { cookies } from "next/headers";

const WithProtection: React.FC<{ children: ReactElement }> = ({ children }) => {
  const isAuthenticated = cookies().get("_scrpt")?.value;
  if (!isAuthenticated) {
    throw new Error("Unauthorized");
  }
  return <>{children}</>;
};

export default WithProtection;
