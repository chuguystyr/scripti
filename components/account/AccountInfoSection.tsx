import Link from "next/link"
import { FaEdit } from "react-icons/fa"
import { UserProfileInfo } from "types/User"

const AccountInfoSection: React.FC<UserProfileInfo> = async ({
  name,
  username,
  email,
}) => {
  return (
    <section>
      <h1 className="text-2xl font-bold my-4 text-center">Account info</h1>
      <div className="mx-auto card flex flex-col w-fit h-fit">
        <Link
          href="/protected/account/edit"
          aria-label="edit"
          className="w-fit self-end"
          scroll={false}
        >
          <FaEdit className="hover:cursor-pointer" />
        </Link>
        <p>Name: {name}</p>
        <p>Username: {username}</p>
        <p>E-mail: {email}</p>
      </div>
    </section>
  )
}
export default AccountInfoSection
