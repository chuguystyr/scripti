import "app/globals.css"
import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://scripti-app.vercel.app/"),
}

const RootLayout: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
