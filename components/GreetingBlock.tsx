import DateTime from "components/DateTime"
import Name from "components/Name"

const GreetingBlock = () => {
  return (
    <section className="card md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2">
      <Name />
      <DateTime />
    </section>
  )
}
export default GreetingBlock
