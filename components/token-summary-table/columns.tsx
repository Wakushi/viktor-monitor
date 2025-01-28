import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Hash, ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Token } from "@/types/analysis.type"

export interface TokenStats {
  token?: Token
  occurrences: number
  averageConfidence: number
  latestPrice: string
  firstSeen: string
  lastSeen: string
}

export const columns: ColumnDef<TokenStats>[] = [
  {
    accessorKey: "token",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Token
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const token: Token | undefined = row.getValue("token")

      if (!token) return <div className="font-medium">Unknown</div>

      const twitterHandle = token.metadata.links.twitter
      const twitterUrl = twitterHandle ? `https://x.com/${twitterHandle}` : ""

      const url = token.metadata.links.website
        ? token.metadata.links.website[0]
        : ""

      return (
        <a
          href={twitterUrl || url}
          target="_blank"
          className="font-medium hover:underline"
        >
          {token.metadata.name}
        </a>
      )
    },
  },
  {
    accessorKey: "occurrences",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Occurrences
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="flex w-fit items-center gap-1">
        <Hash className="h-3 w-3" />
        {row.getValue("occurrences")}
      </Badge>
    ),
  },
  {
    accessorKey: "averageConfidence",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Avg. Confidence
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const confidence = row.getValue("averageConfidence") as number
      const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return "bg-green-500/10 text-green-500"
        if (confidence >= 70) return "bg-yellow-500/10 text-yellow-500"
        return "bg-blue-500/10 text-blue-500"
      }
      return (
        <Badge
          variant="secondary"
          className={`flex w-fit items-center gap-1 ${getConfidenceColor(
            confidence
          )}`}
        >
          <TrendingUp className="h-3 w-3" />
          {confidence.toFixed(2)}%
        </Badge>
      )
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.getValue("averageConfidence") as number
      const b = rowB.getValue("averageConfidence") as number
      return a < b ? -1 : a > b ? 1 : 0
    },
  },
  {
    accessorKey: "latestPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Latest Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono">{row.getValue("latestPrice")}</div>
    ),
  },
  {
    accessorKey: "firstSeen",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Seen
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.getValue("firstSeen")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "lastSeen",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Seen
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.getValue("lastSeen")).toLocaleDateString()}
      </div>
    ),
  },
]
