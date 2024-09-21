import AddCourseForm from "./AddCourseForm";

const NoCoursesBlock: React.FC<{
    searchParams?: { [key: string]: string | string[] | undefined }
}> = ({searchParams}) => {
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

export default NoCoursesBlock;
