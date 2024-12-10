"use client"
import { useFormState } from "react-dom"
import { deleteAccount } from "server/actions/account"
const DeleteAccountForm = () => {
  const [message, formAction, pending] = useFormState(deleteAccount, null)
  return (
    <form action={formAction}>
      {message && <p className="text-center text-red-500">{message}</p>}
      <button
        className="bg-red-600 text-white block mx-auto py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-500 my-2"
        type="submit"
        disabled={pending}
      >
        {pending ? "Deleting..." : "Delete account"}
      </button>
    </form>
  )
}
export default DeleteAccountForm
