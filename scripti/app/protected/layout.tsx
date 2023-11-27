import WithProtection from "@/utils/WithProtection"
import Navigation from "@/components/Navigation"

export default function AppLayout({
    children,
  }: {
    children: React.JSX.Element;
  }) {
    return (
             <WithProtection>
                <div className='px-5 md:px-10 py-5'>
                {children.type.displayName !== 'SetSchedule' ? <Navigation /> : <></>}
                {children}
                </div>
             </WithProtection>
    )
  }