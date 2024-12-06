import Navigation from "components/Navigation"
import { Params } from "types/Utilities"
const MavigatableLayout: React.FC<{
    children: React.ReactElement
} & Params> = ({children, params}) => {
    return (
        <>
        <Navigation params={params}/>
        {children}
        </>
    )
}
export default MavigatableLayout
