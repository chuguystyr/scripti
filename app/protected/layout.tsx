import WithProtection from "utils/WithProtection"

const ProtectedLayout: React.FC<{
  children: React.JSX.Element
  modal: React.JSX.Element
}> = ({ children, modal }) => {
  return (
    <WithProtection>
      <div className="px-5 md:px-10 py-5">
        {modal}
        {children}
      </div>
    </WithProtection>
  )
}

export default ProtectedLayout
