import { logout } from "server/actions/account"

const LogOutForm: React.FC = () => {
  return (
    <form action={logout}>
      <button type="submit" className="btn-outlined  block mx-auto">
        Log out
      </button>
    </form>
  )
}
export default LogOutForm
