import { FaEdit, FaWindowClose } from "react-icons/fa"
import SubmitButton from "components/SubmitButton"
import {
  getAccount,
  editAccount,
  changePassword,
  deleteAccount,
  logout,
  openEdit,
  closeEdit,
} from "server/actions/account"
import { Metadata } from "next"
import { BasicPageProps } from "types/Utilities"

export const metadata: Metadata = {
  title: "Account | Scripti",
  description: "Access your account settings",
  robots: "noindex, nofollow",
}

const Account: React.FC<BasicPageProps> = async (props) => {
  const searchParams = await props.searchParams
  const { name, username, email } = await getAccount()
  let message = null
  switch (searchParams?.error) {
    case "no-match":
      message = "Invalid old password"
      break
    case "password":
      message =
        "Password must have 8-20 characters, including an uppercase letter, a lowercase letter, a digit, and a special character."
      break
    case "missing-fields":
      message = "Please fill all required fields"
      break
    case "internal":
      message = "Someting went wrong. Please try again later"
      break
  }
  return (
    <main className="md:grid md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold my-4 text-center">Account info</h1>
        {searchParams?.edit ?
          <>
            <form action={closeEdit} className="flex justify-center">
              <button type="submit">
                <FaWindowClose className="hover:cursor-pointer" />
              </button>
            </form>
            <form
              className="mt-2 mx-auto flex flex-col w-[20vw] p-2 gap-4 bg-white"
              action={editAccount}
            >
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
              <SubmitButton text="Save" />
            </form>
          </>
        : <div className="mx-auto card flex flex-col w-fit">
            <form action={openEdit} className="flex justify-end">
              <button type="submit" aria-label="edit">
                <FaEdit className="self-end hover:cursor-pointer" />
              </button>
            </form>
            <p>Name: {name}</p>
            <p>Username: {username}</p>
            <p>E-mail: {email}</p>
          </div>
        }
      </div>
      <div>
        <h1 className="text-2xl font-bold my-4 text-center">Account Actions</h1>
        <div className="mx-auto">
          <form
            className="flex flex-col w-fit mx-auto mb-4 rounded-md p-2 gap-4 bg-white"
            action={changePassword}
          >
            {searchParams?.status === "password-changed" && (
              <p className="text-center w-[15vw] block mx-auto text-green-500">
                Password&apos;s been changed successfully
              </p>
            )}
            {message && (
              <p className="text-center w-[15vw] block mx-auto text-red-500">
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
            <SubmitButton text="Change" />
          </form>
          <form action={logout}>
            <button type="submit" className="btn-outlined  block mx-auto">
              Log out
            </button>
          </form>
          <form action={deleteAccount}>
            {searchParams?.error === "not-deleted" && (
              <p className="text-center text-red-500">
                Account not deleted. Something went wrong
              </p>
            )}
            <button
              className="bg-red-600 text-white block mx-auto py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-500 my-2"
              type="submit"
            >
              Delete account
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Account
