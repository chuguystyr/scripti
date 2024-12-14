import { getSchedule } from "server/actions/schedule"
import ScheduleTable from "./ScheduleTable"
import NoScheduleBlock from "./NoScheduleBlock"
import { Params } from "types/Utilities"

const Schedule: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  const schedule = await getSchedule(+major)
  const times = [
    "10:00 - 11:20",
    "11:50 - 13:10",
    "13:20 - 14:40",
    "16:15 - 17:35",
    "17:45 - 19:05",
  ]
  return (
    <>
      {schedule && Object.keys(schedule).length ?
        <ScheduleTable schedule={schedule} times={times} />
      : <NoScheduleBlock major={major} />}
    </>
  )
}

export default Schedule
