import Link from "next/link"

const NoScheduleBlock = () => {
    return (
        <p className="text-center">
          You don&apos;t have any classes set today. Happy weekend!
          <br />
          If you need to add schedule please click{" "}
          <Link
            className="font-semibold hover:underline underline-offset-4"
            href="/protected/setSchedule"
          >
            here
          </Link>
        </p>
    )
}

export default NoScheduleBlock
