import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type HideOn = "lg" | "md" | "sm"

export interface RecordColumn<T> {
  id: string
  header: string
  className?: string
  hideOn?: HideOn
  render: (item: T) => React.ReactNode
}

interface RecordsOverviewProps<T> {
  title: string
  description: string
  items: T[]
  getRowId: (item: T) => string
  columns: RecordColumn<T>[]
  mobileCard: (item: T) => React.ReactNode
  searchFields?: (item: T) => string[]
  searchPlaceholder?: string
  filterActions?: React.ReactNode
  emptyMessage?: string
  paginated?: boolean
  pageSize?: number
}

const hideMap: Record<HideOn, string> = {
  lg: "hidden lg:table-cell",
  md: "hidden md:table-cell",
  sm: "hidden sm:table-cell",
}

export function RecordsOverview<T>({
  title,
  description,
  items,
  getRowId,
  columns,
  mobileCard,
  searchFields,
  searchPlaceholder = "Search...",
  filterActions,
  emptyMessage = "No records found",
  paginated = false,
  pageSize = 10,
}: RecordsOverviewProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredItems = useMemo(() => {
    if (!searchFields || searchTerm.trim() === "") {
      return items
    }

    const term = searchTerm.toLowerCase()
    return items.filter((item) =>
      searchFields(item).some((field) =>
        field.toLowerCase().includes(term)
      )
    )
  }, [items, searchFields, searchTerm])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, items.length])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedItems = useMemo(() => {
    if (!paginated) {
      return filteredItems
    }
    const start = (safeCurrentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, pageSize, paginated, safeCurrentPage])

  return (
    <Card>
      <div className="border-b border-gray-700 p-3 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-bold">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          {description}
        </p>
      </div>

      <div className="border-b border-gray-700 p-3 sm:p-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 flex-shrink-0" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-10 pr-3 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-blue-500 h-8 sm:h-9"
          />
        </div>
        {filterActions && (
          <div className="flex gap-2 flex-shrink-0">{filterActions}</div>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={`text-xs sm:text-sm ${column.className || ""} ${
                      column.hideOn ? hideMap[column.hideOn] : ""
                    }`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <TableRow key={getRowId(item)}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={`text-xs sm:text-sm ${column.className || ""} ${
                          column.hideOn ? hideMap[column.hideOn] : ""
                        }`}
                      >
                        {column.render(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-gray-400 py-8 text-xs sm:text-sm"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3 p-3 sm:p-6">
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => (
              <div key={getRowId(item)}>{mobileCard(item)}</div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs sm:text-sm">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>

      {paginated && filteredItems.length > 0 && (
        <div className="border-t border-gray-700 p-3 sm:p-4 flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-400">
            Page {safeCurrentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.max(1, prev - 1))
              }
              disabled={safeCurrentPage <= 1}
              className="px-3 py-1.5 text-xs sm:text-sm rounded border border-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={safeCurrentPage >= totalPages}
              className="px-3 py-1.5 text-xs sm:text-sm rounded border border-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

