import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimePicker from "react-time-picker"; // Import Time Picker

import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { ArrowDown } from "lucide-react";
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";

const VisitingHospitalClient = ({
  userdata,
  state,
  data,
  dist,
  subdist,
  hospitalid,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const router = useRouter();

  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  const [formData, setFormData] = useState({
    hospitalname: "",
    hospitalconsultationfee: "",
    hospitalinouttime: {}, // JSON object to store multiple time slots per day
    hospitalconsultationdays: [],
    hospitalcontactno: "",
    presentAddress: "",
    city: "",
    state: "",
    district: "",
    pincode: "",
    taluka: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && document.getElementById("__next")) {
      Modal.setAppElement("#__next");
    }
  }, []);

  useEffect(() => {
    if (userdata?.doctorvisitinghospitals && hospitalid) {
      const selectedHospital = userdata.doctorvisitinghospitals.find(
        (hospital) => hospital.id === hospitalid
      );
      if (selectedHospital) {
        setFormData({
          hospitalname: selectedHospital.hospitalname || "",
          hospitalconsultationfee:
            selectedHospital.hospitalconsultationfee || "",
          hospitalinouttime: JSON.parse(
            selectedHospital.hospitalinouttime || "{}"
          ),
          hospitalconsultationdays:
            selectedHospital.hospitalconsultationdays?.split(",") || [],
          hospitalcontactno: selectedHospital.hospitalcontactno || "",
          presentAddress: selectedHospital.presentAddress || "",
          pincode: selectedHospital.pincode || "",
          city: selectedHospital.city || "",
          state: selectedHospital.state || "",
          district: selectedHospital.district || "",
          taluka: selectedHospital.taluka || "",
        });
      }
    }
  }, [userdata, hospitalid]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number validation
    if (name === "mobile") {
      if (!/^\d{10}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          mobile: "Mobile number must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({ ...prev, mobile: "" }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      const selectedState = state.find((state) => state.stateName === value);
      const districts = dist.filter(
        (district) => district.stateId === selectedState.id
      );
      setFilteredDistricts(districts);
      setFilteredSubDistricts([]);
      setFormData((prev) => ({
        ...prev,
        district: "",
        taluka: "",
        state: selectedState.stateName,
      }));
    }

    if (name === "district") {
      const selectedDistrict = dist.find(
        (district) => district.district === value
      );
      const subDistricts = subdist.filter(
        (subDistrict) => subDistrict.districtId === selectedDistrict.id
      );
      setFilteredSubDistricts(subDistricts);
      setFormData((prev) => ({
        ...prev,
        taluka: "",
        district: selectedDistrict.district,
      }));
    }

    if (name === "taluka") {
      setFormData((prev) => ({
        ...prev,
        taluka: value,
      }));
    }
  };

  const handleDaySelection = (day) => {
    setFormData((prev) => {
      const updatedDays = prev.hospitalconsultationdays.includes(day)
        ? prev.hospitalconsultationdays.filter((d) => d !== day)
        : [...prev.hospitalconsultationdays, day];
      return { ...prev, hospitalconsultationdays: updatedDays };
    });
  };

  const addTimeSlot = (day) => {
    setFormData((prev) => ({
      ...prev,
      hospitalinouttime: {
        ...prev.hospitalinouttime,
        [day]: [...(prev.hospitalinouttime[day] || []), { from: "", to: "" }],
      },
    }));
  };

  const handleTimeChange = (day, index, type, time) => {
    setFormData((prev) => {
      const updatedSlots = [...(prev.hospitalinouttime[day] || [])];
      updatedSlots[index][type] = time;
      return {
        ...prev,
        hospitalinouttime: {
          ...prev.hospitalinouttime,
          [day]: updatedSlots,
        },
      };
    });
  };
  const removeTimeSlot = (day, index) => {
    setFormData((prevData) => {
      const updatedSlots = { ...prevData.hospitalinouttime };
      updatedSlots[day].splice(index, 1); // Remove selected slot

      // If no slots remain for the day, remove the key
      if (updatedSlots[day].length === 0) {
        delete updatedSlots[day];
      }

      return {
        ...prevData,
        hospitalinouttime: updatedSlots,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = hospitalid
        ? `/api/doctor/${userdata.id}/visitinghospitals/${hospitalid}`
        : `/api/doctor/${userdata.id}/visitinghospitals`;

      const response = await fetch(endpoint, {
        method: hospitalid ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hospitalinouttime: JSON.stringify(formData.hospitalinouttime),
          hospitalconsultationdays: formData.hospitalconsultationdays.join(","),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save hospital details.");
      }

      toast("Information updated successfully!");
      router.push(`/doctor/dashboard/visitinghospitals`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setIsFormVisible(false);
    }
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => setIsFormVisible(true)}
        className="bg-blue-500 px-4 py-2 text-white rounded-xl"
      >
        {hospitalid ? "Edit Hospital" : "Add New Hospital"}
      </button>

      <Modal
        isOpen={isFormVisible}
        onRequestClose={() => setIsFormVisible(false)}
        contentLabel="Hospital Form"
        className="w-full mt-16 h-[400px] overflow-auto max-w-lg p-4 bg-white rounded-xl shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        ariaHideApp={false}
      >
        <div className=" flex flex-col text-center items-center justify-center">
              <h1 className="text-center text-xl font-bold text-[#243460]">Add New Hospital / Clinic</h1>
              <p className="text-center text-lg font-bold text-[#243460]">All Details</p>
            </div>
        <form onSubmit={handleSubmit} className="space-y-4  bg-white rounded-xl shadow-md p-4">
         {!hospitalid && <> {[
            { label: "Hospital Name", name: "hospitalname", type: "text" },
            {
              label: "Hospital/ClinicContact Number",
              name: "hospitalcontactno",
              type: "number",
            },
            { label: "Present Address", name: "presentAddress", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "Pin Code", name: "pincode", type: "pincode" },
          ].map(({ label, name, type }) => (
            <div key={name} className="space-y-1">
              <Label className="text-[#243460] font-semibold ml-0">{label}*</Label>
              <Input
                type={type}
                className="pl-4"
                placeholder={`Enter ${label}`}
                required
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))} </>}
          { <>    {[
            {
              label: "Consultation Fee",
              name: "hospitalconsultationfee",
              type: "number",
            },
           
          ].map(({ label, name, type }) => (
            <div key={name} className="space-y-1">
              <Label className="text-[#243460] font-semibold ml-0">{label}*</Label>
              <Input
                type={type}
                className="pl-4"
                placeholder={`Enter ${label}`}
                required
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="w-full relative">
            <Label className="text-[#243460] font-semibold ml-0">State*</Label>
            <div className="relative">
              <select
                className="flex h-10 w-full rounded-xl border border-gray-500 bg-background px-3 py-2 text-base ring-offset-background file:border-0  file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-4"// required
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option className="text-black" value="">
                  Select State
                </option>
                {state.map((state) => (
                  <option
                    key={state.id}
                    value={state.stateName}
                    className="text-black"
                  >
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>
          </div>{" "}
          <div className="w-full ">
            <Label className="text-[#243460] font-semibold ml-0">District*</Label>
            <div className="relative">
              <select
                className="flex h-10 w-full rounded-xl border border-gray-500 bg-background px-3 py-2 text-base ring-offset-background file:border-0  file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-4" // required
                name="district"
                value={formData.district}
                onChange={handleChange}
              >
                <option className="text-black" value="">
                  Select District
                </option>
                {filteredDistricts.map((district) => (
                  <option
                    key={district.id}
                    value={district.district}
                    className="text-black"
                  >
                    {district.district}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full ">
            <Label className="text-[#243460] font-semibold ml-0">Taluka*</Label>
            <div className="relative">
              <select
                className="flex h-10 w-full rounded-xl border border-gray-500 bg-background px-3 py-2 text-base ring-offset-background file:border-0  file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-4" // required
                name="taluka"
                value={formData.taluka}
                onChange={handleChange}
              >
                <option className="text-black" value="">
                  Select Taluka
                </option>
                {filteredSubDistricts.map((subDistrict) => (
                  <option
                    key={subDistrict.id}
                    value={subDistrict.subDistrict}
                    className="text-black"
                  >
                    {subDistrict.subDistrict}
                  </option>
                ))}
              </select>
            </div>
          </div> </> }
{  <div className="p-0">
            <Label className="text-[#243460] font-semibold ml-0">
              Select Consultation Days:
            </Label>
            <div className="grid grid-cols-1  lg:grid-cols-2 gap-3">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <div
                  key={day}
                  className="flex truncate items-center gap-2 bg-gray-100 p-3 rounded-xl shadow-sm"
                >
                  <input
                    type="checkbox"
                    value={day}
                    checked={formData.hospitalconsultationdays.includes(day)}
                    onChange={() => handleDaySelection(day)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-xs font-medium">{day}</span>
                  <button
                    type="button"
                    onClick={() => addTimeSlot(day)}
                    className="ml-auto bg-green-500 hover:bg-green-600 text-white text-[10px] px-3 py-1 rounded-xl"
                  >
                    + Add Slot
                  </button>
                </div>
              ))}
            </div>

            {/* Time Slots Section */}
            <div className="mt-4 space-y-2">
              {Object.entries(formData.hospitalinouttime || {}).map(
                ([day, slots]) =>
                  (slots || []).map((slot, index) => (
                    <div
                      key={`${day}-${index}`}
                      className="flex flex-wrap items-center gap-3 p-3 border border-gray-200 rounded-xl"
                    >
                      <span className="text-xs font-semibold w-full sm:w-auto">
                        {day}
                      </span>
                      <TimePicker
                        onChange={(time) =>
                          handleTimeChange(day, index, "from", time)
                        }
                        value={slot.from || ""}
                        disableClock
                        className="border rounded p-1 text-xs w-full sm:w-auto"
                      />
                      <span className="text-sm">to</span>
                      <TimePicker
                        onChange={(time) =>
                          handleTimeChange(day, index, "to", time)
                        }
                        value={slot.to || ""}
                        disableClock
                        className="border rounded p-1 text-xs w-full sm:w-auto"
                      />
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(day, index)}
                        className="ml-auto bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-xl"
                      >
                        ❌ Remove
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div> }

       
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-xl"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default VisitingHospitalClient;
