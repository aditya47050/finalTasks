"use client"; // Add this line to indicate that this component should be rendered on the client side

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
import Image from "next/image";

// Simple modal component to show the image
const Modal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  // Close modal if background is clicked
  const handleBackgroundClick = (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the background
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close the modal if clicking outside the modal
    >
      <div
        className="bg-white p-4 rounded-xl shadow-lg relative"
        onClick={handleBackgroundClick} // Prevent modal from closing when clicking inside it
      >
        <button
          className="absolute top-2 right-2 text-white"
          onClick={onClose} // Close the modal when the button is clicked
        >
          &times;
        </button>
        <Image
          src={imageUrl}
          width={400}
          height={400}
          alt="Government Document"
          className="max-w-full max-h-[80vh]"
        />
      </div>
    </div>
  );
};

const AarogyaMitraCLient = ({ enquiries }) => {
  const pageSize = 10; // Set the number of rows per page
  const [data, setData] = React.useState(enquiries);
  const [modalImage, setModalImage] = React.useState(null);

  const columns = React.useMemo(
    () => [
      {
        header: "S.No",
        accessorKey: "serialNo",
        cell: (info) => info.row.index + 1, // Generate serial number dynamically
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "hspfullname",
        header: "Full Name",
      },
      {
        accessorKey: "govtdocument",
        header: "Government Document",
        cell: ({ row }) => {
          const govtdocument = row.getValue("govtdocument");
          return govtdocument ? (
            <button
              onClick={() => setModalImage(govtdocument)} // Open the modal when clicked
              className="text-blue-500 underline"
            >
              View Document
            </button>
          ) : (
            <div>No Document</div>
          );
        },
      },
    
      {
        accessorKey: "address",
        header: "Address",
      },
      {
        accessorKey: "pincode",
        header: "Pin Code",
      },
    ],
    []
  );

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
  });

  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
      <div className="justify-center text-center font-poppins pt-4">
        <h1 className="text-[20px] text-[#2b73ec] font-extrabold">
          Aarogya Mitra Registrations
        </h1>
        <p className="text-[#2b73ec] text-[11px] md:text-[15px]">Full Details</p>
      </div>

      <div className="pt-4 mx-auto w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}
                className="bg-gray-100 hover:bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
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
                  <TableRow key={row.id}
                  className={`
                        transition-colors duration-150 ease-in-out
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

      {/* Modal for displaying the document image */}
      <Modal imageUrl={modalImage} onClose={() => setModalImage(null)} />
        </div>
    </div>
  );
};

export default AarogyaMitraCLient;
