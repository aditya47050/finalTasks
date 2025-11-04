"use client";
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
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
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssociatedHospitalsList = ({ userdata, state, dist, subdist }) => {
    const [hospitals, setHospitals] = useState(userdata.associatedHospitals || []);
    const [filters, setFilters] = useState({
        hospitalregname: "",
        email: "",
        mobile: "",
        city: "",
        state: "all",
        district: "all",
        subdistrict: "all",
        status: "all",
    });

    const [filtersVisible, setFiltersVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(null);
    const [remarks, setRemarks] = useState({});
    const [dialogData, setDialogData] = useState(null); // { hospital, type: "approve" | "reject" }
    const [selectedIssues, setSelectedIssues] = useState({});
    const [scheduleDialog, setScheduleDialog] = useState(null);

    const pageSize = 10;

    // Rejection reasons
    const rejectionIssues = [
        "Invalid Email",
        "Invalid Contact No",
        "Invalid Address",
        "Other Compliance Issues",
    ];

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
            ...(field === "state" ? { district: "all", subdistrict: "all" } : {}),
            ...(field === "district" ? { subdistrict: "all" } : {}),
        }));
        setPage(1);
    };

    // Filter data based on current filters
    const filteredData = useMemo(() => {
        return (hospitals || []).filter((item) => {
            if (filters.hospitalregname && !item.hspInfo?.regname?.toLowerCase().includes(filters.hospitalregname.toLowerCase())) {
                return false;
            }
            if (filters.email && !item.email?.toLowerCase().includes(filters.email.toLowerCase())) {
                return false;
            }
            if (filters.mobile && !item.mobile?.includes(filters.mobile)) {
                return false;
            }
            if (filters.city && !item.hspcontact?.city?.toLowerCase().includes(filters.city.toLowerCase())) {
                return false;
            }
            if (filters.state !== "all" && item.hspcontact?.stateId !== filters.state) return false;
            if (filters.district !== "all" && item.hspcontact?.districtId !== filters.district) return false;
            if (filters.subdistrict !== "all" && item.hspcontact?.subdistrictId !== filters.subdistrict) return false;

            if (filters.status !== "all" && item.approvalStatus !== filters.status) {
                return false;
            }
            return true;
        });
    }, [hospitals, filters]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    // Export to Excel
    const exportToExcel = () => {
        const exportData = filteredData.map((item) => ({
            "Hospital Name": item.hspInfo?.regname || "N/A",
            "Email": item.email || "N/A",
            "Mobile": item.mobile || "N/A",
            "Address": `${item.hspcontact?.address || ""}, ${item.hspcontact?.city || ""}, ${item.hspcontact?.state || ""}`.trim(),
            "City": item.hspcontact?.city || "N/A",
            "State": item.hspcontact?.state || "N/A",
            "Status": item.approvalStatus || "PENDING",
            "Linked At": item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "N/A",
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Associated Hospitals");
        XLSX.writeFile(wb, `AssociatedHospitals_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    };

    // Handle approval/rejection
    const handleApproval = async (hospitalId, approved) => {
        try {
            setLoading(hospitalId);

            // 📝 Prepare rejection note if rejected
            let rejectionNote = "";
            if (!approved) {
                rejectionNote = remarks[hospitalId] || "";
                if (selectedIssues[hospitalId]?.length > 0) {
                    rejectionNote += `\nIssues: ${selectedIssues[hospitalId].join(", ")}`;
                }
            }

            // 📡 API call
            const res = await fetch(`/api/doctor/${userdata.id}/hospitalapproval`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hospitalDoctorId: hospitalId,
                    approved,
                    rejectionNote,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update status");
            }

            const data = await res.json();

            // 🔄 Update local state so UI reflects changes immediately
            setHospitals((prev) =>
                prev.map((h) =>
                    h.hospitalDoctorId === hospitalId
                        ? {
                            ...h,
                            approvalStatus: approved ? "APPROVED" : "REJECTED",
                            remark: rejectionNote || null,
                            approvedBy: approved ? userdata.name || userdata.email : null,
                            approvedAt: new Date().toISOString(),
                        }
                        : h
                )
            );

            // 🎉 Toast messages
            if (approved) {
                toast.success(data.message || "✅ Hospital approved successfully!");
            } else {
                toast.error(
                    (data.message || "❌ Hospital rejected.") +
                    (rejectionNote ? `\nReason: ${rejectionNote}` : "")
                );
            }

            // ✅ Close dialog only after success
            setDialogData(null);

            // 🧹 Cleanup remarks & issues for this hospital
            setRemarks((prev) => {
                const newRemarks = { ...prev };
                delete newRemarks[hospitalId];
                return newRemarks;
            });

            setSelectedIssues((prev) => {
                const newIssues = { ...prev };
                delete newIssues[hospitalId];
                return newIssues;
            });

        } catch (err) {
            console.error("Approval error:", err);
            toast.error(err.message || "⚠️ Something went wrong while updating approval status.");
        } finally {
            setLoading(null);
        }
    };

    const filteredDistricts =
        filters.state === "all"
            ? []
            : dist.filter((d) => d.stateId === filters.state);

    const filteredSubdistricts =
        filters.district === "all"
            ? []
            : subdist.filter((sd) => sd.districtId === filters.district);



    return (
        <div className="container mx-auto font-poppins md:max-w-6xl">
            {/* Heading */}
            <div className="text-center pt-4">
                <h1 className="text-[24px] text-[#2b73ec] font-extrabold">Associated Hospitals</h1>
                <p className="text-[#243460] text-[13px] mt-1">Hospitals linked with you</p>
            </div>

            {/* Controls */}
            <div className="flex justify-end items-center py-4 space-x-4">
                <Button
                    className="bg-blue-500 hover:bg-blue-600 rounded-xl text-white"
                    onClick={() => setFiltersVisible(!filtersVisible)}
                >
                    {filtersVisible ? "Hide Filters" : "Show Filters"}
                </Button>
                <Button
                    className="bg-green-500 hover:bg-green-600 rounded-xl text-white"
                    onClick={exportToExcel}
                >
                    Export to Excel
                </Button>
            </div>


            {/* Filters */}
            {filtersVisible && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mb-4 bg-gray-50 rounded-lg">
                    <input
                        type="text"
                        placeholder="Hospital Name"
                        value={filters.hospitalregname}
                        onChange={(e) => handleFilterChange("hospitalregname", e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={filters.email}
                        onChange={(e) => handleFilterChange("email", e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Mobile"
                        value={filters.mobile}
                        onChange={(e) => handleFilterChange("mobile", e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => handleFilterChange("city", e.target.value)}
                        className="p-2 border rounded"
                    />
                    {/* State dropdown */}
                    <select
                        value={filters.state}
                        onChange={(e) => handleFilterChange("state", e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="all">All States</option>
                        {state.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.stateName}
                            </option>
                        ))}
                    </select>

                    {/* District dropdown (depends on state) */}
                    <select
                        value={filters.district}
                        onChange={(e) => handleFilterChange("district", e.target.value)}
                        className="p-2 border rounded"
                        disabled={filters.state === "all"}
                    >
                        <option value="all">All Districts</option>
                        {filteredDistricts.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.district}
                            </option>
                        ))}
                    </select>

                    {/* Subdistrict dropdown (depends on district) */}
                    <select
                        value={filters.subdistrict}
                        onChange={(e) => handleFilterChange("subdistrict", e.target.value)}
                        className="p-2 border rounded"
                        disabled={filters.district === "all"}
                    >
                        <option value="all">All Subdistricts</option>
                        {filteredSubdistricts.map((sd) => (
                            <option key={sd.id} value={sd.id}>
                                {sd.subDistrict}
                            </option>
                        ))}
                    </select>



                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="all">All Status</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto bg-white p-6 rounded-[15px] shadow-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hospital Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                            <TableHead>Schedule</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length ? (
                            paginatedData.map((row) => (
                                <TableRow key={row.hospitalDoctorId}>
                                    <TableCell>{row.hspInfo?.regname || "N/A"}</TableCell>
                                    <TableCell>{row.email || "N/A"}</TableCell>
                                    <TableCell>{row.mobile || "N/A"}</TableCell>
                                    <TableCell>
                                        {`${row.hspcontact?.address || ""}, ${row.hspcontact?.city || ""}, ${row.hspcontact?.state || ""}`.trim() || "N/A"}
                                    </TableCell>
                                    <TableCell>{row.hspcontact?.city || "N/A"}</TableCell>
                                    <TableCell>{row.hspcontact?.state || "N/A"}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${row.approvalStatus === "APPROVED"
                                                ? "bg-green-100 text-green-700"
                                                : row.approvalStatus === "REJECTED"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {row.approvalStatus || "PENDING"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row gap-2">
                                            <Button
                                                className="bg-green-500 hover:bg-green-600 text-white rounded"
                                                disabled={loading === row.hospitalDoctorId || row.approvalStatus === "APPROVED"}
                                                onClick={() => setDialogData({ hospital: row, type: "approve" })}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                className="bg-red-500 hover:bg-red-600 text-white rounded"
                                                disabled={loading === row.hospitalDoctorId || row.approvalStatus === "REJECTED"}
                                                onClick={() => setDialogData({ hospital: row, type: "reject" })}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>

                                        <Button
                                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs"
                                            onClick={() => setScheduleDialog({ hospital: row })}
                                        >
                                            {row.consultationDays && row.consultationTime ? "Edit" : "Set"} Schedule
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">
                                    No associated hospitals found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between py-4">
                    <Button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Approval/Rejection Dialog */}
            <Dialog open={!!dialogData} onOpenChange={() => setDialogData(null)}>
                <DialogContent className="bg-white max-w-lg w-full min-h-[300px] rounded-2xl flex flex-col justify-between shadow-lg">
                    <DialogHeader className="w-full flex justify-center items-center">
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            {dialogData?.type === "approve"
                                ? "Approve Hospital"
                                : "Reject Hospital"}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Remark textarea */}
                    <Textarea
                        placeholder="Optional note..."
                        value={remarks[dialogData?.hospital?.hospitalDoctorId] || ""}
                        onChange={(e) =>
                            setRemarks((prev) => ({
                                ...prev,
                                [dialogData?.hospital?.hospitalDoctorId]: e.target.value,
                            }))
                        }
                        className="min-h-[100px] rounded-lg"
                    />

                    {/* Show issues only when rejecting */}
                    {dialogData?.type === "reject" && (
                        <div className="mt-4 space-y-2 overflow-y-auto max-h-[120px]">
                            <p className="font-medium text-sm">Select Issues (optional):</p>
                            {rejectionIssues.map((issue) => (
                                <label
                                    key={issue}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <Checkbox
                                        checked={
                                            selectedIssues[dialogData?.hospital?.hospitalDoctorId]?.includes(issue) || false
                                        }
                                        onCheckedChange={(checked) => {
                                            setSelectedIssues((prev) => {
                                                const current = prev[dialogData?.hospital?.hospitalDoctorId] || [];
                                                return {
                                                    ...prev,
                                                    [dialogData?.hospital?.hospitalDoctorId]: checked
                                                        ? [...current, issue]
                                                        : current.filter((i) => i !== issue),
                                                };
                                            });
                                        }}
                                    />
                                    {issue}
                                </label>
                            ))}
                        </div>
                    )}

                    <DialogFooter className="flex justify-end gap-2 pt-4">
                        <Button
                            className="bg-gray-300 text-black rounded-full px-5"
                            onClick={() => setDialogData(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className={`px-5 rounded-full ${dialogData?.type === "approve"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-red-500 text-white hover:bg-red-600"
                                }`}
                            disabled={loading === dialogData?.hospital?.hospitalDoctorId}
                            onClick={() =>
                                handleApproval(
                                    dialogData.hospital.hospitalDoctorId,
                                    dialogData.type === "approve"
                                )
                            }
                        >
                            {loading === dialogData?.hospital?.hospitalDoctorId ? "Processing..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Dialog */}
            <Dialog open={!!scheduleDialog} onOpenChange={() => setScheduleDialog(null)}>
                <DialogContent className="bg-white max-w-lg w-full min-h-[300px] rounded-2xl flex flex-col justify-between shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            Set Available Schedule
                        </DialogTitle>
                    </DialogHeader>
                    <ScheduleForm
                        initialDays={scheduleDialog?.hospital?.consultationDays}
                        initialTime={scheduleDialog?.hospital?.consultationTime}
                        onSave={async (days, time) => {
                            // Call API to save schedule
                            const res = await fetch(`/api/doctor/hospitaldoctor/${scheduleDialog.hospital.hospitalDoctorId}/schedule`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    consultationDays: days,
                                    consultationTime: time,
                                }),
                            });
                            if (res.ok) {
                                toast.success("Schedule updated!");
                                // Update local state
                                setHospitals((prev) =>
                                    prev.map((h) =>
                                        h.hospitalDoctorId === scheduleDialog.hospital.hospitalDoctorId
                                            ? { ...h, consultationDays: days, consultationTime: time }
                                            : h
                                    )
                                );
                                setScheduleDialog(null);
                            } else {
                                toast.error("Failed to update schedule");
                            }
                        }}
                        onCancel={() => setScheduleDialog(null)}
                    />
                </DialogContent>
            </Dialog>


        </div>
    );
};

function ScheduleForm({ initialDays, initialTime, onSave, onCancel }) {
    const weekDays = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const [selectedDays, setSelectedDays] = useState(
        initialDays ? initialDays.split(",") : []
    );
    const [slots, setSlots] = useState(
        initialTime ? JSON.parse(initialTime) : {}
    );
    const [submitting, setSubmitting] = useState(false);

    const handleDayToggle = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const addSlot = (day) => {
        setSlots((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), { from: "", to: "" }],
        }));
    };

    const handleSlotChange = (day, idx, type, value) => {
        setSlots((prev) => {
            const updated = [...(prev[day] || [])];
            updated[idx][type] = value;
            return { ...prev, [day]: updated };
        });
    };

    const removeSlot = (day, idx) => {
        setSlots((prev) => {
            const updated = [...(prev[day] || [])];
            updated.splice(idx, 1);
            if (updated.length === 0) {
                const { [day]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [day]: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave(selectedDays.join(","), JSON.stringify(slots));
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium mb-1">Select Days</label>
                <div className="grid grid-cols-2 gap-2">
                    {weekDays.map((day) => (
                        <label key={day} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedDays.includes(day)}
                                onChange={() => handleDayToggle(day)}
                            />
                            {day}
                            <Button
                                type="button"
                                className="ml-auto bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                                onClick={() => addSlot(day)}
                                disabled={!selectedDays.includes(day)}
                            >
                                + Add Slot
                            </Button>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block font-medium mb-1">Time Slots</label>
                {Object.entries(slots).map(([day, daySlots]) =>
                    daySlots.map((slot, idx) => (
                        <div key={day + idx} className="flex items-center gap-2 mb-2">
                            <span className="w-20">{day}</span>
                            <input
                                type="time"
                                value={slot.from}
                                onChange={(e) => handleSlotChange(day, idx, "from", e.target.value)}
                                className="border rounded px-2 py-1"
                                required
                            />
                            <span>to</span>
                            <input
                                type="time"
                                value={slot.to}
                                onChange={(e) => handleSlotChange(day, idx, "to", e.target.value)}
                                className="border rounded px-2 py-1"
                                required
                            />
                            <Button
                                type="button"
                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                                onClick={() => removeSlot(day, idx)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))
                )}
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" onClick={onCancel} className="bg-gray-300 text-black rounded px-4">
                    Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 text-white rounded px-4" disabled={submitting}>
                    {submitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}

export default AssociatedHospitalsList;