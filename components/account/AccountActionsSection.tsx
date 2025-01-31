import ChangePasswordForm from "components/account/ChangePasswordForm"
import DeleteAccountForm from "components/account/DeleteAccountForm"
import LogOutForm from "./LogOutForm"

const AccountActionsSection = () => {
  return (
    <section className="mx-auto">
      <h1 className="text-2xl font-bold my-4 text-center">Account Actions</h1>
      <ChangePasswordForm />
      <LogOutForm />
      <DeleteAccountForm />
    </section>
  )
}
export default AccountActionsSection
