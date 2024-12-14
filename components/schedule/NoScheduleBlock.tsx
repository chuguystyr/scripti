import Link from "next/link"

const NoScheduleBlock: React.FC<{ major: string }> = ({ major }) => {
  return (
    <p className="text-center">
      You don&apos;t have any classes set today. Happy weekend!
      <br />
      If you need to add schedule please click{" "}
      <Link
        className="font-semibold hover:underline underline-offset-4"
        href={`/protected/setSchedule/${major}`}
      >
        here
      </Link>
    </p>
  )
}

export default NoScheduleBlock
