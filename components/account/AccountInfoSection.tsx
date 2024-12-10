"use client"
import Modal from "components/Modal"
import EditAcountInfoForm from "components/account/EditAccountInfoForm"
import { useState } from "react"
import { FaEdit } from "react-icons/fa"
import { UserBasicInfo } from "types/User"

const AccountInfoSection: React.FC<UserBasicInfo> = ({
  name,
  username,
  email,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section>
        <h1 className="text-2xl font-bold my-4 text-center">Account info</h1>
        <div className="mx-auto card flex flex-col w-fit h-fit">
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="edit"
            className="w-fit self-end"
          >
            <FaEdit className="hover:cursor-pointer" />
          </button>
          <p>Name: {name}</p>
          <p>Username: {username}</p>
          <p>E-mail: {email}</p>
        </div>
      </section>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <EditAcountInfoForm name={name} username={username} email={email} />
        </Modal>
      )}
    </>
  )
}
export default AccountInfoSection
