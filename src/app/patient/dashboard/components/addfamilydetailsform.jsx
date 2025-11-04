"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogTitle, DialogTrigger, DialogContent, DialogHeader, DialogDescription
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { AlertCircle, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getReciprocalRelationshipWithGender } from "@/lib/relationshipUtils";

const AddFamilymemberformClient = ({ userdata, memberid, states, dist, subdist }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  const initialMemberState = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    age: "",
    relation: "",
    gender: "",
    mobile: "",
    bloodgroup: "",
    aadharCardNumber: "",
    presentAddress: "",
    city: "",
    district: "",
    state: "",
    pincode: ""
  };

  const [member, setMember] = useState(initialMemberState);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reciprocalRelation, setReciprocalRelation] = useState("");


  const [errors, setErrors] = useState({});
  const prevErrorsRef = useRef({});
  const router = useRouter();
  const [editingMember, setEditingMember] = useState(null);


  // Function to calculate and update reciprocal relationship
  const updateReciprocalRelation = (relation, gender) => {
    if (relation && gender) {
      const reciprocal = getReciprocalRelationshipWithGender(relation, gender);
      setReciprocalRelation(reciprocal || "");
    } else {
      setReciprocalRelation("");
    }
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) errorMessage = "First name is required";
        else if (/\d/.test(value)) errorMessage = "First name cannot contain numbers";
        break;
      case "middleName":
        if (value && /\d/.test(value)) errorMessage = "Middle name cannot contain numbers";
        break;
      case "lastName":
        if (!value.trim()) errorMessage = "Last name is required";
        else if (/\d/.test(value)) errorMessage = "Last name cannot contain numbers";
        break;
      case "aadharCardNumber":
        if (!/^\d{12}$/.test(value)) errorMessage = "Aadhar card must be 12 digits";
        break;
        case "age":
          if (!value) errorMessage = "Age is required";
          else if (!/^\d+$/.test(value)) errorMessage = "Age must be a number";
          else if (parseInt(value) < 0 || parseInt(value) > 120) errorMessage = "Age must be between 0 and 120";
          break;
      case "presentAddress":
        if (!value.trim()) errorMessage = "Address is required";
        break;
      case "email":
        if (!value.trim()) errorMessage = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errorMessage = "Enter a valid email address";
        break;
      case "relation":
        if (!value.trim()) errorMessage = "Relation is required";
        else if (/\d/.test(value)) errorMessage = "Relation cannot contain numbers";
        break;
      case "gender":
        if (!value) errorMessage = "Gender is required";
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) errorMessage = "Mobile number must be 10 digits";
        break;
      case "bloodgroup":
        if (!/^(A|B|AB|O)[+-]$/.test(value))
          errorMessage = "Enter a valid blood group (e.g., A+, O-)";
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) errorMessage = "Pincode must be 6 digits";
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (event) => {
    const { name, value } = event.target ?? event;  // Handle Select and Input

    if (name === "state") {
      const selectedState = states.find((s) => s.stateName === value);
      const districts = dist.filter((d) => d.stateId === selectedState?.id);
      setFilteredDistricts(districts);
      setFilteredSubDistricts([]);
      setMember((prev) => ({
        ...prev,
        state: selectedState?.stateName || "",
        district: "",
        taluka: "",
      }));
    } else if (name === "district") {
      const selectedDistrict = dist.find((d) => d.district === value);
      const subDistricts = subdist.filter((sd) => sd.districtId === selectedDistrict?.id);
      setFilteredSubDistricts(subDistricts);
      setMember((prev) => ({
        ...prev,
        district: selectedDistrict?.district || "",
        taluka: "",
      }));
    } else if (name === "taluka") {
      setMember((prev) => ({ ...prev, taluka: value }));
    } else {
      setMember((prev) => ({ ...prev, [name]: value }));
    }

    // Update reciprocal relationship when relation or gender changes
    if (name === "relation" || name === "gender") {
      const newRelation = name === "relation" ? value : member.relation;
      const newGender = name === "gender" ? value : member.gender;
      updateReciprocalRelation(newRelation, newGender);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const checkAadharExists = async (aadhar) => {
    if (!aadhar) return;

    try {
      const res = await fetch(`/api/patient/search?query=${aadhar}`);
      const data = await res.json();

      if (res.ok && data.patient) {
        toast.warning("Member already exists with this Aadhaar number!", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
        });

              // ✅ Calculate age from date of birth if available
      let calculatedAge = "";
      if (data.patient.dateOfBirth) {
        const dob = new Date(data.patient.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        
        // Adjust age if birthday hasn't occurred yet this year
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        calculatedAge = age.toString();
      }

        // ✅ Populate form fields except relation
        setMember((prev) => ({
          ...prev,
          firstName: data.patient.firstName || "",
          middleName: data.patient.middleName || "",
          lastName: data.patient.lastName || "",
          mobile: data.patient.mobile || "",
          aadharCardNumber: data.patient.aadharCardNumber || "",
          email: data.patient.email || "",
          bloodgroup: data.patient.bloodgroup || "",
          age: calculatedAge,
          presentAddress: data.patient.presentAddress || "",
          state: data.patient.state || "",
          district: data.patient.district || "",
          taluka: data.patient.taluka || "",
          pincode: data.patient.pincode || "",
          gender: data.patient.gender
            ? data.patient.gender.charAt(0).toUpperCase() + data.patient.gender.slice(1).toLowerCase()
            : "",
          relation: "", // keep editable
        }));

        // ✅ Update districts/subdistricts if already stored
        const selectedState = states.find((s) => s.stateName === data.patient.state);
        if (selectedState) {
          const districts = dist.filter((d) => d.stateId === selectedState.id);
          setFilteredDistricts(districts);

          const selectedDistrict = districts.find((d) => d.district === data.patient.district);
          if (selectedDistrict) {
            const subDistricts = subdist.filter((sd) => sd.districtId === selectedDistrict.id);
            setFilteredSubDistricts(subDistricts);

            if (subDistricts.some((sd) => sd.subDistrict === data.patient.taluka)) {
              setMember((prev) => ({ ...prev, taluka: data.patient.taluka }));
            }
          }
        }
      }
    } catch (err) {
      console.error("Error checking Aadhaar:", err);
    }
  };



  useEffect(() => {
    if (!isFormVisible) return;
    Object.entries(errors).forEach(([key, message]) => {
      if (message && prevErrorsRef.current[key] !== message) {
        toast.error(message, { position: "top-right", autoClose: 3000 });
      }
    });
    prevErrorsRef.current = errors;
  }, [errors]);

  useEffect(() => {
    if (userdata?.familymembers && memberid) {
      const selectedMember = userdata.familymembers.find((m) => m.id === memberid);
      if (selectedMember) {
              // Compute age from dateOfBirth if present
      let computedAge = "";
      if (selectedMember.dateOfBirth) {
        const dob = new Date(selectedMember.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
        computedAge = String(age);
      }
      // Prefill the form
      setMember((prev) => ({
        ...prev,
        firstName: selectedMember.firstName || "",
        middleName: selectedMember.middleName || "",
        lastName: selectedMember.lastName || "",
        email: selectedMember.email || "",
        aadharCardNumber: selectedMember.aadharCardNumber || "",
        relation: selectedMember.relation || "",
        gender: selectedMember.gender || "",
        mobile: selectedMember.mobile || "",
        bloodgroup: selectedMember.bloodgroup || "",
        age: computedAge || prev.age || "",
        presentAddress: selectedMember.presentAddress || "",
        state: selectedMember.state || "",
        district: selectedMember.district || "",
        taluka: selectedMember.taluka || "",
        pincode: selectedMember.pincode || "",
      }));

      // Hydrate dependent dropdowns based on state/district
      const selectedState = states.find((s) => s.stateName === selectedMember.state);
      if (selectedState) {
        const districts = dist.filter((d) => d.stateId === selectedState.id);
        setFilteredDistricts(districts);

        const selectedDistrict = districts.find((d) => d.district === selectedMember.district);
        if (selectedDistrict) {
          const subDistricts = subdist.filter((sd) => sd.districtId === selectedDistrict.id);
          setFilteredSubDistricts(subDistricts);
        }
      }

      // Update reciprocal info if available
      if (selectedMember.relation && selectedMember.gender) {
        updateReciprocalRelation(selectedMember.relation, selectedMember.gender);
      }

      // Open the dialog when editing
      setIsFormVisible(true);
    }
  }
}, [userdata, memberid, states, dist, subdist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formPayload = new FormData();
    Object.entries(member).forEach(([key, val]) => {
      formPayload.append(key, val);
    });
  
    try {
      // Check if this member is already registered
      const checkRes = await fetch(`/api/patient/search?query=${member.aadharCardNumber}`);
      const checkData = await checkRes.json();
      
      let endpoint = memberid
        ? `/api/patient/${userdata.id}/family-details/${memberid}`
        : `/api/patient/${userdata.id}/family-details`;
  
      // If member exists in database, use the registered endpoint
      if (checkRes.ok && checkData.patient && !memberid) {
        endpoint = `/api/patient/${userdata.id}/family-details`;
        formPayload.append('registeredPatientId', checkData.patient.id);
      }
  
      const res = await fetch(endpoint, {
        method: memberid ? "PUT" : "POST",
        body: formPayload,
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update the form.");
      }
  
      toast.success("Information updated successfully!");
      setMember(initialMemberState);
      setIsFormVisible(false);
      router.refresh(); // Use refresh instead of push to avoid full page reload
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setIsFormVisible(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Dialog
        open={isFormVisible}
        onOpenChange={(open) => {
          setIsFormVisible(open);
          if (!open) {
            setMember(initialMemberState);     // ✅ reset form
            setErrorMessage("");               // ✅ clear error message so toast won't fire
            setReciprocalRelation("");         // ✅ reset reciprocal relationship
            emailToastShownRef.current = false;
            emailValueRef.current = "";
            setFilteredDistricts([]);
            setFilteredSubDistricts([]);
          }
        }}
      >

        <DialogTrigger asChild>
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-[#5271FF] px-4 py-2 text-white rounded-xl"
          >
            {memberid ? "Edit" : "Add New Member"}
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
          <DialogHeader>
            <DialogTitle className="text-xl mt-2 font-bold text-[#5271FF] text-center">
              {memberid ? "Edit Member" : "Add New Member"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-1 space-y-3">
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
              <h4 className="font-semibold text-gray-800 text-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-[#5271FF]" />
                Member Information
              </h4>

              {/* Aadhaar Card */}
              <div>
                <Label htmlFor="aadharcard">Aadhar Card No *</Label>
                <Input
                  id="aadharCardNumber"
                  name="aadharCardNumber"
                  value={member.aadharCardNumber}
                  onChange={handleChange}
                  onBlur={() => checkAadharExists(member.aadharCardNumber)}  // <-- Trigger here
                  placeholder="Enter 12-digit Aadhar"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={member.email}
                  onChange={handleChange}
                  placeholder="Enter Email Address"
                  required
                />
              </div>


              {/* Full Name */}
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" name="firstName" value={member.firstName} onChange={handleChange} placeholder="Enter First Name" required />
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" name="middleName" value={member.middleName} onChange={handleChange} placeholder="Enter Middle Name" />
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" value={member.lastName} onChange={handleChange} placeholder="Enter Last Name" required />
              </div>




              {/* Relation */}
              <div>
                <Label>Relation *</Label>
                <Select
                  value={member.relation}
                  onValueChange={(value) => handleChange({ name: "relation", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Father", "Mother", "Husband", "Wife", "Brother", "Sister", "Spouse", "Son", "Daughter"].map((relation) => (
                      <SelectItem key={relation} value={relation}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> 
              </div>

              {/* Gender */}
              <div>
                <Label>Gender *</Label>
                <Select
                  value={member.gender}
                  onValueChange={(value) => handleChange({ name: "gender", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile */}
              <div>
                <Label>Mobile Number *</Label>
                <Input
                  type="number"
                  name="mobile"
                  value={member.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-Digit Mobile Number"
                  required
                />
              </div>

              {/* Blood Group */}
              <div>
                <Label>Blood Group *</Label>
                <Select
                  value={member.bloodgroup}
                  onValueChange={(value) => handleChange({ name: "bloodgroup", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age */}
              <div>
                <Label>Age *</Label>
                <Input
                  type="number"
                  name="age"
                  value={member.age}
                  onChange={handleChange}
                  placeholder="Enter Age"
                  min="0"
                  max="120"
                  required
                />
              </div>


              {/* State */}
              <div>
                <Label>State *</Label>
                <Select
                  value={member.state}
                  onValueChange={(value) => handleChange({ name: "state", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.id} value={s.stateName}>
                        {s.stateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div>
                <Label>District *</Label>
                <Select
                  value={member.district}
                  onValueChange={(value) => handleChange({ name: "district", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDistricts.map((d) => (
                      <SelectItem key={d.id} value={d.district}>
                        {d.district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Taluka */}
              <div>
                <Label>Taluka *</Label>
                <Select
                  value={member.taluka}
                  onValueChange={(value) => handleChange({ name: "taluka", value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Taluka" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubDistricts.map((sd) => (
                      <SelectItem key={sd.id} value={sd.subDistrict}>
                        {sd.subDistrict}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div>
                <Label>Address *</Label>
                <Input name="presentAddress" value={member.presentAddress} onChange={handleChange} placeholder="Enter Full Address" required />
              </div>

              {/* Pincode */}
              <div>
                <Label>Pincode *</Label>
                <Input
                  name="pincode"
                  value={member.pincode}
                  onChange={handleChange}
                  placeholder="Enter 6-Digit Pincode"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full px-6 bg-[#2b73ec] hover:bg-[#1c5bb7] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFamilymemberformClient;
