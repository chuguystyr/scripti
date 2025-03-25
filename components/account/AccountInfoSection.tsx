import User from "models/User"
import Link from "next/link"
import { FaEdit } from "react-icons/fa"
import dbConnect from "server/db"
import { protector } from "server/protection"

const AccountInfoSection: React.FC = async () => {
  const id = await protector()
  await dbConnect()
  const { name, username, email } = await User.findById(id).orFail()

  return (
    <section>
      <h1 className="text-2xl font-bold my-4 text-center">Account info</h1>
      <article>
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
      </article>
    </section>
  )
}
export default AccountInfoSection
