export const metadata = {
  title: "Scripti",
  description: "The best way to manage your studies",
};

import "app/globals.css";
import { AuthProvider } from "utils/authContext";
import { Suspense } from "react";
import Loader from "app/loading";

export default function RootLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
