"use client";
import * as XLSX from "xlsx"; // Import XLSX for exporting

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputField, SelectField } from "@/app/components/input-selectui";
import  HeadingClientMain  from '@/app/components/heading';

const HealthCardClientdata = ({ userdata }) => {
  const pageSize = 10;
  const [data, setData] = useState(userdata);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentHealthCardId, setCurrentHealthCardId] = useState(null);
  const [remark, setRemark] = useState("");
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const patientModelFields = [
    "email",
    "mobile",
    "password",
    "pincode",
    "firstName",
    "middleName",
    "lastName",
    "dateOfBirth",
    "gender",
    "maritalStatus",
    "religion",
    "alternateMobile",
    "presentAddress",
    "city",
    "state",
    "district",
    "taluka",
    "bloodgroup",
    "passportPhoto",
    "aadharCardNumber",
    "aadharCardFront",
    "aadharCardBack",
    "abhacard",
    "abhaCardNumber",
    "abhaCardFront",
    "healthInsurance",
    "healthInsuranceNumber",
    "healthInsuranceDocument",
    "ayushmancard",
    "ayushmanCard",
    "ayushmanCardFront",
    "rationCardNumber",
    "rationCardFront",
    "rationCardBack",
    "organDonation",
    "bankName",
    "accountNumber",
    "ifscCode",
    "accountType",
    "cancelledCheque",
    "micrCode",
    "income",
    "incomeCertificateimg",
    "incomeCertificateNo",
    "panCard",
    "contactPersonName",
    "contactPersonRelation",
    "contactManaadharFront",
    "contactmanaadharBack",
    "contactmanaadharNumber",
    "isCompanyRegistered",
    "companyRegistrationNo",
    "employeeIdCard",
  ];

  const excludedFields = ["email", "mobile", "password", "pincode"];

