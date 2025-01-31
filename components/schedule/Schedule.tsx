import { getSchedule, getTimes } from "server/fetchers"
import ScheduleTable from "./ScheduleTable"
import NoScheduleBlock from "./NoScheduleBlock"
import { Params } from "types/Utilities"

const Schedule: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  const schedule = await getSchedule(+major)
  const times = await getTimes()
  return (
    <section className="card flex justify-center md:col-start-1 md:col-end-3 md:h-fit md:row-start-2 md:row-end-4">
      {schedule && Object.keys(schedule).length ?
        <ScheduleTable schedule={schedule} times={times} />
      : <NoScheduleBlock major={major} />}
    </section>
  )
}

export default Schedule
