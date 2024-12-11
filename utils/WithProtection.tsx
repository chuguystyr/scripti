import { ReactElement } from "react"
import { protector } from "server/protection"
const WithProtection: React.FC<{ children: ReactElement }> = async ({
  children,
}) => {
  await protector()
  return <>{children}</>
}

export default WithProtection
