"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Download, Upload, ArrowUpDown } from "lucide-react"

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface FilterInterface {
  key: string
  label: string
  options: string[]
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  title: string
  currentPage: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (size: number) => void
  onSearch?: (term: string) => void
  onFilterChange?: (filters: Record<string, string>) => void
  onAdd?: () => void
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onImport?: () => void
  onExport?: (format: string) => void
  filters?: FilterInterface[]
}

export function DataTable({
  data,
  columns,
  title,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  onSearch,
  onFilterChange,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  onExport,
  filters = [],
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch?.(term)
  }

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value === "all" ? "" : value,
    }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center space-x-2">
            {onImport && (
              <Button variant="outline" size="sm" onClick={onImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            )}
            {onExport && (
              <Select onValueChange={onExport}>
                <SelectTrigger className="w-32">
                  <Download className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            )}
            {onAdd && (
              <Button size="sm" onClick={onAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={activeFilters[filter.key] || "all"}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                <SelectTrigger className="w-48">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={`Filter by ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                  {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center">
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
                {data.map((item, index) => {
                  // Use item.id if available, otherwise fallback to index
                  const key = item.id ?? index
                  return (
                    <TableRow key={key}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>{item[column.key]?.toString() ?? "-"}</TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {onEdit && (
                              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    onItemsPerPageChange(Number(value))
                    onPageChange(1)
                  }}
                >
                  <SelectTrigger className="w-[80px] text-sm h-8">
                    <SelectValue placeholder="Rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count} / page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
