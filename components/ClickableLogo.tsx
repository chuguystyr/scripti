import Image from "next/image"
import Form from "next/form"
import Logo from "public/Logo.png"
const ClickableLogo: React.FC<{ major: number }> = ({ major }) => {
  return (
    <Form action={`/protected/home/${major}`}>
      <button type="submit">
        <Image src={Logo} alt="logo" className="w-50 rounded-2xl" priority />
      </button>
    </Form>
  )
}

export default ClickableLogo
