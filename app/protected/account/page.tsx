import { Metadata } from "next"
import AccountInfoSection from "components/account/AccountInfoSection"
import AccountActionsSection from "components/account/AccountActionsSection"
import ClickableLogo from "components/ClickableLogo"
import MajorsSection from "components/account/MajorsSection"

export const metadata: Metadata = {
  title: "Account | Scripti",
  description: "Access your account settings",
  robots: "noindex, nofollow",
}

const Account = () => {
  return (
    <main className="flex flex-col">
      <ClickableLogo />
      <AccountInfoSection />
      <MajorsSection />
      <AccountActionsSection />
    </main>
  )
}

export default Account
