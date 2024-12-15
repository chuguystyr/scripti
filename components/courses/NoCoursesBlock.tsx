import SetCourse from "components/SetCourse"
import { Params } from "types/Utilities"

const NoCoursesBlock: React.FC<Params> = async ({ params }) => {
  const { major } = await params
  return (
    <>
      <p className="text-center">
        Looks like you&apos;re first time here.
        <br />
        Let&apos;s add some courses to use in schedule
      </p>
      <SetCourse major={major} />
    </>
  )
}

export default NoCoursesBlock
