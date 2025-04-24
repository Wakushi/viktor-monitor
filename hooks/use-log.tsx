import { useEffect, useState } from "react"
import { io } from "socket.io-client"

interface LogEntry {
  message: string
  timestamp: Date
}

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  function clearLogs() {
    setLogs([])
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL)

    socket.on("log", (msg: string) => {
      setLogs((prev) => [...prev, { message: msg, timestamp: new Date() }])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return { logs, clearLogs }
}
