import Course from "types/Course"
import Task from "types/Task"
import Schedule from "types/Schedule"

export default interface IUser {
  name: string
  username: string
  email: string
  password: string
  courses?: Course[]
  schedules?: Schedule[]
  tasks?: Task[]
}
