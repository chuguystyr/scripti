"use client"
import { FaWindowClose } from "react-icons/fa"
import { useRouter } from "next/navigation"

const Modal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="relative bg-white p-6 mx-2 rounded-lg shadow-lg">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => router.back()}
        >
          <FaWindowClose />
        </button>
        {children}
      </div>
    </div>
  )
}
export default Modal
