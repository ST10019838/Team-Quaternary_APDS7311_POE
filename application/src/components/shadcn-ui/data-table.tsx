'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-ui/table';

import { Button } from '@/components/shadcn-ui/button';
import { Input } from '@/components/shadcn-ui/input';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/shadcn-ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn-ui/select';

import { DataTablePagination } from './data-table-pagination-controls';
import { DataTableViewOptions } from './data-table-column-visibility-controls';

import { Separator } from '@/components/shadcn-ui/separator';
import { CirclePlus, FilterX } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onAddItem?: () => {};
  addItemForm?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  isError,
  error,
  addItemForm,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedColumnToFilter, setSelectedColumnToFilter] =
    useState<string>('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        {/* Filtering / Searching Controls */}
        <div className="flex min-w-max items-center gap-3">
          {/* The button was getting squashed even though there was enough space resulting in manually setting a minimum size */}
          <Button
            variant="outline"
            size="icon"
            className="min-h-10 min-w-10"
            onClick={() => {
              setSelectedColumnToFilter('');
              table.resetColumnFilters();
            }}
          >
            <FilterX />
          </Button>

          <Separator orientation="vertical" className="h-[16px]" />

          <Select
            onValueChange={(value) => {
              table.resetColumnFilters();

              setSelectedColumnToFilter(() => value);
            }}
            value={selectedColumnToFilter}
          >
            <SelectTrigger className="min-w-[180px] max-w-max space-x-3 capitalize">
              <SelectValue placeholder="Select a Column To Filter" />
            </SelectTrigger>
            <SelectContent>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined')
                .map((column) => {
                  return (
                    <SelectItem key={column.id} value={column.id}>
                      {column.id}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>

          {selectedColumnToFilter !== '' && (
            <Input
              placeholder={`Filter by ${selectedColumnToFilter}...`}
              value={
                (table
                  .getColumn(selectedColumnToFilter)
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(event) => {
                table
                  .getColumn(selectedColumnToFilter)
                  ?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          )}
        </div>

        <div className="flex min-w-max items-center gap-3">
          {/* Column Visibility Controls */}
          <div>
            <DataTableViewOptions table={table} />
          </div>

          <Separator orientation="vertical" className="h-[16px]" />

          {/* Add an Item to the Table */}
          <div>{addItemForm}</div>
        </div>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <span className="animate-pulse">Loading...</span>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-rose-500"
                >
                  Error: {error?.message}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />

        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button> */}
      </div>
    </div>
  );
}
