"use client"
// TODO: may be replaced with introduction of stable React 19 in Next 15 and turning all forms into client-side components
import { useFormStatus } from "react-dom"

const SubmitButton: React.FC<{ text: string }> = ({ text }) => {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="btn-filled block mx-auto"
      disabled={pending}
    >
      {pending ? "Submitting..." : text}
    </button>
  )
}

export default SubmitButton
