"use client"
import Modal from "components/Modal"
import { useState } from "react"
import { useActionState } from "react"
import { changePassword } from "server/actions/account"
const ChangePasswordForm = () => {
  const [message, formAction, pending] = useActionState(changePassword, null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn-outlined block mx-auto mb-2"
      >
        Change Password
      </button>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form
            className="flex flex-col w-fit mx-auto mb-4 rounded-md p-2 gap-4 bg-white"
            action={formAction}
          >
            {message && (
              <p
                className={`text-center w-[15vw] block mx-auto text-${message === "Password hase been changed successfully" ? "green" : "red"}-500`}
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
        </Modal>
      )}
    </>
  )
}
export default ChangePasswordForm
