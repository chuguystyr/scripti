import "app/globals.css"

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
