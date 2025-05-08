import { Loader2 } from "lucide-react"

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-10">
      <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
    </div>
  )
}
