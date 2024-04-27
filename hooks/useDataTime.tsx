import { useState, useEffect } from "react"

export const useDateTime = () => {
  const initialTime = new Date().toLocaleTimeString("en-GB", {
    timeStyle: "short",
  })
  const [time, setTime] = useState(initialTime)
  const dayMonth = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  useEffect(() => {
    const timer = setInterval(
      () =>
        setTime(new Date().toLocaleTimeString("en-GB", { timeStyle: "short" })),
      1000,
    )
    return function cleanup() {
      clearInterval(timer)
    }
  }, [])
  return { time, dayMonth }
}
