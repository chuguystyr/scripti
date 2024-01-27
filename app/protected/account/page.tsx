import { FaEdit, FaWindowClose } from "react-icons/fa";
import SubmitButton from "components/SubmitButton";
import {
  getAccount,
  editAccount,
  changePassword,
  deleteAccount,
  logout,
  openEdit,
  closeEdit,
} from "server/actions/account";

const Account: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined };
}> = async ({ searchParams }) => {
  const { name, username, email } = await getAccount();
  return (
    <div className="grid grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold my-4 text-center">Accont info</h1>
        {searchParams?.edit ?
          <>
            <form action={closeEdit}>
              <button type="submit">
                <FaWindowClose className="self-center hover:cursor-pointer" />
              </button>
            </form>
            <form
              className="flex flex-col w-[20vw] self-center p-2 gap-4 bg-white"
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
            <form action={openEdit}>
              <button type="submit">
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
            className="flex flex-col w-[20vw] mx-auto mb-4 rounded-md p-2 gap-4 bg-white"
            action={changePassword}
          >
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
            <button type="submit" className="btn-outlined  block mx-auto">Logout</button>
          </form>
          <form action={deleteAccount}>
            <button
              className="bg-red-600 text-white block mx-auto py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-500 my-2"
              type="submit"
            >
              Delete Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