const issues = [
  ...patientModelFields
    .filter((field) => !excludedFields.includes(field)) // exclude these fields
    .map(
      (field) => `Incorrect ${field.charAt(0).toUpperCase() + field.slice(1)}`
    ),
  "Missing Documents",
  "Other",
];

  const openModal = (action, healthCardId) => {
    setCurrentAction(action);
    setCurrentHealthCardId(healthCardId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRemark("");
    setSelectedIssues([]);
  };

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleSubmitRemark = async () => {
    if (remark.trim() === "") {
      toast("Remark is required!");
      return;
    }

    const fullRemark = `${remark}\nIssues: ${selectedIssues.join(", ")}`;
    try {
      setLoading(true);
      const response = await fetch(
        `/api/applyhealthcard/${currentHealthCardId}/aprovalstatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: currentAction, remark: fullRemark }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the health card");
      }

      const updatedCard = await response.json();
      setData((prevData) =>
        prevData.map((card) =>
          card.id === currentHealthCardId
            ? { ...card, approvalStatus: updatedCard.approvalStatus }
            : card
        )
      );

      closeModal();
    } catch (error) {
      console.error("Error updating health card:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = React.useMemo(
    () => [
      { accessorKey: "cardNo", header: () => <div>Card No</div> },
      { accessorKey: "firstName", header: () => <div>First Name</div> },
      { accessorKey: "lastName", header: () => <div>Last Name</div> },
      { accessorKey: "aadharCardNumber", header: () => <div>Aadhar Card</div> },
  

      {
        accessorKey: "patient",
        header: () => <div>Patient</div>,
        cell: ({ row }) => {
          const patient = row.original.patient;
          return patient ? (
            <a
              href={`/superprofile/applyhealthcard/${patient.id}`}
              className="text-blue-500 underline"
            >
              View Patient
            </a>
          ) : (
            <div>No Patient</div>
          );
        },
      },
      {
        accessorKey: "approvalStatus",
        header: () => <div>Approval Status</div>,
        cell: ({ row }) => <div>{row.getValue("approvalStatus")}</div>,
      },
      {
        accessorKey: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
          const healthCardId = row.original.id;

          return (
            <div className="flex space-x-2">
              <button
                onClick={() => openModal("approve", healthCardId)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => openModal("reject", healthCardId)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          );
        },
      },
    ],
    []
  );
  const filtersArray = [
    { id: "name", label: "Name", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "mobile", label: "Mobile", type: "text" },
    { id: "gender", label: "Gender", type: "select", options: [
        { value: "", label: "Select" },
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ]
    },
    { id: "minAge", label: "Min Age", type: "number" },
    { id: "maxAge", label: "Max Age", type: "number" },
    { id: "pincode", label: "Pincode", type: "text" },
    { id: "cardNo", label: "Card No", type: "text" },

    { id: "maritalStatus", label: "Marital Status", type: "select", options: [
      { value: "", label: "All" }, { value: "unmarried", label: "Unmarried" }, { value: "married", label: "Married" }

      ]
    },
    { id: "religion", label: "Religion", type: "select" , options :[    { value: "", label: "All Religion" },
      { value: "hinduism", label: "Hinduism" }, { value: "islam", label: "Islam" },
      { value: "christianity", label: "Christianity" }, { value: "sikhism", label: "Sikhism" },
      { value: "buddhism", label: "Buddhism" }, { value: "jainism", label: "Jainism" },
      { value: "kabirpanth", label: "Kabir Panth" }, { value: "zoroastrianism", label: "Zoroastrianism" },
      { value: "other", label: "Other" }] },
    { id: "city", label: "City", type: "text" },
    { id: "state", label: "State", type: "text" },
    { id: "district", label: "District", type: "text" },
    { id: "taluka", label: "Taluka", type: "text" },
    { id: "hasPanCard", label: "PAN Card?", type: "select", options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { 
      id: "income", 
      label: "Income Certificate", 
      type: "select", 
      options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { id: "healthInsurance", label: "Health Insurance", type: "select", options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { id: "abhacard", label: "ABHA Card?", type: "select", options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { id: "ayushmancard", label: "Ayushman Card?", type: "select", options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { id: "rationcard", label: "Ration Card?", type: "select", options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { id: "organDonation", label: "Organ Donor?", type: "select", options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { id: "isCompanyRegistered", label: "Company Registered?", type: "select", options: [
        { value: "", label: "Select" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]
    },
    { id: "bloodgroup", label: "Blood Group",  type: "select", options: [
      { value: "", label: "All Blood Group" },
      { value: "A+", label: "A+" }, { value: "A-", label: "A-" },
      { value: "B+", label: "B+" }, { value: "B-", label: "B-" },
      { value: "O+", label: "O+" }, { value: "O-", label: "O-" },
      { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }
    ]},
    { id: "bankName", label: "Bank Name", type: "select" ,options:[        { value: "", label: "All Banks" },
      { value: "state_bank_of_india", label: "State Bank of India" },
      { value: "bank_of_baroda", label: "Bank of Baroda" },
      { value: "punjab_national_bank", label: "Punjab National Bank" },
      { value: "canara_bank", label: "Canara Bank" },
      { value: "union_bank_of_india", label: "Union Bank of India" },
      { value: "bank_of_india", label: "Bank of India" },
      { value: "indian_bank", label: "Indian Bank" },
      { value: "central_bank_of_india", label: "Central Bank of India" },
      { value: "indian_overseas_bank", label: "Indian Overseas Bank" },
      { value: "uco_bank", label: "UCO Bank" },
      { value: "bank_of_maharashtra", label: "Bank of Maharashtra" },
      { value: "punjab_and_sind_bank", label: "Punjab & Sind Bank" },
      { value: "hdfc_bank", label: "HDFC Bank" },
      { value: "icici_bank", label: "ICICI Bank" },
      { value: "axis_bank", label: "Axis Bank" },
      { value: "kotak_mahindra_bank", label: "Kotak Mahindra Bank" },
      { value: "indusind_bank", label: "IndusInd Bank" },
      { value: "yes_bank", label: "Yes Bank" },
      { value: "federal_bank", label: "Federal Bank" },
      { value: "idfc_first_bank", label: "IDFC First Bank" },
      { value: "bandhan_bank", label: "Bandhan Bank" },
      { value: "rbl_bank", label: "RBL Bank" },
      { value: "citibank", label: "Citibank" },
      { value: "standard_chartered_bank", label: "Standard Chartered Bank" },
      { value: "hsbc", label: "HSBC" },
      { value: "deutsche_bank", label: "Deutsche Bank" },
      { value: "dbs_bank", label: "DBS Bank" },
      { value: "andhra_pradesh_grameena_vikas_bank", label: "Andhra Pradesh Grameena Vikas Bank" },
      { value: "baroda_up_bank", label: "Baroda UP Bank" },
      { value: "kerala_gramin_bank", label: "Kerala Gramin Bank" },
      { value: "karnataka_gramin_bank", label: "Karnataka Gramin Bank" },
      { value: "punjab_gramin_bank", label: "Punjab Gramin Bank" }
  ] },
    { id: "accountType", label: "Account Type", type: "select" ,options:[
      { value: "", label: "All" }, { value: "savings", label: "Savings" }, { value: "current", label: "Current" }

    ] },
    { id: "aadharCardNumber", label: "Aadhar Card Number", type: "text" },
    { id: "approvalStatus", label: "Approval Status", type: "select", options: [
      { value: "", label: "Select" },
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ]
  },
  { id: "requestfrom", label: "Request From", type: "select", options: [
    { value: "", label: "Select" },
    { value: "home", label: "From Home" },
    { value: "profile", label: "From Profile" },
  ]
},
{ id: "createdAtFrom", label: "Created At (From)", type: "date" },
{ id: "createdAtTo", label: "Created At (To)", type: "date" },
{ id: "updatedAtFrom", label: "Updated At (From)", type: "date" },
{ id: "updatedAtTo", label: "Updated At (To)", type: "date" },
  ];
  
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust if birthday hasn't occurred yet this year
    }
  
    return age;
  };
  const [columnFilters, setColumnFilters] = useState({});
  const handleFilterChange = (key, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value?.toString().toLowerCase(), // Store lowercase for case-insensitive filtering
    }));
  };
  
  const filteredData = React.useMemo(() => {
    return data.reverse().filter((item) => {
      return Object.keys(columnFilters).every((key) => {
        let value = columnFilters[key];
        if (!value) return true;
  
        // Function to get field value from item or item.patient
        const getFieldValue = (fieldKey) => item[fieldKey] ?? item.patient?.[fieldKey];
  
        // Age filtering (checks item.patient.dateOfBirth)
        if (key === "minAge" || key === "maxAge") {
          const userAge = calculateAge(item.patient?.dateOfBirth);
          if (!userAge) return false; // Skip if age cannot be determined
          const numericValue = Number(value);
          if (key === "minAge" && userAge < numericValue) return false;
          if (key === "maxAge" && userAge > numericValue) return false;
          return true;
        }
  
        // From-To Date Filtering (checks both item and item.patient)
        if (key.includes("From") || key.includes("To")) {
          const baseKey = key.replace("From", "").replace("To", "");
          const itemDate = new Date(getFieldValue(baseKey));
  
          if (key.includes("From") && itemDate < new Date(value)) return false;
          if (key.includes("To") && itemDate > new Date(value)) return false;
          return true;
        }
  
        // Special Handling for "name" field (combining first, middle, last name)
        if (key === "name") {
          const getFullName = (obj) => {
            return [obj?.firstName, obj?.middleName, obj?.lastName]
              .filter(Boolean) // Remove null/undefined/empty values
              .join(" ") // Combine into a full name string
              .toLowerCase();
          };
  
          const itemFullName = getFullName(item);
          const patientFullName = getFullName(item.patient);
          const searchValue = value.toLowerCase().trim();
  
          return itemFullName.includes(searchValue) || patientFullName.includes(searchValue);
        }
  
        // Default text search (checks both item and item.patient)
        const fieldValue = getFieldValue(key);
        return fieldValue?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [columnFilters, data]);
  
  
  
  


  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [dateFilters, setDateFilters] = useState({
    createdAt: null,
    updatedAt: null,
    dateOfBirth: null,
  });

  const handleDateChange = (field, date) => {
    setColumnFilters((prev) => ({
      ...prev,
      [field]: date,
    }));
  };
  
  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,

    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, pagination },
  });
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Health Card Data");
    XLSX.writeFile(wb, "healthcard_data.xlsx");
  };
  return (
    <div className="md:container font-poppins mx-auto">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main={"Health Card Applications"} sub={"Patient Details"} />
        <div className="flex justify-end gap-2 py-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
          >
            Export to Excel
          </Button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {filtersArray.map((filter) =>
            filter.type === "text" || filter.type === "number" ? (
              <>   <InputField
                key={filter.id}
                label={filter.label}
                id={filter.id}
                type={filter.type}
                placeholder={`Search ${filter.label}...`}
                value={columnFilters[filter.id] || ""}
                onChange={handleFilterChange}
              /> </>
            ) : filter.type === "select" ? (
              <SelectField
                key={filter.id}
                label={filter.label}
                id={filter.id}
                value={columnFilters[filter.id] || ""}
                onChange={handleFilterChange}
                options={filter.options}
              />
            ) : filter.type === "date" ? (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-600">{filter.label}</label>
                <DatePicker
                  selected={columnFilters[filter.id]}
                  onChange={(date) => handleDateChange(filter.id, date)}
                  className="border border-gray-300 p-2 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholderText="Select Date"
                  dateFormat="yyyy-MM-dd"
                  showMonthDropdown
                  showYearDropdown
                  isClearable
                />
              </div>
            ) : null
          )}
          </div>
        )}      
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
         <div className="">
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
                    <TableRow key={row.id} className={`
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
                      No results found.
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
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Remark"
          className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[400px] overflow-y-auto mx-auto"
        >
          <h2 className="text-xl font-bold mb-4">
            {currentAction === "approve" ? "Approve Health Card" : "Add Remark"}
          </h2>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows={5}
            placeholder="Enter your remark"
          ></textarea>
          {currentAction !== "approve" && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Issues:</h3>
              {issues.map((issue) => (
                <label key={issue} className="block mb-2">
                  <input
                    type="checkbox"
                    checked={selectedIssues.includes(issue)}
                    onChange={() => toggleIssue(issue)}
                    className="mr-2"
                  />
                  {issue}
                </label>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRemark}
              className={`${
                currentAction === "approve" ? "bg-green-500" : "bg-blue-500"
              } text-white px-4 py-2 rounded`}
            >
              {loading ? (
                <span className="animate-spin">Please Wait</span>
              ) : currentAction === "approve" ? (
                "Confirm Approval"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
const getStartOfWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay()); // Set to Sunday
  return date;
};

const getStartOfMonth = () => {
  const date = new Date();
  date.setDate(1); // Set to first day of the month
  return date;
};

const getStartOfYear = () => {
  const date = new Date();
  date.setMonth(0, 1); // Set to January 1st
  return date;
};

export default HealthCardClientdata;
