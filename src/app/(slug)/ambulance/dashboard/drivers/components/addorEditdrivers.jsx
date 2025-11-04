"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@uploadthing/react";
import { toast } from "react-toastify";
import HeadingClientMain from "@/app/components/heading";
import DatePicker from "react-datepicker";

export function AddAmbulanceDriverDialog({
  driverId,
  driverData,
  ambulances,
  ambulanceid,
}) {
  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    middlename: "",
    mobile: "",
    alternatemobileno: "",
    aadharcardno: "",
    aadharcardfront: "",
    aadharcardback: "",
    panno: "",
    panfront: "",
    drivinglicence: "",
    drivinglicencefront: "",
    photo: "",
    dateofbirth: "",
    password :"",
    gender: "",
    email: "",
    bloodgroup: "",
    pincode: "",
    firstaidtraining: false,
  });

  const [selectedAmbulanceId, setSelectedAmbulanceId] = React.useState();
  const [loading, setLoading] = React.useState(false);

  // Fill form if editing
  React.useEffect(() => {
    if (driverId && driverData) {
      setFormData({
        firstname: driverData.firstname || "",
        lastname: driverData.lastname || "",
        middlename: driverData.middlename || "",
        mobile: driverData.mobile || "",
        alternatemobileno: driverData.alternatemobileno || "",
        aadharcardno: driverData.aadharcardno || "",
        aadharcardfront: driverData.aadharcardfront || "",
        aadharcardback: driverData.aadharcardback || "",
        panno: driverData.panno || "",
        panfront: driverData.panfront || "",
        drivinglicence: driverData.drivinglicence || "",
        drivinglicencefront: driverData.drivinglicencefront || "",
        photo: driverData.photo || "",
        dateofbirth: driverData.dateofbirth || "",
        gender: driverData.gender || "",
        email: driverData.email || "",
        bloodgroup: driverData.bloodgroup || "",
        pincode: driverData.pincode || "",
        firstaidtraining: driverData.firstaidtraining || false,
      
      });

      // Link to ambulance (if any)
      if (driverData?.AmbulanceVaichicle?.[0]?.id) {
        setSelectedAmbulanceId(driverData.AmbulanceVaichicle[0].id);
      }
    }
  }, [driverId, driverData]);

  const updateForm = (key, value) => {
  // Validation regex patterns
  const onlyNumbers = /^[0-9]*$/; // Aadhar → only digits
  const alphanumeric = /^[A-Za-z0-9]*$/; // PAN, DL → alphanumeric only
  const panFormat = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // strict PAN pattern (ABCDE1234F)

  // 🪪 Aadhar Card — only 12 digits allowed
  if (key === "aadharcardno") {
    if (!onlyNumbers.test(value)) {
      toast.error("Aadhar Card Number must contain only digits.");
      return;
    }
    if (value.length > 12) return; // max 12 digits
  }

  // 🧾 PAN Number — alphanumeric only, 10 chars max
  if (key === "panno") {
    const formatted = value.toUpperCase();
    if (!alphanumeric.test(formatted)) {
      toast.error("PAN Number must be alphanumeric only.");
      return;
    }
    if (formatted.length > 10) return;
    value = formatted;
  }

  // 🚗 Driving Licence — alphanumeric only (example: MH12AB1234567)
  if (key === "drivinglicence") {
    if (!alphanumeric.test(value.toUpperCase())) {
      toast.error("Driving Licence must be alphanumeric only.");
      return;
    }
    value = value.toUpperCase();
  }

  // Update state
  setFormData((prev) => ({ ...prev, [key]: value }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = [
      "firstname",
      "lastname",
      "mobile",
      "aadharcardno",
      "middlename",
      "alternatemobileno",
      "panno",
      "drivinglicence",
      "photo",
      "aadharcardfront",
      "aadharcardback",
      "panfront",
      "drivinglicencefront",
      "password"
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        toast.error(`Please fill in the ${field} field.`);
        setLoading(false);
        return;
      }
    }
    try {
      const payload = {
        ...formData,
        id: driverId || undefined,
        assignedAmbulanceId: selectedAmbulanceId,
      };

      const method = driverId ? "PUT" : "POST";
      const url = driverId
        ? `/api/ambulance/${ambulanceid}/create-drivers/${driverId}`
        : `/api/ambulance/${ambulanceid}/create-drivers`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save driver");

      toast.success(`Driver ${driverId ? "updated" : "created"} successfully.`);
    } catch (err) {
      toast.error("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="flex justify-end">
        <DialogTrigger>
          <span className="bg-blue-500 text-white px-3 py-1 rounded-[10px]">
            {driverId ? "Edit" : "Add"} Driver
          </span>
        </DialogTrigger>
      </div>

      <DialogContent className="lg:!max-w-xl w-full bg-white overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <HeadingClientMain main={`${driverId ? "Edit" : "Create"} Driver`} />
          <DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={(e) => updateForm("firstname", e.target.value)}
                />
                <Input
                  placeholder="Middle Name"
                  value={formData.middlename}
                  onChange={(e) => updateForm("middlename", e.target.value)}
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={(e) => updateForm("lastname", e.target.value)}
                />
                <Input
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => updateForm("mobile", e.target.value)}
                />
                <Input
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => updateForm("password", e.target.value)}
                />
                <Input
                  placeholder="Alternate Mobile"
                  value={formData.alternatemobileno}
                  onChange={(e) =>
                    updateForm("alternatemobileno", e.target.value)
                  }
                />
                {/* IDs */}
                <Input
                  placeholder="Aadhar Card Number"
                  value={formData.aadharcardno}
                  onChange={(e) => updateForm("aadharcardno", e.target.value)}
                />
                <Input
                  placeholder="PAN Number"
                  value={formData.panno}
                  onChange={(e) => updateForm("panno", e.target.value)}
                />
                <Input
                  placeholder="Driving Licence Number"
                  value={formData.drivinglicence}
                  onChange={(e) => updateForm("drivinglicence", e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />{" "}
                <DatePicker
                  selected={formData.dateofbirth}
                  onChange={(date) => updateForm("dateofbirth", date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Date of Birth"
                  className="w-full border rounded p-2"
                  showYearDropdown
                  showMonthDropdown
                  suppressHydrationWarning={true}
                />
                <Select
                  value={formData.gender}
                  onValueChange={(val) => updateForm("gender", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {["Male", "Female", "Other"].map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={formData.bloodgroup}
                  onValueChange={(val) => updateForm("bloodgroup", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => updateForm("pincode", e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.firstaidtraining}
                    onChange={(e) =>
                      updateForm("firstaidtraining", e.target.checked)
                    }
                    id="firstaidtraining"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="firstaidtraining">First Aid Trained</label>
                </div>
              </div>
              {/* Ambulance Selection */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Assign Ambulance</label>
                <Select
                  value={selectedAmbulanceId}
                  onValueChange={(val) => setSelectedAmbulanceId(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ambulance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.isArray(ambulances) && ambulances.length > 0 ? (
                        ambulances.map((amb) => (
                          <SelectItem key={amb.id} value={amb.id}>
                            {amb.ambulancemodel} ({amb.ambulancercno})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-ambulances">
                          No ambulances available
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Aadhar, PAN, DL, Photo Uploads */}
              {[
                ["photo", "Driver Photo"],
                ["aadharcardfront", "Aadhar Card Front"],
                ["aadharcardback", "Aadhar Card Back"],
                ["panfront", "PAN Card Front"],
                ["drivinglicencefront", "Driving Licence Front"],
              ].map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm font-medium">{label}</label>
                  <UploadButton
                    endpoint="fileUploader"
                    content={{
                      button({ ready }) {
                        return <div>{ready && "Upload"}</div>;
                      },
                    }}
                    appearance={{
                      button:
                        "w-auto bg-transparent text-sm text-white font-bold",
                      container: "rounded border w-auto px-4 py-1 bg-[#243460]",
                      allowedContent: "hidden",
                    }}
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        updateForm(key, res[0].url);
                        toast(`${label} uploaded successfully`);
                      }
                    }}
                    onUploadError={(err) =>
                      toast(`Upload error: ${err.message}`)
                    }
                  />
                </div>
              ))}

              <Button
                type="submit"
                className="w-full rounded-[10px] text-white hover:bg-blue-700 bg-blue-500"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
