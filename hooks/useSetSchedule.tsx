import { getCourses, setSchedule } from "lib/serverActions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Course from "types/Course";
import { useFormState } from "react-dom";
import { useDebounce } from "./useDebounce";

export const useSetSchedule = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [state, formAction] = useFormState(setSchedule, { message: "" });
  const times = [
    "10:00 - 11:20",
    "11:50 - 13:10",
    "13:20 - 14:40",
    "16:15 - 17:35",
    "17:45 - 19:05",
  ];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const classOrders = ["0", "1", "2", "3", "4"];
  const generateInitialState = (days: string[], classOrders: string[]) => {
    const initialState: {
      [key: string]: { course: string; type: string; room: string };
    } = {};
    days.forEach((day) => {
      classOrders.forEach((order) => {
        initialState[`${day}${order}`] = {
          course: "",
          type: "",
          room: "",
        };
      });
    });
    return initialState;
  };
  const [inputs, setInputs] = useState(generateInitialState(days, classOrders));
  const handleInputChange = (name: string, key: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: {
        ...prevInputs[name],
        [key]: value,
      },
    }));
  };
  useEffect(() => {
    if (state.message?.length! > 0) router.push("/protected/home");
    const getData = async () => {
      const courses = await getCourses();
      if ("message" in courses) throw new Error(courses.message);
      if (Array.isArray(courses) && courses.length === 0)
        router.push("/protected/courses?message=no courses");
      setCourses(courses);
    };
    getData();
  });
  const titles = courses?.map((course) => course.title);

  const [currentField, setCurrentField] = useState<string>("");
  const [blurred, setBlurred] = useState<string>("");
  const handleInputFocus = (fieldName: string) => {
    setCurrentField(fieldName);
  };
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const currentFieldValue =
    currentField ? inputs[currentField as keyof typeof inputs]["course"] : "";
  const debouncedCurrentFieldValue = useDebounce(currentFieldValue, 100);
  useEffect(() => {
    if (titles && debouncedCurrentFieldValue) {
      const filteredSuggestions = titles.filter((title) =>
        title.toLowerCase().includes(debouncedCurrentFieldValue.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputs, currentField, debouncedCurrentFieldValue, titles]);

  return {
    data: { inputs, days, times, suggestions, currentField, blurred },
    actions: { handleInputChange, handleInputFocus, setBlurred,  formAction },
  };
};
