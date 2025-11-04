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
import { DateFilter, InputField } from "@/app/components/input-selectui";
import * as XLSX from "xlsx";
import  HeadingClientMain  from '@/app/components/heading';

const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-lg">
        <button
          className="absolute top-4 right-4 bg-red-600 p-2 rounded text-white"
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

const ContactUsEnquiries = ({ enquiries }) => {
  const pageSize = 10;
  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    fullname: "",
    fromDate: "",
    toDate: "",
  });
  const [modalMessage, setModalMessage] = useState(null);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredData = useMemo(() => {
    return enquiries.reverse().filter((item) =>
      Object.keys(filters).every((key) =>
        filters[key]
          ? String(item[key]).toLowerCase().includes(filters[key].toLowerCase())
          : true
      )
    );
  }, [filters, enquiries]);

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        accessorKey: "serialNo",
        cell: (info) => info.row.index + 1,
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      { accessorKey: "fullname", header: "Full Name" },
      {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => (
          <button
            onClick={() => setModalMessage(row.getValue("message"))}
            className="bg-indigo-500 hover:bg-indigo-500 rounded-xl text-white px-3 py-1 hover:text-white"
          >
            View Message
          </button>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleString(),
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contact_Us_Enquiries");
    XLSX.writeFile(wb, "contact_us_enquiries.xlsx");
  };

  return (
    <div className="md:container mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
      <HeadingClientMain main="Contact Us Enquiries" sub="Full Details" />
      <div className="flex justify-end my-4">
        <Button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600 rounded-xl text-white "
        >
          Export to Excel
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        <InputField
          label="Email"
          id="email"
          value={filters.email}
             placeholder="Enter Email"
          onChange={handleFilterChange}
        />
        <InputField
          label="Mobile"
          id="mobile"
          placeholder="Enter Mobile Number"
          value={filters.mobile}
       
          onChange={handleFilterChange}
        />

        <InputField
          label="Full Name"
          id="fullname"
             placeholder="Enter Full Name"
          value={filters.fullname}
          onChange={handleFilterChange}
        />
        <DateFilter
          label="From Date"
          id="fromDate"
          selected={filters.fromDate}
          onChange={handleFilterChange}
        />
        <DateFilter
          label="To Date"
          id="toDate"
          selected={filters.toDate}
          onChange={handleFilterChange}
        />
      </div>
      <div className="pt-4 mx-auto w-full">
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
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

export default ContactUsEnquiries;
