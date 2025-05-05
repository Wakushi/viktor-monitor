"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { Blocks, ExternalLink } from "lucide-react"
import { MobulaExtendedToken } from "@/types/week-analysis.type"
import { FaMagnifyingGlass, FaTwitter } from "react-icons/fa6"
import { getBlockExplorerUrl } from "@/lib/helpers"
import clsx from "clsx"

type TokenSearchTableProps = {
  tokens: MobulaExtendedToken[]
}

export function TokenSearchTable({ tokens }: TokenSearchTableProps) {
  const [globalFilter, setGlobalFilter] = useState<string>("")

  const columns: ColumnDef<MobulaExtendedToken>[] = useMemo(
    () => [
      {
        header: "Token",
        accessorKey: "name",
        cell: ({ row }) => {
          const token = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={token.logo} alt={token.symbol} />
              </Avatar>
              <div>
                <div className="font-medium">{token.name}</div>
                <div className="text-muted-foreground text-xs">
                  {token.symbol}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        header: "Contracts",
        id: "contracts",
        cell: ({ row }) => {
          const { contracts } = row.original
          return (
            <div className="flex flex-col gap-1 text-xs">
              {contracts.map((c, i) => (
                <a
                  href={getBlockExplorerUrl(c.blockchain, c.address)}
                  target="_blank"
                  className="flex items-center gap-1 hover:underline"
                  key={c.address + i}
                >
                  <Blocks size={18} />
                  <span>{c.blockchain}</span>
                </a>
              ))}
            </div>
          )
        },
      },
      {
        header: "Website",
        id: "website",
        cell: ({ row }) => {
          const { extra } = row.original
          return extra?.website ? (
            <a
              href={extra.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Website
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )
        },
      },
      {
        header: "Twitter",
        id: "twitter",
        cell: ({ row }) => {
          const { extra } = row.original
          return extra?.twitter ? (
            <a
              href={extra.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-500 hover:underline text-sm"
            >
              <FaTwitter />
              Twitter
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )
        },
      },
      {
        header: "Decimals",
        accessorKey: "decimals",
      },
      {
        header: "Last Seen Price",
        accessorKey: "price",
        cell: ({ getValue }) => {
          const val = getValue<number>()
          return `$${val.toFixed(6)}`
        },
      },
      {
        header: "Market Cap",
        accessorKey: "market_cap",
        cell: ({ getValue }) => `$${getValue<number>().toLocaleString()}`,
      },
      {
        header: "Token ID",
        accessorKey: "token_id",
      },
    ],
    []
  )

  const table = useReactTable({
    data: tokens,
    columns,
    state: {
      globalFilter,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const token = row.original
      const val = filterValue.toLowerCase()
      return (
        token.name.toLowerCase().includes(val) ||
        token.symbol.toLowerCase().includes(val)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <FaMagnifyingGlass />
          <Input
            placeholder="Search token name or symbol..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-md min-w-[300px]"
          />
        </div>
        <span className="opacity-60">
          {table.getRowModel().rows.length} tokens found
        </span>
      </div>
      <div className="rounded border overflow-auto h-[80vh]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={clsx("", {
                  "bg-gray-700/20": index % 2 === 0,
                })}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No tokens found.
          </div>
        )}
      </div>
    </div>
  )
}
