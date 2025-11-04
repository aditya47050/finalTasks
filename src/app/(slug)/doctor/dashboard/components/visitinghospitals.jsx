"use client";
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
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
import VisitingHospitalClient from "./visitingformhospital";

// shadcn select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Input field component
const InputField = ({ label, id, type = "text", placeholder, value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

// ✅ Select field component
const SelectFilter = ({ label, id, options, value, onChange, placeholder = "Select..." }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Select value={value} onValueChange={(val) => onChange(id, val)} className="rounded-xl">
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const pageSize = 10;

export default function AllHospitalsList({ userdata, state, dist, subdist }) {
  const [showFilters, setShowFilters] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  // ✅ Filters only for visiting hospitals
  const [filters, setFilters] = useState({
    hospitalname: "",
    hospitalconsultationfee: "",
    hospitalcontactno: "",
    city: "",
    district: "all",
    taluka: "all",
    state: "all",
    pincode: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };


  // ✅ Filter visiting hospitals only
  const filteredData = useMemo(() => {
    return (userdata.doctorvisitinghospitals || []).filter((item) => (
      (!filters.hospitalname || item.hospitalname?.toLowerCase().includes(filters.hospitalname.toLowerCase())) &&
      (!filters.hospitalconsultationfee || item.hospitalconsultationfee?.toString().includes(filters.hospitalconsultationfee)) &&
      (!filters.hospitalcontactno || item.hospitalcontactno?.includes(filters.hospitalcontactno)) &&
      (!filters.city || item.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.district === "all" || item.district?.toLowerCase() === filters.district.toLowerCase()) &&
      (filters.taluka === "all" || item.taluka?.toLowerCase() === filters.taluka.toLowerCase()) &&
      (filters.state === "all" || item.state?.toLowerCase() === filters.state.toLowerCase()) &&
      (!filters.pincode || item.pincode?.includes(filters.pincode))
    ));
  }, [userdata, filters]);

  // ✅ Export only visiting hospitals
  const handleExportToExcel = () => {
    if (!filteredData.length) return;

    const exportData = filteredData.map((item) => ({
      "Hospital Name": item.hospitalname || "N/A",
      "Consultation Fee (₹)": item.hospitalconsultationfee || "N/A",
      "Contact No": item.hospitalcontactno || "N/A",
      "City": item.city || "N/A",
      "District": item.district || "N/A",
      "Taluka": item.taluka || "N/A",
      "State": item.state || "N/A",
      "Pincode": item.pincode || "N/A",
      "Created At": item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "N/A",
      "Updated At": item.updatedAt ? format(new Date(item.updatedAt), "dd/MM/yyyy") : "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visiting Hospitals");
    XLSX.writeFile(wb, `Visiting_Hospitals_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  // ✅ Table columns only for visiting hospitals
  const visitingColumns = React.useMemo(
    () => [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <VisitingHospitalClient
            userdata={userdata}
            hospitalid={row.original.id}
            state={state}
            dist={dist}
            subdist={subdist}
          />
        ),
      },
      { accessorKey: "hospitalname", header: "Hospital Name" },
      { accessorKey: "hospitalconsultationfee", header: "Consultation Fee (₹)" },
      { accessorKey: "hospitalcontactno", header: "Contact No" },
      { accessorKey: "city", header: "City" },
      { accessorKey: "district", header: "District" },
      { accessorKey: "taluka", header: "Taluka" },
      { accessorKey: "state", header: "State" },
      { accessorKey: "pincode", header: "Pincode" },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => format(new Date(row.getValue("updatedAt")), "dd/MM/yyyy"),
      },
    ],
    [userdata, state, dist, subdist]
  );

  const table = useReactTable({
    data: filteredData,
    columns: visitingColumns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, pagination },
  });

  return (
    <div className="container mx-auto md:max-w-6xl">
      <div className="text-center pt-4 pb-6">
        <h1 className="text-[24px] text-[#2b73ec] font-extrabold">Visiting Hospital List</h1>
        <p className="text-[#243460] text-[13px] mt-1">Complete Hospital Information</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center pt-4 gap-4">
        <VisitingHospitalClient userdata={userdata} state={state} dist={dist} subdist={subdist} />
        <div className="flex gap-3">
          <Button onClick={() => setShowFilters((p) => !p)} variant="outline" className="bg-blue-500 text-white rounded-xl">
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button onClick={handleExportToExcel} className="bg-green-500 text-white rounded-xl" disabled={!filteredData.length}>
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Hospital Name" id="hospitalname" value={filters.hospitalname} onChange={handleFilterChange} />
          <InputField label="Consultation Fee" id="hospitalconsultationfee" type="number" value={filters.hospitalconsultationfee} onChange={handleFilterChange} />
          <InputField label="Contact No" id="hospitalcontactno" value={filters.hospitalcontactno} onChange={handleFilterChange} />
          <InputField label="City" id="city" value={filters.city} onChange={handleFilterChange} />
          <SelectFilter label="State" id="state" options={state.map(s => ({ value: s.stateName, label: s.stateName }))} value={filters.state} onChange={handleFilterChange} />
          <SelectFilter label="District" id="district" options={dist.map(d => ({ value: d.district, label: d.district }))} value={filters.district} onChange={handleFilterChange} />
          <SelectFilter label="Taluka" id="taluka" options={subdist.map(sd => ({ value: sd.subdistrict, label: sd.subdistrict }))} value={filters.taluka} onChange={handleFilterChange} />
          <InputField label="Pincode" id="pincode" value={filters.pincode} onChange={handleFilterChange} />
        </div>
      )}

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredData.length} of {userdata.doctorvisitinghospitals?.length || 0} hospitals
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-[15px] shadow-lg mt-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-gray-50 text-sm font-semibold text-gray-700 py-3 border">
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id} className="text-sm border px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visitingColumns.length} className="text-center py-6">
                  No hospitals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
