"use client"
import { useSetSchedule } from "hooks/useSetSchedule"
import Course from "types/Course"
import { CourseType, DaysOfWeek, Schedule } from "types/Schedule"

const SetSchedule: React.FC<{
  courses: Course[]
  schedule?: Schedule
  major: string
}> = ({ courses, major, schedule }) => {
  const {
    data: { inputs, days, times, message, pending },
    actions: { handleInputChange, handleInputFocus, setBlurred, formAction },
  } = useSetSchedule(courses, !!schedule?._id.toString())

  // Helper to get date in yyyy-mm-dd format from ISO string
  const formatDate = (date: Date) => date.toISOString().split("T")[0]
  return (
    // TODO: Optimize for the mobile view
    // FIX: course is passed as Object, but it should be passed as string
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
          id="from"
          className="input p-2 border rounded-sm"
          type="date"
          defaultValue={
            schedule ? formatDate(schedule.from as unknown as Date) : ""
          }
        />
        <label htmlFor="till" className="self-center font-bold">
          Till
        </label>
        <input
          name="till"
          id="till"
          className="input p-2 border rounded-sm"
          type="date"
          defaultValue={
            schedule ? formatDate(schedule.till as unknown as Date) : ""
          }
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
                  defaultValue={
                    schedule && schedule.times ?
                      schedule.times[index] || ""
                    : ""
                  }
                  onChange={(e) =>
                    handleInputChange(`time${index}`, "time", e.target.value)
                  }
                />
                {days.map((day) => {
                  // Get schedule data for the given day and row index (key converted to string)
                  const daySchedule =
                    schedule &&
                    schedule[day as DaysOfWeek] &&
                    schedule[day as DaysOfWeek]?.[index.toString()]
                  const showExtra =
                    inputs[`${day}${index}`]?.course || !!daySchedule
                  return (
                    <div key={day} className="p-2 border-l">
                      <div>
                        <select
                          name={`${day}${index}`}
                          className="input w-full p-2 border rounded-sm"
                          defaultValue={
                            daySchedule ? daySchedule.course.toString() : ""
                          }
                          onChange={(e) => {
                            handleInputChange(
                              `${day}${index}`,
                              "course",
                              e.target.value,
                            )
                            // If a course is chosen, default type to Lecture
                            handleInputChange(
                              `${day}${index}`,
                              "type",
                              CourseType.Lecture,
                            )
                          }}
                          onFocus={() => handleInputFocus(`${day}${index}`)}
                          onBlur={() => setBlurred(`${day}${index}`)}
                        >
                          <option
                            value=""
                            defaultValue={
                              daySchedule ? daySchedule.course.toString() : ""
                            }
                          ></option>
                          а
                          {courses.map((course, cIndex) => (
                            <option key={cIndex} value={course._id.toString()}>
                              {course.title}
                            </option>
                          ))}
                        </select>
                        {showExtra && (
                          <div className="mt-2 space-y-2">
                            <select
                              name="type"
                              id="type"
                              className="input w-full p-2 border rounded-sm"
                              defaultValue={
                                daySchedule ?
                                  daySchedule.type
                                : CourseType.Lecture
                              }
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
                              defaultValue={daySchedule ? daySchedule.room : ""}
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
                  )
                })}
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
      <input
        type="text"
        hidden
        value={schedule ? schedule._id.toString() : ""}
        name="scheduleId"
        id="scheduleId"
        readOnly
      />
      <button
        type="submit"
        className="btn-filled block mx-auto"
        disabled={pending}
      >
        {pending ? "Submitting..." : "Save"}
      </button>
    </form>
  )
}

export default SetSchedule
