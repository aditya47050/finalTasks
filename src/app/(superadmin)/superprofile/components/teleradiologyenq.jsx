"use client";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import ReactModal from "react-modal";
import HeadingClientMain from "@/app/components/heading";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

// Reusable Select Field
const SelectField = ({ label, id, value, onChange, options = [] }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600">
      {label}
    </label>
    <select
      id={id}
      className="border border-gray-300 p-2 rounded-xl w-full bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
    >
      <option value="">all</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Reusable Input Field
const InputField = ({ label, id, type = "text", value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder} // Placeholder in lowercase
      className="border border-gray-300 p-2 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
    />
  </div>
);

// Reusable Date Filter
const DateFilter = ({ label, id, selected, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="block text-sm font-medium text-gray-600">
      {label}
    </label>
    <ReactDatePicker
      id={id}
      selected={selected ? new Date(selected) : null}
      onChange={(date) => onChange(id, date ? date.toISOString() : "")}
      dateFormat="yyyy-MM-dd"
      className="border border-gray-300 p-2 rounded-xl w-full bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      isClearable
      showYearDropdown
      scrollableYearDropdown
      placeholderText="Select date"
    />
  </div>
);

const Teleradiologyenqclient = ({ enquiries }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    name: "",
    city: "",
    designation: "",
    hspname: "",
    createdFrom: "",
    createdTo: "",
  });

  // Update filter state
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((enquiry) => {
    return (
      (!filters.email || enquiry.email.includes(filters.email)) &&
      (!filters.mobile || enquiry.mobile.includes(filters.mobile)) &&
      (!filters.name || enquiry.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.city || enquiry.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (!filters.designation || enquiry.designation.toLowerCase().includes(filters.designation)) &&
      (!filters.hspname || enquiry.hspname.includes(filters.hspname)) &&
      (!filters.createdFrom || new Date(enquiry.createdAt) >= new Date(filters.createdFrom)) &&
      (!filters.createdTo || new Date(enquiry.createdAt) <= new Date(filters.createdTo))
    );
  });

  // Modal Controls
  const openModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage("");
  };

  const columns = [
    { header: "S.No", accessorKey: "serialNo", cell: (info) => info.row.index + 1 },
    { header: "Email", accessorKey: "email" },
    { header: "Mobile", accessorKey: "mobile" },
    { header: "Full Name", accessorKey: "name" },
    { header: "City", accessorKey: "city" },
    { header: "Designation", accessorKey: "designation" },
    { header: "HSP Name", accessorKey: "hspname" },
    {
      header: "Message",
      accessorKey: "message",
      cell: ({ row }) => (
        <Button onClick={() => openModal(row.original.message)} className="bg-indigo-500 hover:bg-indigo-500 rounded-xl text-white px-3 py-1 hover:text-white">View</Button>
      ),
    },
    {
      header: "Recieved At",
      accessorKey: "createdAt",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];
  // Pagination State
  const pageSize = 10;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: filteredEnquiries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
  });
  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
      <HeadingClientMain main={"Contact Us Enquiries"} sub={"Full Details"} />


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-2 gap-4">
          <InputField label="Email" id="email" value={filters.email} onChange={handleFilterChange} placeholder="Enter Email" />
          <InputField label="Mobile" id="mobile" value={filters.mobile} onChange={handleFilterChange} placeholder="Enter Mobile" />
          <InputField label="Full Name" id="name" value={filters.name} onChange={handleFilterChange} placeholder="Enter Full Name" />
          <InputField label="City" id="city" value={filters.city} onChange={handleFilterChange} placeholder="Enter City" />
          <InputField label="Designation" id="designation" value={filters.designation} onChange={handleFilterChange} placeholder="Enter Designation" />
          <InputField label="HSP Name" id="hspname" value={filters.hspname} onChange={handleFilterChange} placeholder="Enter HSP Name" />
          <DateFilter label="Created From" id="createdFrom" selected={filters.createdFrom} onChange={handleFilterChange} />
          <DateFilter label="Created To" id="createdTo" selected={filters.createdTo} onChange={handleFilterChange} />
        </div>
    

    {/* Table */}
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

      {/* Modal */}
      <ReactModal isOpen={isModalOpen} onRequestClose={closeModal} className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Full Message</h2>
          <p className="mb-4">{selectedMessage}</p>
          <Button onClick={closeModal} varient="outline" className="border ">Close</Button>
        </div>
      </ReactModal>
    </div>
    </div>
  );
};

export default Teleradiologyenqclient;
