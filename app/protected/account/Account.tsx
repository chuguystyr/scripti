"use client";
import { useContext, useState } from "react";
import { authContext } from "utils/authContext";
import { FaEdit, FaWindowClose } from "react-icons/fa";
import {
  editAccount,
  changePassword,
  logout,
  deleteAccount,
} from "utils/serverActions";
import { useFormState } from "react-dom";

const Account = ({ data }: { data: any }) => {
  console.log(data);
  const { setAuthenticated } = useContext(authContext);
  const [show, setShow] = useState(false);
  const [edited, setEdited] = useState(data);
  const [stateInfo, formActionInfo] = useFormState(editAccount, {
    message: "",
  });
  const [statePassword, formActionPassword] = useFormState(changePassword, {
    message: "",
  });
  return (
    <div className="grid grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold my-4 text-center">Accont info</h1>
        {show ?
          <form
            className="flex flex-col w-[20vw] self-center p-2 gap-4 bg-white"
            action={formActionInfo}
          >
            <FaWindowClose className="self-center hover:cursor-pointer" />
            <input
              placeholder="Name"
              value={edited.name}
              name="name"
              className="input bg-slate-300"
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
            />
            <input
              placeholder="Username"
              value={edited.username}
              name="username"
              className="input bg-slate-300"
              onChange={(e) =>
                setEdited({ ...edited, username: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={edited.email}
              name="email"
              className="input bg-slate-300"
              onChange={(e) => setEdited({ ...edited, email: e.target.value })}
            />
            <button type="submit" className="btn-filled">
              Save
            </button>
          </form>
        : <div className="mx-auto card flex flex-col w-fit">
            <FaEdit
              className="self-end hover:cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
            <p>Name: {data.name}</p>
            <p>Username: {data.username}</p>
            <p>E-mail: {data.email}</p>
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
            <button className="btn-filled">Change</button>
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
