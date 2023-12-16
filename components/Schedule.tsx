import Schedule from "types/Schedule";
const Schedule:React.FC<Schedule> = (props) => {
  const times = [
    "10:00 - 11:20",
    "11:50 - 13:10",
    "13:20 - 14:40",
    "16:15 - 17:35",
    "17:45 - 19:05",
  ];
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
        {Object.keys(props).map((key, index) => {
          const course = props[key];
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
          );
        })}
      </tbody>
    </table>
  );
};

export default Schedule;
