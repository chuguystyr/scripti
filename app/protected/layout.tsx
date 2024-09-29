import WithProtection from "utils/WithProtection"
import Navigation from "components/Navigation"

const ProtectedLayout: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  return (
    <WithProtection>
      <div className="px-5 md:px-10 py-5">
        {children.type.displayName !== "SetSchedule" ?
          <Navigation />
        : <></>}
        {children}
      </div>
    </WithProtection>
  )
}

export default ProtectedLayout
