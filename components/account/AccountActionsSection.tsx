import { logout } from "server/actions/account"
import ChangePasswordForm from "components/account/ChangePasswordForm"
import DeleteAccountForm from "components/account/DeleteAccountForm"

const AccountActionsSection = () => {
  return (
    <section>
      <h1 className="text-2xl font-bold my-4 text-center">Account Actions</h1>
      <div className="mx-auto">
        <ChangePasswordForm />
        <form action={logout}>
          <button type="submit" className="btn-outlined  block mx-auto">
            Log out
          </button>
        </form>
        <DeleteAccountForm />
      </div>
    </section>
  )
}
export default AccountActionsSection
