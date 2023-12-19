import { useEffect, useState } from "react";
import { getCourses } from "lib/serverActions";
import Course from "types/Course";
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    async function fetchCourses() {
      const courses = await getCourses();
      if (!("message" in courses)) setCourses(courses);
    }
    fetchCourses();
  }, []);
  return { courses, show, setShow };
};
