import { getAccount } from "server/actions/account"
import { Metadata } from "next"
import AccountInfoSection from "components/account/AccountInfoSection"
import AccountActionsSection from "components/account/AccountActionsSection"

export const metadata: Metadata = {
  title: "Account | Scripti",
  description: "Access your account settings",
  robots: "noindex, nofollow",
}

const Account = async () => {
  const { name, username, email } = await getAccount()
  return (
    <main className="md:grid md:grid-cols-2">
      <AccountInfoSection name={name} username={username} email={email} />
      <AccountActionsSection />
    </main>
  )
}

export default Account
