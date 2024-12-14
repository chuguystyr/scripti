import { getSchedule, getTimes } from "server/actions/schedule"
import ScheduleTable from "./ScheduleTable"
import NoScheduleBlock from "./NoScheduleBlock"
import { Params } from "types/Utilities"

const Schedule: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  const schedule = await getSchedule(+major)
  const times = await getTimes()
  return (
    <>
      {schedule && Object.keys(schedule).length ?
        <ScheduleTable schedule={schedule} times={times} />
      : <NoScheduleBlock major={major} />}
    </>
  )
}

export default Schedule
