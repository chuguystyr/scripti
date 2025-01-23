"use client"
import { useSetSchedule } from "hooks/useSetSchedule"
import Course from "types/Course"
import { CourseType, Schedule } from "types/Schedule"
const SetSchedule: React.FC<{
  courses: Course[]
  schedule?: Schedule
  major: string
}> = ({ courses, major }) => {
  const {
    data: { inputs, days, times, message, pending },
    actions: { handleInputChange, handleInputFocus, setBlurred, formAction },
  } = useSetSchedule(courses)
  return (
    // TODO: Optimize for the mobile view
    <form action={formAction} className="space-y-4">
      {message && (
        <p className="p-2 bg-red-200 text-red-800 rounded-sm">{message}</p>
      )}
      <div className="flex space-x-4">
        <label htmlFor="from" className="self-center font-bold">
          From
        </label>
        <input
          name="from"
          className="input p-2 border rounded-sm"
          type="date"
          id="from"
        />
        <label htmlFor="till" className="self-center font-bold">
          Till
        </label>
        <input
          name="till"
          className="input p-2 border rounded-sm"
          type="date"
          id="till"
        />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-7 text-center border-b bg-gray-100">
            <div className="p-2 font-semibold">Time/Day</div>
            {days.map((day) => (
              <div key={day} className="p-2 font-semibold">
                {day}
              </div>
            ))}
          </div>
          <div className="divide-y">
            {times.map((_, index) => (
              <div key={index} className="grid grid-cols-7 text-center">
                <input
                  type="text"
                  className="input w-full p-2 border rounded-sm"
                  placeholder="Begin - End time"
                  name={`time${index}`}
                />
                {days.map((day) => (
                  <div key={day} className="p-2 border-l">
                    <div>
                      <select
                        name={`${day}${index}`}
                        className="input w-full p-2 border rounded-sm"
                        onChange={(e) => {
                          handleInputChange(
                            `${day}${index}`,
                            "course",
                            e.target.value,
                          )
                          handleInputChange(
                            `${day}${index}`,
                            "type",
                            CourseType.Lecture,
                          )
                        }}
                        onFocus={() => handleInputFocus(`${day}${index}`)}
                        onBlur={() => setBlurred(`${day}${index}`)}
                      >
                        <option value=""></option>
                        {courses.map((course, cIndex) => (
                          <option key={cIndex} value={course._id.toString()}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                      {inputs[`${day}${index}`].course && (
                        <div className="mt-2 space-y-2">
                          <select
                            name="type"
                            id="type"
                            className="input w-full p-2 border rounded-sm"
                            onChange={(e) =>
                              handleInputChange(
                                `${day}${index}`,
                                "type",
                                e.target.value,
                              )
                            }
                          >
                            {Object.values(CourseType).map((type, tIndex) => (
                              <option key={tIndex} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            name="room"
                            className="input w-full p-2 border rounded-sm"
                            placeholder="Room"
                            onChange={(e) =>
                              handleInputChange(
                                `${day}${index}`,
                                "room",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <input
            type="hidden"
            name="inputsData"
            value={JSON.stringify(inputs)}
          />
        </div>
      </div>
      <input
        type="text"
        hidden
        value={major}
        name="major"
        id="major"
        readOnly
      />
      <button
        type="submit"
        className="btn-filled block mx-auto"
        disabled={pending}
      >
        {pending ? "Submitting..." : "Add schedule"}
      </button>
    </form>
  )
}

export default SetSchedule
