"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import DepartmentinfoForm from "./department-info-form";

export default function DepartmentContactTable({ data, hospitalId }) {
  const [filters, setFilters] = useState({
    mobileNumber: "",
    email: "",
    department: "",
  });

  const [filteredData, setFilteredData] = useState(data);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [forceRender, setForceRender] = useState(false); // Used to force re-render

  // Effect to apply filters and update table data
  useEffect(() => {
    console.log("📌 Filters changed:", filters);

    const newFilteredData = data.filter((row) =>
      Object.keys(filters).every((key) => {
        const filterValue = filters[key].toLowerCase();
        const rowValue = String(row[key] || "").toLowerCase();
        return filterValue ? rowValue.includes(filterValue) : true;
      })
    );

    console.log("✅ Filtered Data:", newFilteredData);
    setFilteredData(newFilteredData);
    setPageIndex(0); // Reset pagination on filter change

    // Force re-render to update table
    setForceRender((prev) => !prev);
  }, [filters, data]);

  // Define Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "department",
        header: "Department",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "mobileNumber",
        header: "Mobile Number",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  // Initialize Table
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Effect to debug table rows
  useEffect(() => {
    console.log(
      "🔄 Table is updating with filtered data:",
      table.getRowModel().rows
    );
  }, [filteredData, table]);

  // Export to Excel
  const exportToExcel = () => {
    console.log("📤 Exporting Data:", filteredData);
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff Data");
    XLSX.writeFile(wb, "staff_data.xlsx");
  };

  // Reset Filters
  const resetFilters = () => {
    console.log("🔄 Resetting filters...");
    setFilters({ mobileNumber: "", email: "", department: "" });

    setTimeout(() => {
      console.log("✅ Filters reset complete.");
    }, 0);
  };

  return (
    <div className="mt-4 overflow-x-auto min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white font-poppins">
      <div className="flex md:flex-nowrap flex-wrap justify-end gap-2 mb-2">
        
        <DepartmentinfoForm hospitalId={hospitalId} />
        <Button
          onClick={resetFilters}
          className="bg-blue-500 text-white rounded-xl hover:bg-blue-500 hover:opacity-100 transition-none"
        >
          Reset Filters
        </Button>
        <Button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
        >
          Export to Excel
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mb-4">
        {Object.keys(filters).map((key) => {
          // Convert camelCase to readable format (e.g., "mobileNumber" → "Mobile Number")
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());

          return (
            <Input
              key={key}
              type="text"
              placeholder={`Filter by ${formattedKey}`}
              value={filters[key]}
              onChange={(e) =>
                setFilters({ ...filters, [key]: e.target.value })
              }
            />
          );
        })}
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}
              className="bg-gray-100 hover:bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border-[1px] text-center border-gray-200 py-4 px-6  font-semibold text-gray-900 whitespace-nowrap">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row,index) => (
                <TableRow key={row.id} className={`
                        transition-colors duration-150 ease-in-out text-center
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100">
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
                  className="text-center py-4"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Export */}
      <div className="flex items-center justify-between py-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Force Re-render Trigger */}
      {forceRender && <></>}
    </div>
  );
}
