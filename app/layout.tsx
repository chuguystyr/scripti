export const metadata = {
  title: "Scripti",
  description: "The best way to manage your studies",
};

import "app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
