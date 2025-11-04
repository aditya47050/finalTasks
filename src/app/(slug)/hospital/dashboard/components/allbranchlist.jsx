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
import BranchClient from "./branchclient";
import HeadingClientMain from "@/app/components/heading";
const pageSize = 10; // Set the number of rows per page

// Main component to render the table
export default function AllBranchesList({ userdata, state, dist, subdist }) {
  // Define columns for the Hspbranch model
  const columns = React.useMemo(
    () => [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          // Extract the hspbranchid from the row
          const hspbranchid = row.original.id; // Assuming the ID column is named 'id'
          console.log("iddd", hspbranchid);
          return <BranchClient userdata={userdata} hspbranchid={hspbranchid} />;
        },
      },
      {
        accessorKey: "branchname",
        header: () => <div>Branch Name</div>,
      },
      {
        accessorKey: "branchregno",
        header: () => <div>Branch Reg No</div>,
      },
      {
        accessorKey: "branchcity",
        header: () => <div>Branch City</div>,
      },
      {
        accessorKey: "branchpincode",
        header: () => <div>Branch Pincode</div>,
      },
      {
        accessorKey: "branchreceptionno1",
        header: () => <div>Reception No 1</div>,
      },
      {
        accessorKey: "branchreceptionno2",
        header: () => <div>Reception No 2</div>,
      },
      {
        accessorKey: "branchreceptionemail",
        header: () => <div>Reception Email</div>,
      },
      {
        accessorKey: "branchaddress",
        header: () => <div>Branch Address</div>,
      },
      {
        accessorKey: "branchmanagername",
        header: () => <div>Manager Name</div>,
      },
      {
        accessorKey: "branchmanagerno",
        header: () => <div>Manager No</div>,
      },
      {
        accessorKey: "branchmanageremail",
        header: () => <div>Manager Email</div>,
      },
      {
        accessorKey: "branchadminname",
        header: () => <div>Admin Name</div>,
      },
      {
        accessorKey: "branchadminno",
        header: () => <div>Admin No</div>,
      },
      {
        accessorKey: "branchadminemail",
        header: () => <div>Admin Email</div>,
      },
      {
        accessorKey: "state",
        header: () => <div>State</div>,
      },
      {
        accessorKey: "district",
        header: () => <div>District</div>,
      },
      {
        accessorKey: "taluka",
        header: () => <div>Taluka</div>,
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
    data: userdata.hspbranches || [],
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
              <HeadingClientMain main="Hsp Branches" sub="All Details"/>
            </div>
            <div className="justify-end flex ">
              <BranchClient
                userdata={userdata}
                state={state}
                dist={dist}
                subdist={subdist}
              />
            </div>
            <div className="mt-4 overflow-x-auto min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white font-poppins">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}
                    className="bg-gray-100 hover:bg-gray-100">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="border-[1px] text-center border-gray-200 py-4 px-6  font-semibold text-gray-900 whitespace-nowrap">
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
                    table.getRowModel().rows.map((row,index) => (
                      <TableRow key={row.id} className={`
                        transition-colors duration-150 ease-in-out text-center
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100"
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
                <span>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
                <Button
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="rounded-full border-2 px-3 border-[#243460]">
                    Next
                  </span>
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
