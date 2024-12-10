"use client"
import ReactDOM from "react-dom"
import { FaWindowClose } from "react-icons/fa"

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaWindowClose />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
