"use client"
import { useLogs } from "@/hooks/use-log"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Trash2, Pause, Play } from "lucide-react"

export default function LogViewer() {
  const { logs, clearLogs } = useLogs()
  const [searchQuery, setSearchQuery] = useState("")
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [filteredLogs, setFilteredLogs] = useState<typeof logs>([])

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  useEffect(() => {
    if (searchQuery) {
      setFilteredLogs(
        logs.filter((log) =>
          log.message.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredLogs(logs)
    }
  }, [logs, searchQuery])

  const formatTimestamp = (date: Date) => {
    return `[${date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}]`
  }

  const displayLogs = searchQuery ? filteredLogs : logs

  return (
    <div className="flex flex-col w-full h-full self-stretch gap-2 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 border-muted"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setAutoScroll(!autoScroll)}
          className="border-muted"
        >
          {autoScroll ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={clearLogs}
          className="border-muted"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea
        ref={scrollRef}
        className="h-[400px] w-full rounded-md border border-muted"
      >
        <div className="p-4 space-y-1">
          {displayLogs.map((log, i) => (
            <div
              key={i}
              className="font-mono text-sm text-green-400 whitespace-pre-wrap break-all"
            >
              <span className="text-muted-foreground">
                {formatTimestamp(log.timestamp)}
              </span>{" "}
              {log.message}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
