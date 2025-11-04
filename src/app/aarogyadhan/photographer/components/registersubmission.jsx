"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PhotographerRegistrationForm from "./photographer-register";

const PhotographerRegistrationLogic = ({ state, dist, subdist }) => {
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    mobile: "",
    pincode: "",
    city: "",
    taluka: "",
    district: "",
    stateName: "",
    password: "",
    confirmPassword: "",
    passportphoto: null,
    aadharcardno: "",
    aadharcardimage: null,
    companyname: "",
    pancardno: "",
    pancardimage: null,
    companyaddress: "",
    alternateno: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    cancelledCheque: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);

  const router = useRouter();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleStateChange = useCallback(
    (e) => {
      const selectedState = state.find((s) => s.stateName === e.target.value);
      if (selectedState) {
        const districts = dist.filter((d) => d.stateId === selectedState.id);
        setFilteredDistricts(districts);
        setFilteredSubDistricts([]);
        setFormData((prevData) => ({
          ...prevData,
          stateName: selectedState.stateName,
          district: "",
          taluka: "",
        }));
      }
    },
    [state, dist]
  );

  const handleDistrictChange = useCallback(
    (e) => {
      const selectedDistrict = dist.find((d) => d.district === e.target.value);
      if (selectedDistrict) {
        const subDistricts = subdist.filter(
          (sd) => sd.districtId === selectedDistrict.id
        );
        setFilteredSubDistricts(subDistricts);
        setFormData((prevData) => ({
          ...prevData,
          district: selectedDistrict.district,
          taluka: "",
        }));
      }
    },
    [dist, subdist]
  );

  const handleRegistration = useCallback(
    async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/aarogyadhan/photographer/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          toast.success(result.message);
          router.push("/aarogyadhan/photographer/dashboard");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, router]
  );

  return (
    <PhotographerRegistrationForm
      formData={formData}
      setFormData={setFormData} // Pass setFormData here
      handleInputChange={handleInputChange}
      handleStateChange={handleStateChange}
      handleDistrictChange={handleDistrictChange}
      handleRegistration={handleRegistration}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      isSubmitting={isSubmitting}
      filteredDistricts={filteredDistricts}
      filteredSubDistricts={filteredSubDistricts}
      state={state}
      dist={dist}
      subdist={subdist}
    />
  );
};

export default PhotographerRegistrationLogic;
