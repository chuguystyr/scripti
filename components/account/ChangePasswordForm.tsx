"use client"
import { useActionState } from "react"
import { changePassword } from "server/actions/account"
import { SuccessMessages } from "types/Utilities"
const ChangePasswordForm = () => {
  const [message, formAction, pending] = useActionState(changePassword, null)
  return (
    <form
      className="flex flex-col w-fit mx-auto mb-4 rounded-md p-2 gap-4 bg-white"
      action={formAction}
    >
      {message && (
        <p
          className={`text-center w-[15vw] block mx-auto text-${message === SuccessMessages.PASSWORD_CHANGED ? "green" : "red"}-500`}
        >
          {message}
        </p>
      )}
      <input
        className="input bg-slate-300"
        placeholder="Old Password"
        name="oldPassword"
        type="password"
      />
      <input
        className="input bg-slate-300"
        placeholder="New Password"
        name="newPassword"
        type="password"
      />
      <button
        type="submit"
        className="btn-filled block mx-auto"
        disabled={pending}
      >
        {pending ? "Submitting..." : "Change"}
      </button>
    </form>
  )
}
export default ChangePasswordForm
