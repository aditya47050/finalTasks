"use client";

import React, { useMemo, useState } from "react";
import {
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
import HeadingClientMain from "@/app/components/heading";
import{
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";

// Custom Modal Component
const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-lg">
        <button
          className="absolute top-16 right-16 bg-red-600 p-2 rounded-xl font-poppins  text-white   text-lg"
          onClick={onClose}
        >
          Close
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

const BusinessPartnershipClient = ({ enquiries }) => {
  const pageSize = 10; // Set the number of rows per page
  const [data, setData] = React.useState(enquiries);
  const [modalImage, setModalImage] = React.useState(null);
  const [modalMessage, setModalMessage] = React.useState(null);
  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    category: "",
    hspfullname: "",
    address: "",
    pincode: "",
  });
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply filters
  const filteredData = useMemo(() => {
    return enquiries.filter((item) =>
      Object.keys(filters).every((key) =>
        filters[key]
          ? String(item[key]).toLowerCase().includes(filters[key].toLowerCase())
          : true
      )
    );
  }, [filters, enquiries]);
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
              className="bg-indigo-500 hover:bg-indigo-500 rounded-xl text-white px-3 py-1 hover:text-white"
            >
              View Document
            </button>
          ) : (
            <div className="rounded-xl text-indigo-500 px-3 py-1">No Document</div>
          );
        },
      },
      {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => {
          const message = row.getValue("message");
          return message ? (
            <button
              onClick={() => setModalMessage(message)} // Open the modal for the message
              className="bg-indigo-500 hover:bg-indigo-500 rounded-xl text-white px-3 py-1 hover:text-white"
            >
              View Message
            </button>
          ) : (
            <div className="rounded-xl text-indigo-500 px-3 py-1">No Message</div>
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
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
  });
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Emergency Ambulance Data");
    XLSX.writeFile(wb, "emergency_ambulance_data.xlsx");
  };
  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
      <HeadingClientMain main={"Business Partnership Enquiries"} sub={"Enquiry Details"} />
      <div className="flex justify-end my-4">
        <Button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
        >
          Export to Excel
        </Button>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        <InputField
          label="Name"
          id="name"
          placeholder="Enter name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <InputField
          label="Pincode"
          id="pincode"
          placeholder="Enter pincode"
          value={filters.pincode}
          onChange={handleFilterChange}
        />
        <SelectField
          label="Category"
          id="category"
          value={filters.category}
          onChange={handleFilterChange}
          options={[
            { value: "", label: "Select Category" },
            { value: "general", label: "General" },
            { value: "specialist", label: "Specialist" },
          ]}
        />
        <DateFilter
          label="Created At From"
          id="createdAtFrom"
          selected={filters.createdAtFrom}
          onChange={handleFilterChange}
        />
        <DateFilter
          label="Created At To"
          id="createdAtTo"
          selected={filters.createdAtTo}
          onChange={handleFilterChange}
        />
      </div>
      

        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
         <div className="">
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

      {/* Modal for displaying the document image */}
      <Modal
        isOpen={!!modalImage}
        title="Government Document"
        onClose={() => setModalImage(null)}
      >
        {modalImage && (
          <Image
            width={400}
            height={400}
            src={modalImage}
            alt="Government Document"
            className="mx-auto"
          />
        )}
      </Modal>

      {/* Modal for displaying the message */}
      <Modal
        isOpen={!!modalMessage}
        title="Message"
        onClose={() => setModalMessage(null)}
      >
        <p className="text-gray-700 text-sm whitespace-pre-wrap">
          {modalMessage}
        </p>
      </Modal>
      </div>
    </div>
  );
};

export default BusinessPartnershipClient;
