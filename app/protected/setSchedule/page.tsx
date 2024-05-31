"use client"
import SubmitButton from "components/SubmitButton"
import { useSetSchedule } from "hooks/useSetSchedule"

const SetSchedule: React.FC<{}> = () => {
  const {
    data: { inputs, days, times, suggestions, currentField, blurred },
    actions: { handleInputChange, handleInputFocus, setBlurred, formAction },
  } = useSetSchedule()

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="sr-only">Set schedule page</h1>
      <form action={formAction} className="space-y-4">
        <div className="flex space-x-4">
          <input
            name="from"
            className="input p-2 border rounded"
            placeholder={`from: ${new Date().toLocaleDateString("ua")}`}
          />
          <input
            name="to"
            className="input p-2 border rounded"
            placeholder={`to: ${new Date().toLocaleDateString("ua")}`}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <div className="grid grid-cols-7 text-center border-b bg-gray-100">
              <div className="p-2 font-semibold">Time/Day</div>
              {days.map((day) => (
                <div key={day} className="p-2 font-semibold">
                  {day}
                </div>
              ))}
            </div>
            <div className="divide-y">
              {times.map((time, index) => (
                <div key={index} className="grid grid-cols-7 text-center">
                  <div className="p-2">{time}</div>
                  {days.map((day) => (
                    <div key={day} className="p-2 border-l">
                      <div>
                        <input
                          type="text"
                          name={`${day}${index}`}
                          className="input w-full p-2 border rounded"
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
                            <ul className="absolute bg-white border rounded shadow mt-1 z-10">
                              {suggestions.map((suggestion, sIndex) => (
                                <li
                                  key={sIndex}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    handleInputChange(
                                      `${day}${index}`,
                                      "course",
                                      suggestion,
                                    )
                                  }
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          )}
                        {blurred === `${day}${index}` && (
                          <div className="mt-2 space-y-2">
                            <select
                              name="type"
                              id="type"
                              className="input w-full p-2 border rounded"
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
                              className="input w-full p-2 border rounded"
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
        <SubmitButton text="Submit" />
      </form>
    </main>
  )
}

export default SetSchedule
