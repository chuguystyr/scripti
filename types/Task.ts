export default interface Task {
  _id: string | number | readonly string[] | undefined
  userId: string
  title: string
  deadline: Date
  course: string
  status: string
  description: string
}
