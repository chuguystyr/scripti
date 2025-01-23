import Image from "next/image"
import Form from "next/form"
import Logo from "public/Logo.png"
const ClickableLogo = () => {
  return (
    <Form action="/protected/home/0">
      <button type="submit">
        <Image src={Logo} alt="logo" className="w-50 rounded-2xl" priority />
      </button>
    </Form>
  )
}

export default ClickableLogo
