import { SearchParams } from "types/Utilities"
import AddCourseForm from "./AddCourseForm"

const NoCoursesBlock: React.FC<SearchParams> = async ({searchParams: props}) => {
  const searchParams = await props
  return (
    <>
      {!searchParams?.add && (
        <>
          <p className="text-center">
            Looks like you&apos;re first time here.
            <br />
            Let&apos;s add some courses to use in schedule
          </p>
          <AddCourseForm />
        </>
      )}
    </>
  )
}

export default NoCoursesBlock
