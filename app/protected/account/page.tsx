import { Metadata } from "next"
import AccountInfoSection from "components/account/AccountInfoSection"
import AccountActionsSection from "components/account/AccountActionsSection"
import { protector } from "server/protection"
import User from "models/User"

export const metadata: Metadata = {
  title: "Account | Scripti",
  description: "Access your account settings",
  robots: "noindex, nofollow",
}

const Account = async () => {
  const id = await protector()
  const { name, username, email } = await User.findProfileDetailsById(id)
  return (
    <main className="md:grid md:grid-cols-2">
      <AccountInfoSection name={name} username={username} email={email} />
      <AccountActionsSection />
    </main>
  )
}

export default Account
