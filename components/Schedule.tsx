import Link from "next/link"
import { getSchedule } from "server/actions/schedule"

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
            {Object.keys(schedule).map((key, index) => {
              const course = schedule[key]
              return (
                <tr key={index} className="hover:bg-black hover:text-white">
                  <td className="rounded-md">{times[Number(key)]}</td>
                  <td className="rounded-md">{course.course}</td>
                  <td className="rounded-md">
                    {course.type === "lecture" ?
                      course.lecturesLink
                    : course.practicesLink}
                  </td>
                  <td className="rounded-md">{course.room}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      : <p className="text-center">
          You don&apos;t have any classes set today. Happy weekend!
          <br />
          If you need to add schedule please click{" "}
          <Link
            className="font-semibold hover:underline underline-offset-4"
            href="/protected/setSchedule"
          >
            here
          </Link>
        </p>
      }
    </>
  )
}

export default Schedule
