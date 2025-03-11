import EditLink from "components/EditLink"
import Link from "next/link"
import { ScheduleDay } from "types/Schedule"
const ScheduleTable: React.FC<{
  schedule: ScheduleDay
  times: string[]
}> = ({ schedule, times }) => {
  return (
    <>
      <div className="flex justify-center gap-5">
        <h2 className="text-xl font-semibold text-center">Schedule </h2>
        <EditLink itemType="schedule" _id={schedule._id.toString()} />
      </div>
      <table className="border-separate border-spacing-3 text-center">
        <thead>
          <tr>
            <th>Time</th>
            <th>Course</th>
            <th>Link</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(schedule).map((key) => {
            if (key === "_id") return
            const item = schedule[key]
            return (
              <tr key={key} className="hover:underline">
                <td className="rounded-md">{times[Number(key)]}</td>
                <td className="rounded-md">{item.course as string}</td>
                <td className="rounded-md">
                  <Link
                    href={item.link || ""}
                    className="text-blue-400 hover:text-blue-800"
                  >
                    click
                  </Link>
                </td>
                <td className="rounded-md">{item.room}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default ScheduleTable
