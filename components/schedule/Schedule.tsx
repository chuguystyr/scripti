import { getSchedule } from "server/actions/schedule"
import ScheduleTable from "./ScheduleTable"
import NoScheduleBlock from "./NoScheduleBlock"

const Schedule = async () => {
  const schedule = await getSchedule()
  const times = [
    "10:00 - 11:20",
    "11:50 - 13:10",
    "13:20 - 14:40",
    "16:15 - 17:35",
    "17:45 - 19:05",
  ]
  return (
    <>
      {schedule.schedule !== null ?
        <ScheduleTable schedule={schedule} times={times} />
      : <NoScheduleBlock />}
    </>
  )
}

export default Schedule
