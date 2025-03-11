import Image from "next/image"
import Form from "next/form"
import Logo from "public/Logo.png"
const ClickableLogo: React.FC<{ major?: number }> = ({ major = 0 }) => {
  return (
    <Form action={`/protected/home/${major}`}>
      <button type="submit" className="hover:cursor-pointer">
        <Image src={Logo} alt="logo" className="w-50 rounded-2xl" priority />
      </button>
    </Form>
  )
}

export default ClickableLogo
