import { getCourses } from "server/actions/courses"
import { setSchedule } from "server/actions/schedule"
import { useEffect, useState, useMemo, useActionState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Course from "types/Course"
import { useDebounce } from "./useDebounce"

export const useSetSchedule = () => {
  const router = useRouter()
  const [state, formAction] = useActionState(setSchedule, { error: "" })
  const [courses, setCourses] = useState<Course[] | null>(null)
  const pathname = usePathname()
  const major = pathname.split("/").at(3)!

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    if (state.error?.length! > 0) {
      router.push("/protected/home")
    }
  }, [state.error, router])

  useEffect(() => {
    if (Array.isArray(courses) && courses.length === 0) {
      router.push("/protected/courses?message=no courses")
    }
  }, [courses, router])

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
    const getData = async () => {
      const courses = await getCourses(+major)
      if ("message" in courses) throw new Error(courses.message)
      setCourses(courses)
    }
    getData()
  }, [major])

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
    data: { inputs, days, times, suggestions, currentField, blurred },
    actions: { handleInputChange, handleInputFocus, setBlurred, formAction },
  }
}
