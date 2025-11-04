"use client"
import { useState, useMemo } from "react"
import * as XLSX from "xlsx"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateFilter, InputField, SelectField } from "@/app/components/input-selectui"
import Image from "next/image"
import Modal from "react-modal"
import { toast } from "react-toastify"
import HeadingClientMain from "@/app/components/heading";
const AllAmbulancesList = ({ ambulanceData, states, dist, taluka }) => {
  const pageSize = 10

  const [ambulanceList, setAmbulanceList] = useState(ambulanceData)
  const [selectedIssues, setSelectedIssues] = useState([])

  const [filters, setFilters] = useState({
    email: "",
    mobile: "",
    pincode: "",
    category: "",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
    ownerfirstname: "",
    ownerlastname: "",
    city: "",
    state: "all",
    district: "all",
    taluka: "all",
    approvalStatus: "all",
    totalambulance: "",
    vehicleType: "",
    vehicleCategory: "",
    driverName: "",
    hospitalName: "",
  })

  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState(null)
  const [currentAmbulanceId, setCurrentAmbulanceId] = useState(null)
  const [remark, setRemark] = useState("")
  const [loading, setLoading] = useState(false)

  const generateAmbulanceIssues = () => {
    const ambulanceFields = [
      "email",
      "mobile",
      "pincode",
      "category",
      "ownerfirstname",
      "ownerlastname",
      "ownermiddlename",
      "dateofbirth",
      "gender",
      "alternatemobileno",
      "owneraadharcardno",
      "ownerpanno",
    ]

    const ambulanceHspFields = [
      "hspregname",
      "totalambulance",
      "presentaddress",
      "city",
      "state",
      "district",
      "taluka",
      "bankname",
      "accountnumber",
      "ifsccode",
      "inhousedoctor",
      "hspdescription",
    ]

    const vehicleFields = [
      "ambulancemodel",
      "ambulancecharges",
      "ambulanceareapincode",
      "ambulanceregdate",
      "ambulancercno",
      "ambulancetype",
      "ambulancecategory",
      "facilities",
      "puc",
      "insurance",
    ]

    const driverFields = [
      "firstname",
      "lastname",
      "aadharcardno",
      "panno",
      "drivinglicence",
      "mobile",
      "dateofbirth",
      "gender",
      "email",
      "bloodgroup",
      "firstaidtraining",
    ]

    const fieldIssues = [
      ...ambulanceFields.map((f) => `Incorrect ${f.charAt(0).toUpperCase() + f.slice(1)}`),
      ...ambulanceHspFields.map((f) => `Invalid ${f.charAt(0).toUpperCase() + f.slice(1)}`),
      ...vehicleFields.map((f) => `Invalid Vehicle ${f.charAt(0).toUpperCase() + f.slice(1)}`),
      ...driverFields.map((f) => `Invalid Driver ${f.charAt(0).toUpperCase() + f.slice(1)}`),
    ]

    const documentIssues = [
      "Missing Owner Documents",
      "Invalid Aadhar Card",
      "Invalid PAN Card",
      "Missing Vehicle Registration",
      "Invalid Driving License",
      "Missing PUC Certificate",
      "Invalid Insurance Documents",
      "Document Quality Issues",
      "Expired Documents",
    ]

    const vehicleIssues = [
      "Invalid Vehicle Registration",
      "Missing Vehicle Images",
      "Incomplete Vehicle Details",
      "Invalid Vehicle Type",
      "Missing Safety Equipment",
      "Vehicle Not Roadworthy",
    ]

    const generalIssues = ["Incomplete Application", "Verification Failed", "Background Check Failed", "Other"]

    return [...fieldIssues, ...documentIssues, ...vehicleIssues, ...generalIssues]
  }

  const issues = generateAmbulanceIssues()

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]))
  }

  const openModal = (action, ambulanceId) => {
    setCurrentAction(action)
    setCurrentAmbulanceId(ambulanceId)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setRemark("")
    setSelectedIssues([])
  }

  const handleSubmitRemark = async () => {
    if (currentAction === "reject" && remark.trim() === "" && selectedIssues.length === 0) {
      toast.error("Please provide a remark or select issues for rejection!")
      return
    }

    try {
      setLoading(true)
      const fullRemark = selectedIssues.length > 0 ? `${remark}\n\nIssues:\n- ${selectedIssues.join("\n- ")}` : remark

      const response = await fetch(`/api/ambulance/${currentAmbulanceId}/approval`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: currentAction,
          remark: fullRemark.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update ambulance status")
      }

      const result = await response.json()

      setAmbulanceList((prevData) =>
        prevData.map((ambulance) =>
          ambulance.id === currentAmbulanceId
            ? {
                ...ambulance,
                approvalStatus: result.data.approvalStatus.toLowerCase(),
                adminRemarks: fullRemark.trim() || null,
              }
            : ambulance,
        ),
      )

      toast.success(`Ambulance ${currentAction === "approve" ? "approved" : "rejected"} successfully!`)
      closeModal()
    } catch (error) {
      console.error("Error updating ambulance:", error)
      toast.error(error.message || "Failed to update ambulance status")
    } finally {
      setLoading(false)
    }
  }

  const filteredData = useMemo(() => {
    return ambulanceList.filter((ambulance) => {
      const createdAtDate = ambulance.createdAt ? new Date(ambulance.createdAt) : null
      const updatedAtDate = ambulance.updatedAt ? new Date(ambulance.updatedAt) : null
      const createdAtFromDate = filters.createdAtFrom ? new Date(filters.createdAtFrom) : null
      const createdAtToDate = filters.createdAtTo ? new Date(filters.createdAtTo) : null
      const updatedAtFromDate = filters.updatedAtFrom ? new Date(filters.updatedAtFrom) : null
      const updatedAtToDate = filters.updatedAtTo ? new Date(filters.updatedAtTo) : null

      return (
        (!filters.email || (ambulance.email && ambulance.email.toLowerCase().includes(filters.email.toLowerCase()))) &&
        (!filters.mobile || ambulance.mobile.includes(filters.mobile)) &&
        (!filters.pincode || ambulance.pincode === filters.pincode) &&
        (!filters.category || ambulance.category === filters.category) &&
        (!createdAtFromDate || (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate || (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate || (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate || (updatedAtDate && updatedAtDate <= updatedAtToDate)) &&
        (!filters.ownerfirstname ||
          (ambulance.ownerfirstname &&
            ambulance.ownerfirstname.toLowerCase().includes(filters.ownerfirstname.toLowerCase()))) &&
        (!filters.ownerlastname ||
          (ambulance.ownerlastname &&
            ambulance.ownerlastname.toLowerCase().includes(filters.ownerlastname.toLowerCase()))) &&
        (!filters.city ||
          (ambulance.AmbulanceHsp?.city &&
            ambulance.AmbulanceHsp.city.toLowerCase().includes(filters.city.toLowerCase()))) &&
        (filters.state === "all" ||
          (ambulance.AmbulanceHsp?.state &&
            ambulance.AmbulanceHsp.state.toLowerCase().includes(filters.state.toLowerCase()))) &&
        (filters.district === "all" ||
          (ambulance.AmbulanceHsp?.district &&
            ambulance.AmbulanceHsp.district.toLowerCase().includes(filters.district.toLowerCase()))) &&
        (filters.taluka === "all" ||
          (ambulance.AmbulanceHsp?.taluka &&
            ambulance.AmbulanceHsp.taluka.toLowerCase().includes(filters.taluka.toLowerCase()))) &&
        (filters.approvalStatus === "all" ||
          ambulance.approvalStatus?.toLowerCase() === filters.approvalStatus.toLowerCase()) &&
        (!filters.totalambulance ||
          (ambulance.AmbulanceHsp?.totalambulance &&
            ambulance.AmbulanceHsp.totalambulance.includes(filters.totalambulance))) &&
        (!filters.vehicleType ||
          ambulance.AmbulanceVaichicle?.some(
            (vehicle) =>
              vehicle.ambulancetype && vehicle.ambulancetype.toLowerCase().includes(filters.vehicleType.toLowerCase()),
          )) &&
        (!filters.vehicleCategory ||
          ambulance.AmbulanceVaichicle?.some(
            (vehicle) =>
              vehicle.ambulancecategory &&
              vehicle.ambulancecategory.toLowerCase().includes(filters.vehicleCategory.toLowerCase()),
          )) &&
        (!filters.driverName ||
          ambulance.AmbulanceDriver?.some(
            (driver) =>
              (driver.firstname && driver.firstname.toLowerCase().includes(filters.driverName.toLowerCase())) ||
              (driver.lastname && driver.lastname.toLowerCase().includes(filters.driverName.toLowerCase())),
          )) &&
        (!filters.hospitalName ||
          ambulance.HospitalAmbulance?.some(
            (ha) =>
              ha.hospital?.hspInfo?.regname &&
              ha.hospital.hspInfo.regname.toLowerCase().includes(filters.hospitalName.toLowerCase()),
          ))
      )
    })
  }, [filters, ambulanceList])

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }))
  }

  const handleViewProfile = (id) => {
    window.location.href = `/superprofile/ambulance/${id}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "passportphoto",
        header: "Photo",
        cell: ({ row }) => (
          <div className="w-12 h-12 overflow-hidden rounded-full">
            <Image
              src={row.original.passportphoto || "/placeholder.svg?height=48&width=48"}
              alt="Owner Photo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        ),
      },
      {
        accessorKey: "ownerfirstname",
        header: "Owner Name",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.ownerfirstname} {row.original.ownerlastname}
            </p>
            <p className="text-xs text-muted-foreground">{row.original.category}</p>
          </div>
        ),
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobile", header: "Mobile" },
      {
        accessorKey: "AmbulanceHsp.city",
        header: "Location",
        cell: ({ row }) => (
          <div>
            <p>{row.original.AmbulanceHsp?.city}</p>
            <p className="text-xs text-muted-foreground">{row.original.pincode}</p>
          </div>
        ),
      },
      {
        accessorKey: "AmbulanceVaichicle",
        header: "Vehicles",
        cell: ({ row }) => (
          <div className="text-center">
            <p className="font-medium">{row.original.AmbulanceVaichicle?.length || 0}</p>
            <p className="text-xs text-muted-foreground">vehicles</p>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: "approvalStatus",
        header: "Approval Status",
        cell: ({ row }) => {
          const status = (row.getValue("approvalStatus") || "pending").toLowerCase()
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : status === "rejected"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {status}
            </span>
          )
        },
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
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const approvalStatus = row.original.approvalStatus?.toLowerCase()

          return (
            <div className="flex space-x-2">
              <button
                onClick={() => openModal("approve", row.original.id)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Approve
              </button>

                <button
                  onClick={() => openModal("reject", row.original.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Reject
                </button>
            </div>
          )
        },
      },
    ],
    [],
  )

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
  })

  const handleExportToExcel = (ambulanceData) => {
    if (!Array.isArray(ambulanceData) || ambulanceData.length === 0) {
      console.error("No valid data available to export.")
      return
    }

    try {
      const ws = XLSX.utils.json_to_sheet(ambulanceData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Ambulance Data")
      XLSX.writeFile(wb, "AmbulancesData.xlsx")
    } catch (error) {
      console.error("Error exporting to Excel:", error)
    }
  }

  const [showFilters, setShowFilters] = useState(false)
  const toggleFilters = () => {
    setShowFilters((prev) => !prev)
  }

  return (
    <div className="md:container shadow-xl mx-auto font-poppins">
      <div className="overflow-x-auto xs:px-2 min-[1000px]:px-0 min-[1100px]:px-[32px] container mx-auto min-[1000px]:w-[700px] min-[1100px]:w-[900px] xl:w-[1000px] xlg:w-[1200px] w-[350px] md:w-[700px] bg-white">
        <HeadingClientMain main={"All Ambulance List"} sub={"Full Details"} />
        <div className="flex justify-end py-4 gap-2 items-end">
          <button
            onClick={toggleFilters}
            className="bg-blue-500 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-blue-600 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            onClick={() => handleExportToExcel(filteredData)}
            className="bg-green-400 rounded-xl text-white px-4 py-2 focus:outline-none hover:bg-green-400 transition"
          >
            Export to Excel
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
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
            <InputField
              label="Pincode"
              id="pincode"
              type="text"
              placeholder="Pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
            />
            <InputField
              label="Category"
              id="category"
              type="text"
              placeholder="Category"
              value={filters.category}
              onChange={handleFilterChange}
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
            <InputField
              label="Owner First Name"
              id="ownerfirstname"
              type="text"
              placeholder="Owner First Name"
              value={filters.ownerfirstname}
              onChange={handleFilterChange}
            />
            <InputField
              label="Owner Last Name"
              id="ownerlastname"
              type="text"
              placeholder="Owner Last Name"
              value={filters.ownerlastname}
              onChange={handleFilterChange}
            />
            <InputField
              label="City"
              id="city"
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <SelectField
              label="State"
              id="state"
              options={[
                { label: "All", value: "all" },
                ...states.map((state) => ({
                  label: state.stateName,
                  value: state.stateName,
                })),
              ]}
              value={filters.state}
              onChange={handleFilterChange}
            />
            <SelectField
              label="District"
              id="district"
              options={[
                { label: "All", value: "all" },
                ...dist.map((district) => ({
                  label: district.district,
                  value: district.district,
                })),
              ]}
              value={filters.district}
              onChange={handleFilterChange}
            />
            <SelectField
              label="Approval Status"
              id="approvalStatus"
              options={[
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ]}
              value={filters.approvalStatus}
              onChange={handleFilterChange}
            />
            <InputField
              label="Vehicle Type"
              id="vehicleType"
              type="text"
              placeholder="Vehicle Type"
              value={filters.vehicleType}
              onChange={handleFilterChange}
            />
            <InputField
              label="Driver Name"
              id="driverName"
              type="text"
              placeholder="Driver Name"
              value={filters.driverName}
              onChange={handleFilterChange}
            />
          </div>
        )}
        {/* Table */}
        <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
            <div className="">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="border border-gray-200 py-4 px-6 text-left font-semibold text-gray-900 whitespace-nowrap">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between py-4">
              <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <span className="rounded-full border-2 px-3 border-[#243460]">Previous</span>
              </Button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <span className="rounded-full border-2 px-3 border-[#243460]">Next</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Approval Modal */}
        <Modal
          ariaHideApp={false}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Ambulance Approval"
          className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[500px] overflow-y-auto mx-auto"
        >
          <h2 className="text-xl font-bold mb-4">
            {currentAction === "approve" ? "Approve Ambulance" : "Reject Ambulance"}
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
                    <span className="text-sm">{issue}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">
              Cancel
            </button>
            <button
              onClick={handleSubmitRemark}
              className={`${currentAction === "approve" ? "bg-green-500" : "bg-red-500"} text-white px-4 py-2 rounded`}
              disabled={loading}
            >
              {loading ? "Processing..." : currentAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default AllAmbulancesList
