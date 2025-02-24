import { setSchedule, editSchedule } from "server/actions/schedule"
import { useEffect, useState, useMemo, useActionState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Course from "types/Course"
import { useDebounce } from "./useDebounce"

export const useSetSchedule = (courses: Course[], isEdited: boolean) => {
  const action = isEdited ? editSchedule : setSchedule
  const router = useRouter()
  const [message, formAction, pending] = useActionState(action, null)
  const pathname = usePathname()
  const major = pathname.split("/")[3]

  const times = [
    "10:00  11:20",
    "11:50 13:10",
    "13:20  14:40",
    "16:15  17:35",
    "17:45  19:05",
  ]
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  const classOrders = ["0", "1", "2", "3", "4"]
  const generateInitialState = (days: string[], classOrders: string[]) => {
    const initialState: {
      [key: string]: { course: string; type: string; room: string }
    } = {}
    days.forEach((day) => {
      classOrders.forEach((order) => {
        initialState[`${day}${order}`] = {
          course: "",
          type: "",
          room: "",
        }
      })
    })
    return initialState
  }
  const [inputs, setInputs] = useState(generateInitialState(days, classOrders))
  const handleInputChange = (name: string, key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: {
        ...prevInputs[name],
        [key]: value,
      },
    }))
  }

  useEffect(() => {
    if (courses.length === 0)
      router.push("/protected/courses?message=no courses")
  }, [courses.length, router])

  const titles = useMemo(
    () => courses?.map((course) => course.title) || [],
    [courses],
  )
  const [currentField, setCurrentField] = useState<string>("")
  const [blurred, setBlurred] = useState<string>("")
  const handleInputFocus = (fieldName: string) => {
    setCurrentField(fieldName)
  }
  const [suggestions, setSuggestions] = useState<string[]>([])
  const currentFieldValue =
    currentField ? inputs[currentField as keyof typeof inputs]["course"] : ""
  const debouncedCurrentFieldValue = useDebounce(currentFieldValue, 500)

  useEffect(() => {
    if (titles && typeof debouncedCurrentFieldValue === "string") {
      const filteredSuggestions = titles.filter((title) =>
        title.toLowerCase().includes(debouncedCurrentFieldValue.toLowerCase()),
      )
      setSuggestions((prevSuggestions) => {
        if (
          JSON.stringify(prevSuggestions) !==
          JSON.stringify(filteredSuggestions)
        ) {
          return filteredSuggestions
        }
        return prevSuggestions
      })
    }
  }, [debouncedCurrentFieldValue, titles])

  return {
    data: {
      inputs,
      days,
      times,
      suggestions,
      currentField,
      blurred,
      major,
      message,
      pending,
      courses,
    },
    actions: { handleInputChange, handleInputFocus, setBlurred, formAction },
  }
}
