import Modal from "components/Modal"
import SetSchedule from "components/schedule/SetSchedule"
import Schedule from "models/Schedule"
import dbConnect from "server/db"
import { getCourses } from "server/fetchers"
import { Schedule as ScheduleType } from "types/Schedule"

const EditScheduleModal: React.FC<{
  params: Promise<{ id: string }>
}> = async ({ params }) => {
  const { id } = await params
  await dbConnect()
  const schedule = await Schedule.findById(id, { userId: 0 })
    .lean<ScheduleType>()
    .orFail()
  const courses = await getCourses(schedule.major)
  return (
    <Modal>
      <SetSchedule
        schedule={{ ...schedule, _id: schedule._id.toString() }}
        courses={courses}
        major={schedule.major}
      />
    </Modal>
  )
}
export default EditScheduleModal
