"use client";
import { FaEdit, FaWindowClose } from "react-icons/fa";
import SubmitButton from "components/SubmitButton";
import { useAccount } from "hooks/useAccount";

const Account: React.FC<{}> = () => {
  const {
    data: { name, username, email, show, edited },
    actions: { logout, deleteAccount, setShow, changeHandler, formActionInfo, formActionPassword },
  } = useAccount();
  return (
    <div className="grid grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold my-4 text-center">Accont info</h1>
        {show && edited ?
          <form
            className="flex flex-col w-[20vw] self-center p-2 gap-4 bg-white"
            action={formActionInfo}
          >
            <button type="button" onClick={() => setShow((prev) => !prev)}>
              <FaWindowClose className="self-center hover:cursor-pointer" />
            </button>
            <input
              placeholder="Name"
              value={edited.name}
              name="name"
              className="input bg-slate-300"
              onChange={() => changeHandler("name")}
            />
            <input
              placeholder="Username"
              value={edited.username}
              name="username"
              className="input bg-slate-300"
              onChange={() => changeHandler("username")
              }
            />
            <input
              placeholder="Email"
              value={edited.email}
              name="email"
              className="input bg-slate-300"
              onChange={() => changeHandler("email")}
            />
            <SubmitButton text="Save" />
          </form>
        : <div className="mx-auto card flex flex-col w-fit">
            <FaEdit
              className="self-end hover:cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
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
            action={formActionPassword}
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
          <button className="btn-outlined  block mx-auto" onClick={logout}>
            Logout
          </button>
          <button
            className="bg-red-600 text-white block mx-auto py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-500 my-2"
            onClick={deleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
