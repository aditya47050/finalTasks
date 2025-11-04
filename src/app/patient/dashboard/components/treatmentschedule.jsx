"use client";
import React, { useMemo, useState } from "react";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  CheckCircle,
  XCircle,
  ExternalLink
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { SelectField, DateFilter } from "@/app/components/input-selectui";

const ITEMS_PER_PAGE = 3;

// Status icons configuration
const statusIcons = {
  APPROVED: <CheckCircle className="w-4 h-4 text-green-500" />,
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-blue-500" />
};

const statusColors = {
  APPROVED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800"
};
  const categories = [
    {
      "Sr No": 1,
      Category: "Bone / Orthopedics",
      Services: [
        { Name: "Small Bone Fracture Procedure Study", Type: "Surgery" },
        { Name: "Big Bone Fracture Surgery", Type: "Surgery" },
        { Name: "Carpal Tunnel Syndrome", Type: "Surgery" },
        { Name: "ACL Tear", Type: "Surgery" },
        { Name: "Spine Surgery", Type: "Surgery" },
        { Name: "Knee Replacement", Type: "Surgery" },
        { Name: "Hip Replacement", Type: "Surgery" },
        { Name: "Physical Therapy", Type: "Treatment" },
        { Name: "Shoulder Dislocation", Type: "Treatment" },
        { Name: "Tendonitis", Type: "Treatment" },
        { Name: "Ligament Tear", Type: "Treatment" },
        { Name: "Sprains and Strains", Type: "Treatment" },
        { Name: "Frozen Shoulder", Type: "Treatment" },
        { Name: "Tennis Elbow", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 2,
      Category: "Gynecology",
      Services: [
        { Name: "Vaginal Cyst", Type: "Surgery" },
        { Name: "Hymenoplasty", Type: "Surgery" },
        { Name: "Ovarian Cyst", Type: "Surgery" },
        { Name: "Hysterectomy", Type: "Surgery" },
        { Name: "Vaginoplasty", Type: "Surgery" },
        { Name: "Labiaplasty", Type: "Surgery" },
        { Name: "Uterus Removal", Type: "Surgery" },
        { Name: "Vaginal Wart Removal", Type: "Treatment" },
        { Name: "Bartholin Cyst", Type: "Treatment" },
        { Name: "PCOD / PCOS Treatment", Type: "Treatment" },
        { Name: "Loose Vagina Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 3,
      Category: "Mother & Child Care",
      Services: [
        { Name: "Normal Delivery", Type: "Surgery" },
        { Name: "C - Section Delivery", Type: "Surgery" },
        { Name: "Family Planning / Tubectomy", Type: "Surgery" },
        { Name: "Abortion", Type: "Surgery" },
        { Name: "Fallopian Tube Surgery", Type: "Surgery" },
        { Name: "Fibroids", Type: "Surgery" },
        { Name: "Pregnancy Care", Type: "Treatment" },
        { Name: "Miscarriage", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 4,
      Category: "IVF",
      Services: [
        { Name: "IUI", Type: "Surgery" },
        { Name: "ICSI", Type: "Surgery" },
        { Name: "In Vitro Fertilisation (IVF)", Type: "Surgery" },
        { Name: "Blastocyst Culture and Transfer", Type: "Surgery" },
        { Name: "IVF-ICSI", Type: "Surgery" },
        { Name: "Egg Donor IVF-ICSI", Type: "Surgery" },
        { Name: "IVF-ICSI with PESA/TESA", Type: "Surgery" },
        { Name: "T.D.I. (donor)", Type: "Surgery" },
        { Name: "Laser Assisted Hatching", Type: "Surgery" },
        { Name: "Donor Sperm", Type: "Surgery" },
        { Name: "Embryo Freezing", Type: "Surgery" },
        {
          Name: "Cryopreservation for Embryo – per year or part thereof",
          Type: "Surgery",
        },
        { Name: "Sperm Freezing", Type: "Surgery" },
        { Name: "Sperm Freezing for IVF cycle", Type: "Surgery" },
        {
          Name: "Cryopreservation for Sperm – per year or part thereof",
          Type: "Surgery",
        },
        { Name: "Embryo (self) Thaw and Transfer", Type: "Surgery" },
        { Name: "Donor Embryo Transfer", Type: "Surgery" },
        { Name: "Semen Analysis", Type: "Surgery" },
        { Name: "Quality Semen Analysis", Type: "Surgery" },
        { Name: "Endometrial Biopsy (Lab extra)", Type: "Surgery" },
        { Name: "Cyst Aspiration", Type: "Surgery" },
        { Name: "Dilatation", Type: "Surgery" },
        { Name: "PESA/TESA", Type: "Surgery" },
      ],
    },
    {
      "Sr No": 5,
      Category: "Proctology / Lower Body / General",
      Services: [
        { Name: "Piles Surgery", Type: "Surgery" },
        { Name: "Anal Fistula", Type: "Surgery" },
        { Name: "Anal Fissure", Type: "Surgery" },
        { Name: "Pilonidal Sinus", Type: "Surgery" },
        { Name: "Piles Treatment", Type: "Treatment" },
        { Name: "Fistula Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 6,
      Category: "Abdomen",
      Services: [
        { Name: "Resection (Pancreas)", Type: "Surgery" },
        { Name: "Laparotomy (Small Intestine)", Type: "Surgery" },
        { Name: "Cholecystectomy (Large Intestine)", Type: "Surgery" },
        {
          Name: "Abdominoplasty / Tummy Tuck Surgery (Appendix) / Appendectomy",
          Type: "Surgery",
        },
      ],
    },
    {
      "Sr No": 7,
      Category: "Laparoscopy / Lower Body / General",
      Services: [
        { Name: "Hernia Surgery", Type: "Surgery" },
        { Name: "Gallstone Surgery", Type: "Surgery" },
        { Name: "Inguinal Hernia Surgery", Type: "Surgery" },
        { Name: "Umbilical Hernia Surgery", Type: "Surgery" },
        { Name: "Rectal Prolapse Surgery", Type: "Surgery" },
        { Name: "Appendicitis Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 8,
      Category: "Urology / Kidney",
      Services: [
        { Name: "Kidney Stones (PCNL / URSL) Surgery", Type: "Surgery" },
        { Name: "Hydrocele", Type: "Surgery" },
        { Name: "Phimosis", Type: "Surgery" },
        { Name: "Kidney Resection", Type: "Surgery" },
        { Name: "Ureter Blockage", Type: "Surgery" },
        { Name: "Kidney Transplant", Type: "Surgery" },
        { Name: "Cystoscopy", Type: "Treatment" },
        { Name: "Prostate Biopsy", Type: "Treatment" },
        { Name: "Dialysis", Type: "Treatment" },
        { Name: "Central Line", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 9,
      Category: "Vascular / General",
      Services: [
        { Name: "Deep Vein Thrombosis Surgery", Type: "Surgery" },
        { Name: "Varicose Veins Surgery", Type: "Surgery" },
        { Name: "Varicocele Surgery", Type: "Surgery" },
        { Name: "Uterine Fibroids Surgery", Type: "Surgery" },
        { Name: "Diabetic Foot Ulcer Surgery", Type: "Surgery" },
        { Name: "Obesity / Diet / Fibromuscular Dysplasia", Type: "Treatment" },
        { Name: "Blood Pressure / Thinners / Blood Clot", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 10,
      Category: "Aesthetic / Skin",
      Services: [
        { Name: "Gynecomastia (Man Boobs)", Type: "Surgery" },
        { Name: "Hair Transplant", Type: "Surgery" },
        { Name: "Liposuction", Type: "Surgery" },
        { Name: "Breast Surgery", Type: "Surgery" },
        { Name: "Lipoma", Type: "Surgery" },
        { Name: "Breast Augmentation", Type: "Surgery" },
        { Name: "Breast Reduction", Type: "Surgery" },
        { Name: "Hydrafacial", Type: "Treatment" },
        { Name: "Laser Toning", Type: "Treatment" },
        { Name: "Carbon Laser Peel", Type: "Treatment" },
        { Name: "Injectable Skin Boosters", Type: "Treatment" },
        { Name: "Chemical Peel", Type: "Treatment" },
        { Name: "Dermal Fillers", Type: "Treatment" },
        { Name: "Botox", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 11,
      Category: "Ophthalmology / Eye",
      Services: [
        { Name: "Eye Surgery", Type: "Surgery" },
        { Name: "Glaucoma", Type: "Surgery" },
        { Name: "Squint", Type: "Surgery" },
        { Name: "Phaco", Type: "Surgery" },
        { Name: "Cornea", Type: "Surgery" },
        { Name: "Cataract", Type: "Surgery" },
        { Name: "Lasik Surgery", Type: "Surgery" },
        { Name: "Diabetic Retinopathy", Type: "Surgery" },
        { Name: "Retinal Detachment", Type: "Surgery" },
        { Name: "Retinopathy Prematurity", Type: "Surgery" },
        { Name: "Macular Edema", Type: "Surgery" },
        { Name: "Traumatic Cataract", Type: "Surgery" },
        { Name: "Macular Hole", Type: "Surgery" },
        { Name: "Posterior Subcapsular Cataract", Type: "Surgery" },
        { Name: "Rosette Cataract", Type: "Surgery" },
        { Name: "Congenital Glaucoma", Type: "Surgery" },
      ],
    },
    {
      "Sr No": 12,
      Category: "Dental",
      Services: [
        { Name: "Dental Implant / Replacement Surgery", Type: "Surgery" },
        { Name: "Inner Flap Surgery", Type: "Surgery" },
        { Name: "Dentures", Type: "Surgery" },
        { Name: "Overdentures", Type: "Surgery" },
        { Name: "Teeth Braces Treatment", Type: "Treatment" },
        { Name: "Root Canal Treatment", Type: "Treatment" },
        { Name: "Teeth Cleaning", Type: "Treatment" },
        { Name: "Dental Check-up", Type: "Treatment" },
        { Name: "Teeth Scaling and Polishing", Type: "Treatment" },
        { Name: "Teeth Whitening and Bleaching", Type: "Treatment" },
        { Name: "Dental X-Ray", Type: "Treatment" },
        { Name: "Dental OPG", Type: "Treatment" },
        { Name: "Oral Health Guide", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 13,
      Category: "ENT",
      Services: [
        { Name: "Adenoidectomy", Type: "Surgery" },
        { Name: "Tonsillectomy / Tonsil Surgery", Type: "Surgery" },
        { Name: "Septoplasty", Type: "Surgery" },
        { Name: "Ear Surgery", Type: "Surgery" },
        { Name: "Nose Surgery", Type: "Surgery" },
        { Name: "Throat Surgery", Type: "Surgery" },
        { Name: "Sinus Surgery", Type: "Surgery" },
        { Name: "Ear Cleaning", Type: "Treatment" },
        { Name: "Tonsillectomy / Tonsil Treatment", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 14,
      Category: "Brain",
      Services: [
        { Name: "Vascular Surgery", Type: "Surgery" },
        { Name: "Brain Surgery", Type: "Surgery" },
        { Name: "Nerve Surgery", Type: "Surgery" },
        { Name: "Soft Tissue Brain Surgery", Type: "Surgery" },
        { Name: "FITS", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 15,
      Category: "Liver",
      Services: [
        { Name: "Liver Transplant", Type: "Surgery" },
        { Name: "Liver Resection", Type: "Surgery" },
        {
          Name: "Transjugular Intrahepatic Portosystemic Shunt (TIPS)",
          Type: "Surgery",
        },
        { Name: "Weight Loss", Type: "Treatment" },
        { Name: "Band Ligation", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 16,
      Category: "Heart",
      Services: [
        { Name: "Coronary Bypass Heart", Type: "Surgery" },
        { Name: "Angioplasty", Type: "Surgery" },
        { Name: "Open Heart", Type: "Surgery" },
        { Name: "Valve Replacement", Type: "Surgery" },
        { Name: "Pacemaker", Type: "Surgery" },
      ],
    },
    {
      "Sr No": 17,
      Category: "Lungs",
      Services: [
        { Name: "Lung Transplant Surgery", Type: "Surgery" },
        { Name: "Lobectomy", Type: "Surgery" },
        { Name: "Thoracoscopic Wedge Resection", Type: "Surgery" },
        { Name: "Lung Biopsy", Type: "Treatment" },
        { Name: "Bronchoscopy", Type: "Treatment" },
        { Name: "Valve Therapy", Type: "Treatment" },
      ],
    },
    {
      "Sr No": 18,
      Category: "Cancer",
      Services: [
        { Name: "Bone Marrow Transplant", Type: "Surgery" },
        { Name: "Cancer Surgery", Type: "Surgery" },
        { Name: "Oral Cancer Surgery", Type: "Surgery" },
        { Name: "Lungs Cancer Surgery", Type: "Surgery" },
        { Name: "Tumor Cancer Surgery", Type: "Surgery" },
        { Name: "Breast Cancer Surgery", Type: "Surgery" },
        { Name: "Chemotherapy", Type: "Treatment" },
        { Name: "Radiation Therapy", Type: "Treatment" },
        { Name: "Immunotherapy", Type: "Treatment" },
        { Name: "Hormone therapy", Type: "Treatment" },
        { Name: "Targeted Drug Therapy", Type: "Treatment" },
        { Name: "Cryoablation", Type: "Treatment" },
        { Name: "Cancer Investigation - Biopsy", Type: "Treatment" },
        { Name: "Cancer Investigation - IHC Investigation", Type: "Treatment" },
      ],
    },
  ];

// ✅ Extract unique categories & services (only Treatment type)
const categoryOptions = categories
  .filter(cat => cat.Services.some(srv => srv.Type === "Treatment"))
  .map(cat => ({
    value: cat.Category,
    label: cat.Category,
  }));

const serviceOptions = categories.flatMap(cat =>
  cat.Services.filter(srv => srv.Type === "Treatment").map(srv => ({
    value: srv.Name,
    label: srv.Name,
  }))
);

const TreatmentSchedule = ({ userdata }) => {
  const [filters, setFilters] = useState({
    serviceName: "",
    category: "",
    status: "",
    bookingDate: "",
    preferredDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // ✅ Filter userdata
  const filteredData = useMemo(() => {
    return userdata.filter(row => {
      const bookingDate = new Date(row.bookingDate);
      const preferred = row.preferredDate ? new Date(row.preferredDate) : null;
      const selectedBookingDate = filters.bookingDate ? new Date(filters.bookingDate) : null;
      const selectedPreferredDate = filters.preferredDate ? new Date(filters.preferredDate) : null;

      return (
        (!filters.serviceName ||
          row.service.serviceName.toLowerCase() === filters.serviceName.toLowerCase()) &&
        (!filters.category ||
          row.service.category?.toLowerCase() === filters.category.toLowerCase()) &&
        (!filters.status || row.status.toLowerCase() === filters.status.toLowerCase()) &&
        (!selectedBookingDate || bookingDate.toDateString() === selectedBookingDate.toDateString()) &&
        (!selectedPreferredDate ||
          (preferred && preferred.toDateString() === selectedPreferredDate.toDateString()))
      );
    });
  }, [filters, userdata]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Treatment Bookings");
    XLSX.writeFile(wb, "treatment_bookings.xlsx");
  };

  return (
    <div className="container mx-auto py-6 font-poppins">
      <h2 className="text-2xl font-bold text-blue-600 text-center">
        My Treatment Bookings
      </h2>

                <div className="flex justify-end gap-1 py-4">
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-blue-600 text-white rounded-xl hover:bg-blue-600 active:bg-blue-600 focus:bg-blue-600"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                    <Button
                        onClick={exportToExcel}
                        className="bg-green-600 text-white rounded-xl hover:bg-green-600 active:bg-green-600 focus:bg-green-600"
                    >
                        Export to Excel
                    </Button>
                </div>

      {/* ✅ Filters Section */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <SelectField
            label="Category"
            id="category"
            value={filters.category}
            onChange={handleFilterChange}
            options={[{ value: "", label: "All" }, ...categoryOptions]}
          />
          <SelectField
            label="Service Name"
            id="serviceName"
            value={filters.serviceName}
            onChange={handleFilterChange}
            options={[{ value: "", label: "All" }, ...serviceOptions]}
          />
          <SelectField
            label="Status"
            id="status"
            value={filters.status}
            onChange={handleFilterChange}
            options={[
              { value: "", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
          <DateFilter
            label="Booking Date"
            id="bookingDate"
            selected={filters.bookingDate}
            onChange={handleFilterChange}
          />
          <DateFilter
            label="Preferred Date"
            id="preferredDate"
            selected={filters.preferredDate}
            onChange={handleFilterChange}
          />
        </div>
      )}

{/* Card View */}
        <div className="p-6">
          {paginatedData.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedData.map((booking) => (
                <div key={booking.id} className="group relative">
                  {/* Card Container */}
                  <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        {/* Left section */}
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center bg-blue-100 rounded-xl w-8 h-8 p-1.5">
                            <ClipboardList className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {booking.service.serviceName}
                            </h3>
                            <p className="text-blue-700 text-sm">
                              {booking.service.category || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status] || "bg-gray-100 text-gray-800"}`}
                        >
                          {statusIcons[booking.status]}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 flex-1 flex flex-col gap-3">
                      {/* First Row */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Hospital */}
                        <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-purple-100 rounded-full">
                            <Building2 className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Hospital</h4>
                            <p className="text-gray-600 truncate">
                              {booking.service.hospital?.hspInfo?.regname || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Booked On */}
                        <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-green-100 rounded-full">
                            <Calendar className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Booked On</h4>
                            <p className="text-gray-600">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Second Row */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Preferred Date */}
                        <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-blue-100 rounded-full">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Pref Date</h4>
                            <p className="text-gray-600">
                              {booking.preferredDate
                                ? new Date(booking.preferredDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Preferred Time */}
                        <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-indigo-100 rounded-full">
                            <Clock className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Pref Time</h4>
                            <p className="text-gray-600">
                              {booking.preferredTimeSlot || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {booking.notes && (
                        <div className="flex items-start gap-2 p-1 rounded-lg group-hover:bg-gray-50 transition-colors">
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            <FileText className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Notes</h4>
                            <p className="text-gray-600">
                              {booking.notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1.5">No treatment bookings found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>




      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Prev
            </Button>

            <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentSchedule;
