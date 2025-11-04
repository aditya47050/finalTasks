"use client";
import * as XLSX from "xlsx";
import React, { useState, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import {
  DateFilter,
  InputField,
  MultiSelectDropdown,
  SelectField,
} from "@/app/components/input-selectui";
import Modal from "react-modal";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import HeadingClientMain from "@/app/components/heading";
const AllDoctorsList = ({ userdata, expertDoctorCategories }) => {
  const pageSize = 20;

  const [filters, setFilters] = useState({
    // Doctor Model Filters
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    alternatemobileno: "",
    gender: "",
    pincode: "",
    dateOfBirthFrom: "",
    dateOfBirthTo: "",
    education: "",
    totalexperienceFrom: "",
    totalexperienceTo: "",
    degreecertificate: "",
    registrationcertificate: "",
    specialitydegreecertificate: "",
    registrationdateFrom: "",
    registrationdateTo: "",
    regrenewaldateFrom: "",
    regrenewaldateTo: "",

    // Specialities & Expertise Filters
    expertCategory: [],

    // Doctor Certificate Filters
    approvalStatus: "", // pending, approved, rejected
    approvedBy: "",
    remarks: "",

    // Doctorinfo Filters
    consultationfeeFrom: "",
    consultationfeeTo: "",
    onlineappointment: "",
    homehealthcarevisit: "",
    passportphoto: "",
    profiledescription: "",
    pancardno: "",
    aadharcardno: "",
    presentaddress: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    micrCode: "",
    personalclinic: "",
    clinicinouttime: "",
    clinicconsultationfeeFrom: "",
    clinicconsultationfeeTo: "",

    // Date Filters
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
  });

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

const [isModalOpen, setIsModalOpen] = useState(false);
const [currentAction, setCurrentAction] = useState(null);
const [remark, setRemark] = useState("");
const [loading, setLoading] = useState(false);
const router = useRouter();
const [selectedIssues, setSelectedIssues] = useState([]);

const generateDoctorIssues = () => {
  // Doctor model fields
  const doctorFields = [
    'firstName', 'middleName', 'lastName', 'email', 'mobile', 
    'alternatemobileno', 'gender', 'pincode', 'dateOfBirth',
    'education', 'totalexperience', 'degreecertificate',
    'registrationcertificate', 'specialitydegreecertificate',
    'registrationdate', 'regrenewaldate'
  ];

  // Doctorinfo model fields
  const doctorInfoFields = [
    'consultationfee', 'onlineappointment', 'homehealthcarevisit',
    'passportphoto', 'profiledescription', 'pancardno', 'aadharcardno',
    'presentaddress', 'city', 'state', 'district', 'taluka',
    'bankName', 'accountNumber', 'ifscCode', 'accountType', 'micrCode',
    'personalclinic', 'clinicinouttime', 'clinicconsultationfee'
  ];

  // Generate field-based issues
  const fieldIssues = [
    ...doctorFields.map(f => `Incorrect ${f.charAt(0).toUpperCase() + f.slice(1)}`),
    ...doctorInfoFields.map(f => `Invalid ${f.charAt(0).toUpperCase() + f.slice(1)}`)
  ];

  // Add document issues
  const documentIssues = [
    'Missing Degree Certificate',
    'Missing Registration Certificate',
    'Missing Speciality Degree Certificate',
    'Document Quality Issues',
    'Expired Documents'
  ];

  // Add speciality/expertise issues
  const specialityIssues = [
    'Invalid Speciality Information',
    'Insufficient Qualifications',
    'Unverified Expertise'
  ];

  // Add general issues
  const generalIssues = [
    'Incomplete Application',
    'Verification Failed',
    'Other'
  ];

  return [
    ...fieldIssues,
    ...documentIssues,
    ...specialityIssues,
    ...generalIssues
  ];
};
const issues = generateDoctorIssues();
const toggleIssue = (issue) => {
  setSelectedIssues(prev =>
    prev.includes(issue) 
      ? prev.filter(i => i !== issue) 
      : [...prev, issue]
  );
};

const openModal = (action, doctorId) => {
  setCurrentAction(action);
  setCurrentDoctorId(doctorId); // Changed from setCurrentCardNo
  setIsModalOpen(true);
    if (action === "reject") {
    setSelectedIssues([]); 
  }
};
const closeModal = () => {
  setIsModalOpen(false);
  setRemark("");
  setSelectedIssues([]);
};

const handleSubmitRemark = async () => {
 if (currentAction === "reject" && remark.trim() === "" && selectedIssues.length === 0) {
    toast.error("Please provide a remark or select issues for rejection!");
    return;
  }

  try {
    setLoading(true);
     const fullRemark = selectedIssues.length > 0
      ? `${remark}\n\nIssues:\n- ${selectedIssues.join("\n- ")}`
      : remark;
    const response = await fetch(`/api/doctor/${currentDoctorId}/approvalstatus`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approvalStatus: currentAction === "approve" ? "APPROVED" : "REJECTED",
        remark: fullRemark.trim() || null
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update doctor status");
    }

    const result = await response.json();

    // ✅ Check if setUserdata exists (List Page) else refresh (Profile Page)
    if (typeof setUserdata === "function") {
      setUserdata(prevData =>
        prevData.map(doctor => {
          if (doctor.id === currentDoctorId) {
            return {
              ...doctor,
              approvalStatus: currentAction === "approve" ? "APPROVED" : "REJECTED",
              adminRemarks: fullRemark.trim() || null
            };
          }
          return doctor;
        })
      );
    } else {
      router.refresh();           // ✅ Refresh to reload profile page data
    }

    toast.success(`Doctor ${currentAction === "approve" ? "approved" : "rejected"} successfully!`);
    closeModal();
  } catch (error) {
    console.error("Error updating doctor:", error);
    toast.error(error.message || "Failed to update doctor status");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const filteredData = useMemo(() => {
    return userdata.filter((doctor) => {
      const createdAtDate = doctor.createdAt
        ? new Date(doctor.createdAt)
        : null;
      const updatedAtDate = doctor.updatedAt
        ? new Date(doctor.updatedAt)
        : null;

      const createdAtFromDate = filters.createdAtFrom
        ? new Date(filters.createdAtFrom)
        : null;
      const createdAtToDate = filters.createdAtTo
        ? new Date(filters.createdAtTo)
        : null;
      const updatedAtFromDate = filters.updatedAtFrom
        ? new Date(filters.updatedAtFrom)
        : null;
      const updatedAtToDate = filters.updatedAtTo
        ? new Date(filters.updatedAtTo)
        : null;

      return (
        // Doctor Filters
        (!filters.firstName ||
          doctor.firstName
            ?.toLowerCase()
            .includes(filters.firstName.toLowerCase())) &&
        (!filters.middleName ||
          doctor.middleName
            ?.toLowerCase()
            .includes(filters.middleName.toLowerCase())) &&
        (!filters.lastName ||
          doctor.lastName
            ?.toLowerCase()
            .includes(filters.lastName.toLowerCase())) &&
        (!filters.email ||
          doctor.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.mobile || doctor.mobile?.includes(filters.mobile)) &&
        (!filters.alternatemobileno ||
          doctor.alternatemobileno?.includes(filters.alternatemobileno)) &&
        (!filters.gender ||
          doctor.gender?.toLowerCase() === filters.gender.toLowerCase()) &&
        (!filters.pincode || doctor.pincode === filters.pincode) &&
        (!filters.dateOfBirthFrom ||
          (doctor.dateOfBirth &&
            doctor.dateOfBirth >= new Date(filters.dateOfBirthFrom))) &&
        (!filters.dateOfBirthTo ||
          (doctor.dateOfBirth &&
            doctor.dateOfBirth <= new Date(filters.dateOfBirthTo))) &&
        (!filters.education ||
          doctor.education
            ?.toLowerCase()
            .includes(filters.education.toLowerCase())) &&
        (!filters.totalexperienceFrom ||
          doctor.totalexperience >= parseInt(filters.totalexperienceFrom)) &&
        (!filters.totalexperienceTo ||
          doctor.totalexperience <= parseInt(filters.totalexperienceTo)) &&
        (!filters.degreecertificate || doctor.degreecertificate) &&
        (!filters.registrationcertificate || doctor.registrationcertificate) &&
        (!filters.specialitydegreecertificate ||
          doctor.specialitydegreecertificate) &&
        (!filters.registrationdateFrom ||
          (doctor.registrationdate &&
            doctor.registrationdate >=
            new Date(filters.registrationdateFrom))) &&
        (!filters.registrationdateTo ||
          (doctor.registrationdate &&
            doctor.registrationdate <= new Date(filters.registrationdateTo))) &&
        (!filters.regrenewaldateFrom ||
          (doctor.regrenewaldate &&
            doctor.regrenewaldate >= new Date(filters.regrenewaldateFrom))) &&
        (!filters.regrenewaldateTo ||
          (doctor.regrenewaldate &&
            doctor.regrenewaldate <= new Date(filters.regrenewaldateTo))) &&
        // Speciality & Expertise Filters
        (!Array.isArray(filters.expertCategory) ||
          filters.expertCategory.length === 0 ||
          filters.expertCategory.every((selectedCategory) =>
            doctor.specialities.some(
              (spec) => spec?.title && spec.title === selectedCategory
            )
          )) &&
        // Doctor Certificate Filters
        (!filters.approvalStatus ||
          doctor.DoctorCertificate?.some(
            (cert) => cert.approvalStatus === filters.approvalStatus
          )) &&
        (!filters.approvedBy ||
          doctor.DoctorCertificate?.approvedBy === filters.approvedBy) &&
        (!filters.remarks ||
          doctor.DoctorCertificate?.remarks
            ?.toLowerCase()
            .includes(filters.remarks.toLowerCase())) &&
        // Doctorinfo Filters
        (!filters.consultationfeeFrom ||
          doctor.doctorinfo?.consultationfee >=
          parseFloat(filters.consultationfeeFrom)) &&
        (!filters.consultationfeeTo ||
          doctor.doctorinfo?.consultationfee <=
          parseFloat(filters.consultationfeeTo)) &&
        (!filters.onlineappointment ||
          doctor.doctorinfo?.onlineappointment === filters.onlineappointment) &&
        (!filters.homehealthcarevisit ||
          doctor.doctorinfo?.homehealthcarevisit ===
          filters.homehealthcarevisit) &&
        (!filters.passportphoto || doctor.doctorinfo?.passportphoto) &&
        (!filters.profiledescription ||
          doctor.doctorinfo?.profiledescription
            ?.toLowerCase()
            .includes(filters.profiledescription.toLowerCase())) &&
        (!filters.pancardno ||
          doctor.doctorinfo?.pancardno === filters.pancardno) &&
        (!filters.aadharcardno ||
          doctor.doctorinfo?.aadharcardno === filters.aadharcardno) &&
        (!filters.presentaddress ||
          doctor.doctorinfo?.presentaddress
            ?.toLowerCase()
            .includes(filters.presentaddress.toLowerCase())) &&
        (!filters.city ||
          doctor.doctorinfo?.city
            ?.toLowerCase()
            .includes(filters.city.toLowerCase())) &&
        (!filters.state ||
          doctor.doctorinfo?.state
            ?.toLowerCase()
            .includes(filters.state.toLowerCase())) &&
        (!filters.district ||
          doctor.doctorinfo?.district
            ?.toLowerCase()
            .includes(filters.district.toLowerCase())) &&
        (!filters.taluka ||
          doctor.doctorinfo?.taluka
            ?.toLowerCase()
            .includes(filters.taluka.toLowerCase())) &&
        (!filters.bankName ||
          doctor.doctorinfo?.bankName
            ?.toLowerCase()
            .includes(filters.bankName.toLowerCase())) &&
        (!filters.accountNumber ||
          doctor.doctorinfo?.accountNumber === filters.accountNumber) &&
        (!filters.ifscCode ||
          doctor.doctorinfo?.ifscCode === filters.ifscCode) &&
        (!filters.accountType ||
          doctor.doctorinfo?.accountType?.toLowerCase() ===
          filters.accountType.toLowerCase()) &&
        (!filters.micrCode ||
          doctor.doctorinfo?.micrCode === filters.micrCode) &&
        (!filters.personalclinic ||
          doctor.doctorinfo?.personalclinic === filters.personalclinic) &&
        (!filters.clinicinouttime ||
          doctor.doctorinfo?.clinicinouttime === filters.clinicinouttime) &&
        (!filters.clinicconsultationfeeFrom ||
          doctor.doctorinfo?.clinicconsultationfee >=
          parseFloat(filters.clinicconsultationfeeFrom)) &&
        (!filters.clinicconsultationfeeTo ||
          doctor.doctorinfo?.clinicconsultationfee <=
          parseFloat(filters.clinicconsultationfeeTo)) &&
        // Date Filters
        (!createdAtFromDate ||
          (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate ||
          (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate ||
          (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate ||
          (updatedAtDate && updatedAtDate <= updatedAtToDate))
      );
    });
  }, [filters, userdata]);
  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value, // Update state dynamically
    }));
  };

  const handleViewProfile = (id) => {
    window.location.href = `/superprofile/doctor/${id}`;
  };

  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "cardNo",
      //   header: "Card No",
      //   cell: ({ row }) => row.original.DoctorCertificate?.cardNo || "N/A",
      // },

      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "gender",
        header: "Gender",
      },
      {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        cell: ({ row }) => formatDate(row.original.dateOfBirth),
      },
      {
        accessorKey: "mobile",
        header: "Mobile Number",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "id",
        header: "Full Details",
        cell: ({ row }) => (
          <Button
            className="px-2 py-1 border border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-500 hover:text-white"
            onClick={() => handleViewProfile(row.getValue("id"))}
          >
            View Profile
          </Button>
        ),
      },
      {
        accessorKey: "DoctorCertificate.approvalStatus",
        header: "Approval Status",
        cell: ({ row }) => {
          const certs = row.original.DoctorCertificate;
          const status = certs?.length > 0
            ? (certs[0].approvalStatus || "PENDING").toLowerCase()
            : "pending";

          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === "approved"
                ? "bg-emerald-100 text-emerald-800"
                : status === "rejected"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
              {status}
            </span>
          );
        },
      },
{
  accessorKey: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const approvalStatus = row.original.approvalStatus?.toLowerCase() || "pending";
    const doctorId = row.original.id;

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => openModal("approve", doctorId)}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Approve
        </button>
        
        
          <button
            onClick={() => openModal("reject", doctorId)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Reject
          </button>
        
      </div>
    );
  },
}
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: false,
  });
  const expertCategoryOptions = expertDoctorCategories.map((category) => ({
    value: category.title, // Use title as value
    label: category.title, // Display title in dropdown
  }));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleMultiCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let updatedCategories = [...filters.expertCategory];

    if (checked) {
      updatedCategories.push(value); // Add if checked
    } else {
      updatedCategories = updatedCategories.filter((item) => item !== value); // Remove if unchecked
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      expertCategory: updatedCategories,
    }));
  };
  const handleExpertCategoryChange = (selectedCategories) => {
    setFilters((prev) => ({
      ...prev,
      expertCategory: Array.isArray(selectedCategories)
        ? selectedCategories
        : [],
    }));
  };

  const [showFilters, setShowFilters] = useState(false);
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleExportToExcel = (userdata) => {

    // Check if userdata is valid
    if (!Array.isArray(userdata) || userdata.length === 0) {
      console.error("No valid data available to export.");
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(userdata);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "User Data");
      XLSX.writeFile(wb, "Doctorsdata.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };


  // Example button to trigger export
  <button
    onClick={() => handleExportToExcel(userdata)}
    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
  >
    Export Full Data to Excel
  </button>;


  // Button to trigger export
  <button
    onClick={() => handleExportToExcel(userdata)}
    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
  >
    Export Full Data to Excel
  </button>;

  const [selectedValues, setSelectedValues] = useState(() => []);


  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main={"All Doctors List"} sub={"Full Details"} />
        <div className="flex justify-end py-4 gap-2 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={() => handleExportToExcel(filteredData)}
            className="bg-green-400 rounded-xl text-white px-4 py-2  focus:outline-none hover:bg-green-400 transition"
          >
            Export to Excel
          </button>
        </div>
        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Name Fields */}

            <MultiSelectDropdown
              label="Expert Category"
              options={expertCategoryOptions}
              selectedValues={filters.expertCategory}
              onChange={handleExpertCategoryChange}
            />
            {/* <p className="mt-4">Selected Categories: {filters.expertCategory.join(", ")}</p> */}

            <InputField
              label="First Name"
              id="firstName"
              type="text"
              placeholder="First Name"
              value={filters.firstName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Middle Name"
              id="middleName"
              type="text"
              placeholder="Middle Name"
              value={filters.middleName}
              onChange={handleFilterChange}
            />
            <InputField
              label="Last Name"
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={filters.lastName}
              onChange={handleFilterChange}
            />

            {/* Contact Details */}
            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="Email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <InputField
              label="Mobile"
              id="mobile"
              type="text"
              placeholder="Mobile Number"
              value={filters.mobile}
              onChange={handleFilterChange}
            />

            {/* Personal Details */}
            <SelectField
              label="Gender"
              id="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
            <InputField
              label="Pincode"
              id="pincode"
              type="text"
              placeholder="Pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Date of Birth From"
              id="dateOfBirthFrom"
              selected={filters.dateOfBirthFrom}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Date of Birth To"
              id="dateOfBirthTo"
              selected={filters.dateOfBirthTo}
              onChange={handleFilterChange}
            />

            {/* Professional Details */}
            <InputField
              label="Education"
              id="education"
              type="text"
              placeholder="Education"
              value={filters.education}
              onChange={handleFilterChange}
            />
            <InputField
              label="Min Experience (Years)"
              id="totalexperienceFrom"
              type="number"
              placeholder="Min Experience"
              value={filters.totalexperienceFrom}
              onChange={handleFilterChange}
            />
            <InputField
              label="Max Experience (Years)"
              id="totalexperienceTo"
              type="number"
              placeholder="Max Experience"
              value={filters.totalexperienceTo}
              onChange={handleFilterChange}
            />

            <SelectField
              label="Approval Status"
              id="approvalStatus"
              value={filters.approvalStatus}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
                { value: "SUBMITED", label: "Submited" },
              ]}
            />

            {/* Registration & Renewal Dates */}
            <DateFilter
              label="Registration Date From"
              id="registrationdateFrom"
              selected={filters.registrationdateFrom}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Registration Date To"
              id="registrationdateTo"
              selected={filters.registrationdateTo}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Renewal Date From"
              id="regrenewaldateFrom"
              selected={filters.regrenewaldateFrom}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Renewal Date To"
              id="regrenewaldateTo"
              selected={filters.regrenewaldateTo}
              onChange={handleFilterChange}
            />

            {/* Doctor Info */}
            <InputField
              label="Consultation Fee (Min)"
              id="consultationfeeFrom"
              type="number"
              placeholder="Min Fee"
              value={filters.consultationfeeFrom}
              onChange={handleFilterChange}
            />
            <InputField
              label="Consultation Fee (Max)"
              id="consultationfeeTo"
              type="number"
              placeholder="Max Fee"
              value={filters.consultationfeeTo}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Online Appointment"
              id="onlineappointment"
              value={filters.onlineappointment}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />

            {/* Location Filters */}
            <InputField
              label="City"
              id="city"
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <InputField
              label="State"
              id="state"
              type="text"
              placeholder="State"
              value={filters.state}
              onChange={handleFilterChange}
            />
            <InputField
              label="District"
              id="district"
              type="text"
              placeholder="District"
              value={filters.district}
              onChange={handleFilterChange}
            />
            <InputField
              label="Taluka"
              id="taluka"
              type="text"
              placeholder="Taluka"
              value={filters.taluka}
              onChange={handleFilterChange}
            />

            {/* Banking Details */}
            <SelectField
              label="Bank Name"
              id="bankName"
              value={filters.accountType}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All Banks" },
                { value: "state_bank_of_india", label: "State Bank of India" },
                { value: "bank_of_baroda", label: "Bank of Baroda" },
                {
                  value: "punjab_national_bank",
                  label: "Punjab National Bank",
                },
                { value: "canara_bank", label: "Canara Bank" },
                { value: "union_bank_of_india", label: "Union Bank of India" },
                { value: "bank_of_india", label: "Bank of India" },
                { value: "indian_bank", label: "Indian Bank" },
                {
                  value: "central_bank_of_india",
                  label: "Central Bank of India",
                },
                {
                  value: "indian_overseas_bank",
                  label: "Indian Overseas Bank",
                },
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
                {
                  value: "standard_chartered_bank",
                  label: "Standard Chartered Bank",
                },
                { value: "hsbc", label: "HSBC" },
                { value: "deutsche_bank", label: "Deutsche Bank" },
                { value: "dbs_bank", label: "DBS Bank" },
                {
                  value: "andhra_pradesh_grameena_vikas_bank",
                  label: "Andhra Pradesh Grameena Vikas Bank",
                },
                { value: "baroda_up_bank", label: "Baroda UP Bank" },
                { value: "kerala_gramin_bank", label: "Kerala Gramin Bank" },
                {
                  value: "karnataka_gramin_bank",
                  label: "Karnataka Gramin Bank",
                },
                { value: "punjab_gramin_bank", label: "Punjab Gramin Bank" },
              ]}
            />

            <SelectField
              label="Account Type"
              id="accountType"
              value={filters.accountType}
              onChange={handleFilterChange}
              options={[
                { value: "", label: "All" },
                { value: "savings", label: "Savings" },
                { value: "current", label: "Current" },
              ]}
            />

            {/* Date Filters */}
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
            <DateFilter
              label="Updated At From"
              id="updatedAtFrom"
              selected={filters.updatedAtFrom}
              onChange={handleFilterChange}
            />
            <DateFilter
              label="Updated At To"
              id="updatedAtTo"
              selected={filters.updatedAtTo}
              onChange={handleFilterChange}
            />
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
    ariaHideApp={false}
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Doctor Approval"
    className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[400px] overflow-y-auto mx-auto"
  >
    <h2 className="text-xl font-bold mb-4">
      {currentAction === "approve" 
        ? "Approve Doctor" 
        : "Reject Doctor"}
    </h2>

    <textarea
      value={remark}
      onChange={(e) => setRemark(e.target.value)}
      className="w-full p-2 border rounded mb-4"
      rows={5}
      placeholder={
        currentAction === "approve"
          ? "Enter approval remarks (optional)"
          : "Please specify the reason for rejection"
      }
    ></textarea>
    {currentAction === "reject" && (
      <div className="mb-4 max-h-60 overflow-y-auto">
        <h3 className="font-semibold mb-2">Select Issues:</h3>
        <div className="grid grid-cols-1 gap-2">
          {issues.map((issue) => (
            <label key={issue} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedIssues.includes(issue)}
                onChange={() => toggleIssue(issue)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{issue}</span>
            </label>
          ))}
        </div>
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
          currentAction === "approve" ? "bg-green-500" : "bg-red-500"
        } text-white px-4 py-2 rounded`}
        disabled={loading}
      >
        {loading ? (
          "Processing..."
        ) : currentAction === "approve" ? (
          "Confirm Approval"
        ) : (
          "Confirm Rejection"
        )}
      </button>
    </div>
  </Modal>
      </div>
    </div>
  );
};

export default AllDoctorsList;
