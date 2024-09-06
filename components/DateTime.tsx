"use client"
import { useDateTime } from "hooks/useDataTime"

const DateTime: React.FC = () => {
  const { time, dayMonth } = useDateTime()
  return (
    <p>
      {dayMonth} | {time}
    </p>
  )
}
export default DateTime
