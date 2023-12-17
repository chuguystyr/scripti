import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { getAccount } from "lib/serverActions";
import {
  logout,
  deleteAccount,
  editAccount,
  changePassword,
} from "lib/serverActions";
export const useAccount = () => {
  const [accountInfo, setAccountInfo] = useState<{
    email: string;
    username: string;
    name: string;
  } | null>(null);
  const [edited, setEdited] = useState<{
    email: string;
    username: string;
    name: string;
  } | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [stateInfo, formActionInfo] = useFormState(editAccount, {
    message: "",
  });
  const [statePassword, formActionPassword] = useFormState(changePassword, {
    message: "",
  });
  const changeHandler = (field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setEdited((prev) => ({ ...prev!, [field]: e.target.value }));
    };
  };
  useEffect(() => {
    const getAccountInfo = async () => {
      const response = await getAccount();
      if (!("message" in response)) {
        setAccountInfo(response);
        setEdited(response);
      }
    };
    getAccountInfo();
  }, [stateInfo.message]);
  useEffect(() => {
    if (stateInfo.message === "Account info changed") {
      setShow(false);
    }
  }, [stateInfo.message]);
  const { email, username, name } = accountInfo || {};
  return {
    data: { email, username, name, show, edited },
    actions: { logout, deleteAccount, setShow, changeHandler, formActionInfo, formActionPassword },
  };
};
