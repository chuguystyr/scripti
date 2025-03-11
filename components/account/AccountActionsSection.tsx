import DeleteAccountForm from "components/account/DeleteAccountForm"
import LogOutForm from "./LogOutForm"
import Link from "next/link"

const AccountActionsSection = () => {
  return (
    <section className="mx-auto">
      <h1 className="text-2xl font-bold my-4 text-center">Account Actions</h1>
      <Link
        href="/protected/account/changePassword"
        className="btn-outlined block mx-auto mb-2 text-center w-fit"
        scroll={false}
      >
        Change Password
      </Link>
      <LogOutForm />
      <DeleteAccountForm />
    </section>
  )
}
export default AccountActionsSection
