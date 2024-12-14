import Link from "next/link"
import { ScheduleDay } from "types/Schedule"
const ScheduleTable: React.FC<{
  schedule: ScheduleDay
  times: string[]
}> = ({ schedule, times }) => {
  return (
    <table className="border-separate border-spacing-5 border-spacing-x-10 text-center">
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
  )
}

export default ScheduleTable
