"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DateFilter,
  InputField,
  SelectField,
} from "@/app/components/input-selectui";
import HeadingClientMain from "@/app/components/heading";
import { toast } from "react-toastify";
import { Users } from 'lucide-react';

const Bookfreeappointment = ({
  userdata,
  categorytitle,
  doctortype,
  doctor,
}) => {
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalDoctorId, setModalDoctorId] = useState("");
  const [modalStatus, setModalStatus] = useState("APPROVED");

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDoctorChange = (appointmentId, doctorId) => {
    setSelectedDoctors((prev) => ({ ...prev, [appointmentId]: doctorId }));
  };

  const filteredData = useMemo(() => {
    return userdata.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        if (
          key === "createdAt" ||
          key === "updatedAt" ||
          key === "dateOfBirth"
        ) {
          const rowDate = new Date(row[key]);
          return rowDate.toDateString() === new Date(value).toDateString();
        }

        if (key === "gender") return row.gender === value;

        return String(row[key] || "")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
  }, [userdata, filters]);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalDoctorId(selectedDoctors[appointment.id] || "");
    setModalStatus(appointment.status || "APPROVED");
    setModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (!modalDoctorId) {
      alert("Please select a doctor.");
      return;
    }

    try {
      const res = await fetch(
        `/api/bookfreeappointment/${selectedAppointment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: modalDoctorId,
            status: modalStatus,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Updated successfully!");

      setSelectedDoctors((prev) => ({
        ...prev,
        [selectedAppointment.id]: modalDoctorId,
      }));

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast("Error updating appointment.");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "patient",
        header: () => <div>Patient</div>,
        cell: ({ row }) => {
          const patient = row.original.patient;
          return patient ? (
            <a
              href={`/superprofile/patient/${patient.id}`}
              className="bg-[#5271FF] hover:bg-blue-500 rounded-xl text-white px-3 py-1 hover:text-white"
            >
              View Patient
            </a>
          ) : (
            <div>No Patient</div>
          );
        },
      },
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "gender", header: "Gender" },
      { accessorKey: "mobileNumber", header: "Mobile Number" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "city", header: "City" },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const categoryTitle = row.original.category?.title || "N/A";
          return <div>{categoryTitle}</div>;
        },
      },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "doctor",
        header: "Doctor",
        cell: ({ row }) => {
          const doctor = row.original.doctor;
          return doctor ? (
            <div>{`${doctor.firstName} ${doctor.lastName}`}</div>
          ) : (
            <div>No Doctor</div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
          <div>{new Date(row.getValue("updatedAt")).toLocaleDateString()}</div>
        ),
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <Button
            className="bg-indigo-500 hover:bg-indigo-500 rounded-xl text-white px-3 py-1 hover:text-white"
            onClick={() => openModal(row.original)}
            variant="outline"
          >
            Update Status
          </Button>
        ),
      },
    ],
    [doctor, selectedDoctors]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, "FreeAppointment_data.xlsx");
  };

  return (
    <div className="md:container mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1100px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main="Book Free Appointment" sub="Full Data" />
        <div className="flex justify-end gap-1 py-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 hover:bg-blue-500 rounded-xl text-white"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-500 rounded-xl text-white"
          >
            Export to Excel
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {columns.slice(1, -2).map((column) => {
              const key = column.accessorKey;

              if (key === "gender") {
                return (
                  <SelectField
                    key={key}
                    label="Gender"
                    id="gender"
                    value={filters[key] || ""}
                    onChange={handleFilterChange}
                    options={[
                      { value: "", label: "All" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                );
              }

              if (key === "category") {
                return (
                  <SelectField
                    key={key}
                    label="Category"
                    id="category"
                    value={filters[key] || ""}
                    onChange={handleFilterChange}
                    options={[
                      { value: "", label: "All Categories" },
                      ...doctortype.map((category) => ({
                        value: category.id,
                        label: category.title,
                      })),
                    ]}
                  />
                );
              }

              if (
                key === "createdAt" ||
                key === "updatedAt" ||
                key === "dateOfBirth"
              ) {
                return (
                  <DateFilter
                    key={key}
                    label={column.header}
                    id={key}
                    selected={filters[key]}
                    onChange={handleFilterChange}
                  />
                );
              }

              return (
                <InputField
                  key={key}
                  label={column.header}
                  id={key}
                  placeholder={`Enter ${column.header}`}
                  value={filters[key] || ""}
                  onChange={handleFilterChange}
                />
              );
            })}
          </div>
        )}

        <div className="overflow-x-auto bg-white md:p-4 rounded-xl shadow-lg">
          <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>

                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={`
                        transition-colors duration-150 ease-in-out
                        hover:bg-gray-50/50 
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50/20"}
                        border-[1px] border-gray-100
                      `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="border-[1px] border-gray-200 py-4 px-6 text-sm whitespace-nowrap max-w-max hover:bg-gray-100"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>

                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">No users found</p>
                          <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>

        {/* ShadCN Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Select a doctor and update the status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor</label>
                <select
                  className="w-full border px-3 py-2 rounded-xl"
                  value={modalDoctorId}
                  onChange={(e) => setModalDoctorId(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {doctor.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.firstName} {doc.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border px-3 py-2 rounded-xl"
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                className="  rounded-xl"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="hover:bg-blue-600 bg-blue-600 hover:text-white text-white rounded-xl"
                onClick={handleModalSubmit}
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
      </div>
    </div>
  );
};

export default Bookfreeappointment;
