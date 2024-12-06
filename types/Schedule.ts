// TODO: improve typing for Schedule possibly introducing a mongoose model
export default interface Schedule {
  [key: string]: {
    course: string
    type: string
    teacher: string
    link: string
    room: string
    lecturesLink?: string
    practicesLink?: string
    teacherLectures: string
    teacherPractices: string
  }
}
