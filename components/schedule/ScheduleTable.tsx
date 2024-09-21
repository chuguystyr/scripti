import Schedule from "types/Schedule"
const ScheduleTable: React.FC<{
    schedule: Schedule
    times: string[]
}> = ({schedule, times}) => {
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
    )
}

export default ScheduleTable
