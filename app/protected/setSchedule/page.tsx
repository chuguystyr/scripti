"use client"
import SubmitButton from "components/SubmitButton"
import { useSetSchedule } from "hooks/useSetSchedule"
const SetSchedule: React.FC<{}> = () => {
  const {
    data: { inputs, days, times, suggestions, currentField, blurred },
    actions: { handleInputChange, handleInputFocus, setBlurred, formAction },
  } = useSetSchedule()
  return (
    <main>
      <h1 className="sr-only">Set schedule page</h1>
      <form action={formAction}>
        <input name="from" className="input" placeholder="from: 30.10.2023" />
        <input name="to" className="input ml-5" placeholder="to: 10.11.2023" />
        <table className="mx-auto border-separate border-spacing-x-2 border-spacing-y-4">
          <thead>
            <tr>
              <th>Time/Day</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thirsday</th>
              <th>Friday</th>
              <th>Saturdy</th>
            </tr>
          </thead>
          <tbody>
            {
              <TableRows
                days={days}
                times={times}
                suggestions={suggestions}
                handleInputChange={handleInputChange}
                handleInputFocus={handleInputFocus}
                currentField={currentField}
                blurred={blurred}
                setBlurred={setBlurred}
              />
            }
            <input
              type="hidden"
              name="inputsData"
              value={JSON.stringify(inputs)}
            />
          </tbody>
        </table>
        <SubmitButton text="Submit" />
      </form>
    </main>
  )
}

export default SetSchedule

const TableRows = ({
  days,
  times,
  suggestions,
  handleInputChange,
  handleInputFocus,
  currentField,
  blurred,
  setBlurred,
}: {
  days: string[]
  times: string[]
  suggestions: string[]
  handleInputChange: Function
  handleInputFocus: Function
  currentField: string
  blurred: string
  setBlurred: Function
}) => {
  return times.map((time, index) => {
    return (
      <tr key={index}>
        <td>{time}</td>
        {days.map((day) => {
          return (
            <td key={day}>
              <div className="relative">
                <input
                  type="text"
                  name={`${day}${index}`}
                  className="input w-[100%]"
                  placeholder="Type to search courses..."
                  onChange={(e) =>
                    handleInputChange(
                      `${day}${index}`,
                      "course",
                      e.target.value,
                    )
                  }
                  onFocus={() => handleInputFocus(`${day}${index}`)}
                  onBlur={() => setBlurred(`${day}${index}`)}
                />
                {currentField === `${day}${index}` &&
                  blurred !== `${day}${index}` &&
                  suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white shadow-md mt-1 w-full rounded-md">
                      {suggestions.map((suggestion, sIndex) => (
                        <li
                          key={sIndex}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                {blurred === `${day}${index}` && (
                  <div className="absolute z-10 bg-white shadow-md mt-1 w-full rounded-md">
                    <select
                      name="type"
                      id="type"
                      className="input"
                      onChange={(e) =>
                        handleInputChange(
                          `${day}${index}`,
                          "type",
                          e.target.value,
                        )
                      }
                    >
                      <option value="lecture">Lecture</option>
                      <option value="practice">Practice</option>
                    </select>
                    <input
                      type="text"
                      name="room"
                      className="input"
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
            </td>
          )
        })}
      </tr>
    )
  })
}
