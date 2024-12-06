import WithProtection from "utils/WithProtection"

const ProtectedLayout: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  return (
    <WithProtection>
      <div className="px-5 md:px-10 py-5">
        {children}
      </div>
    </WithProtection>
  )
}

export default ProtectedLayout
