"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Bedclient from "./bedsclient";

const pageSize = 10; // Set the number of rows per page

// Main component to render the table
export default function AllBedsList({ userdata }) {
  // Define columns for the Hspbranch model
  const columns = React.useMemo(
    () => [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          // Extract the bed ID from the row
          const bedId = row.original.id; // Assuming the ID column is named 'id'
         
          return  <Bedclient userdata={userdata} bedid={bedId}/>;
        },
      },
      {
        accessorKey: "bedtype",
        header: () => <div>Bed Type</div>,
        cell: ({ row }) => <div>{row.getValue("bedtype") || "N/A"}</div>,
      },
      {
        accessorKey: "bedcount",
        header: () => <div>Bed Count</div>,
        cell: ({ row }) => <div>{row.getValue("bedcount") || "0"}</div>,
      },
      {
        accessorKey: "chargetype",
        header: () => <div>Charge Type</div>,
        cell: ({ row }) => <div>{row.getValue("chargetype") || "N/A"}</div>,
      },
      {
        accessorKey: "isavilable",
        header: () => <div>Is Available</div>,
        cell: ({ row }) => (
          <div>{row.getValue("isavilable") ? "Yes" : "No"}</div>
        ),
      },
      {
        accessorKey: "minprice",
        header: () => <div>Min Price</div>,
        cell: ({ row }) => <div>{row.getValue("minprice") || "N/A"}</div>,
      },
      {
        accessorKey: "maxprice",
        header: () => <div>Max Price</div>,
        cell: ({ row }) => <div>{row.getValue("maxprice") || "N/A"}</div>,
      },
      {
        accessorKey: "createdAt",
        header: () => <div>Created At</div>,
        cell: ({ row }) => (
          <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: () => <div>Updated At</div>,
        cell: ({ row }) => (
          <div>{new Date(row.getValue("updatedAt")).toLocaleDateString()}</div>
        ),
      },
    ],
    []
  );
  

  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: userdata.Bed || [],
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <>
      <div className="container mx-auto flex justify-center items-center md:max-w-6xl">
        <div className="">
          <div className=" mx-auto w-full">
            <div className="justify-center text-center font-poppins pt-2">
              <h1 className="text-[20px] text-[#2b73ec] font-extrabold">
           Hsp Beds
              </h1>
              <p className="text-[#243460] text-[11px]">All Details</p>
            </div>
            <div className="justify-end flex ">
            <Bedclient userdata={userdata}  />
            </div>
            <div className="overflow-x-auto container mx-auto lg:w-[900px] xl:w-[1200px] w-[350px] md:w-[700px] bg-white p-4 rounded-[15px] shadow-lg">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="bg-white text-[14px] border"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
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
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="border-r border-l text-[13px] border-b"
                          >
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

              {/* Pagination Controls */}
              <div className="flex items-center justify-between py-4">
                <Button
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="rounded-full border-2 px-3 border-[#243460]">
                    Previous
                  </span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="rounded-full border-2 px-3 border-[#243460]">
                    Next
                  </span>
                </Button>
                <span>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
