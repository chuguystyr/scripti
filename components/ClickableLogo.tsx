import Image from "next/image"
import Form from "next/form"
import Logo from "public/Logo.png"
const ClickableLogo = () => {
  return (
    <Form action="/protected/home/0">
      <button type="submit">
        <Image
          src={Logo}
          width={512}
          height={206}
          alt="logo"
          className="w-40 h-30 rounded-xl"
          priority
        />
      </button>
    </Form>
  )
}

export default ClickableLogo
