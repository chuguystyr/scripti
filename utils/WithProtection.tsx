import { ReactElement } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const WithProtection: React.FC<{ children: ReactElement }> = ({ children }) => {
  const isAuthenticated = cookies().get("_scrpt")?.value;
  if (!isAuthenticated) {
    redirect("/login");
  }
  return <>{children}</>;
};

export default WithProtection;
