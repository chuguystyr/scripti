"use client"
import { useActionState } from "react"
import { editAccount } from "server/actions/account"
import { UserProfileInfo } from "types/User"

const EditAccountInfoForm: React.FC<UserProfileInfo> = ({
  name,
  username,
  email,
}) => {
  const [message, formAction, pending] = useActionState(editAccount, null)
  return (
    <form
      className="mt-2 mx-auto flex flex-col w-fit p-2 gap-4 bg-white"
      action={formAction}
    >
      {message && <p className="text-red-500">{message}</p>}
      <input
        placeholder="Name"
        defaultValue={name}
        name="name"
        className="input bg-slate-300"
      />
      <input
        placeholder="Username"
        defaultValue={username}
        name="username"
        className="input bg-slate-300"
      />
      <input
        placeholder="Email"
        defaultValue={email}
        name="email"
        className="input bg-slate-300"
      />
      <button
        type="submit"
        className="btn-filled block mx-auto"
        disabled={pending}
      >
        {pending ? "Submitting..." : "Save"}
      </button>
    </form>
  )
}
export default EditAccountInfoForm
