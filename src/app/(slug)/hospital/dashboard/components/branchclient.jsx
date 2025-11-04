"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/cutommaindailog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const BranchClient = ({ userdata, hspbranchid, state, dist, subdist }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [branch, setBranch] = useState({
    branchname: "",
    branchregno: "",
    branchcity: "",
    branchpincode: "",
    branchreceptionno1: "",
    branchreceptionno2: "",
    branchreceptionemail: "",
    branchaddress: "",
    branchmanagername: "",
    branchmanagerno: "",
    branchmanageremail: "",
    branchadminname: "",
    branchadminno: "",
    branchadminemail: "",

    state: "",
    district: "",

    taluka: "",
  });
  console.log("branchid", hspbranchid);

  // useEffect to load branch data based on hspbranchid
  useEffect(() => {
    if (userdata?.hspbranches && hspbranchid) {
      // Find the branch data based on hspbranchid
      const selectedBranch = userdata.hspbranches.find(
        (branch) => branch.id === hspbranchid
      );

      if (selectedBranch) {
        setBranch({
          branchname: selectedBranch.branchname || "",
          branchregno: selectedBranch.branchregno || "",
          branchcity: selectedBranch.branchcity || "",
          branchpincode: selectedBranch.branchpincode || "",
          branchreceptionno1: selectedBranch.branchreceptionno1 || "",
          branchreceptionno2: selectedBranch.branchreceptionno2 || "",
          branchreceptionemail: selectedBranch.branchreceptionemail || "",
          branchaddress: selectedBranch.branchaddress || "",
          branchmanagername: selectedBranch.branchmanagername || "",
          branchmanagerno: selectedBranch.branchmanagerno || "",
          branchmanageremail: selectedBranch.branchmanageremail || "",
          branchadminname: selectedBranch.branchadminname || "",
          branchadminno: selectedBranch.branchadminno || "",
          branchadminemail: selectedBranch.branchadminemail || "",
          state: selectedBranch.state || "",
          district: selectedBranch.district || "",
          taluka: selectedBranch.taluka || "",
        });
      }
    }
  }, [userdata, hspbranchid]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredSubDistricts, setFilteredSubDistricts] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation rules
    const onlyLetters = /^[A-Za-z\s]+$/; // Allows only letters and spaces
    const onlyNumbers = /^[0-9]+$/; // Allows only numbers
    const alphanumeric = /^[A-Za-z0-9]+$/; // Allows only alphanumeric characters

    // Define fields that should only contain letters
    const stringFields = [
      "name",
      "city",
      "branchadminname",
      "branchmanagername",
    ];

    // Define fields that should only contain numbers
    const numericFields = [
      "branchadminno",
      "branchmanagerno",
      "branchreceptionno1",
      "branchreceptionno2",
      "branchregno",
      "branchpincode",
    ];

    // Validate string fields
    if (stringFields.includes(name) && value && !onlyLetters.test(value)) {
      toast.error(`Invalid Input! ${name} should contain only letters.`);
      return;
    }

    // Validate numeric fields
    if (numericFields.includes(name) && value && !onlyNumbers.test(value)) {
      toast.error(`Invalid Input! ${name} should contain only numbers.`);
      return;
    }

    setBranch((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      const selectedState = state.find((state) => state.stateName === value);
      const districts = dist.filter(
        (district) => district.stateId === selectedState.id
      );
      setFilteredDistricts(districts);
      setFilteredSubDistricts([]);
      setBranch((prev) => ({
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
      setBranch((prev) => ({
        ...prev,
        taluka: "",
        district: selectedDistrict.district,
      }));
    }

    if (name === "taluka") {
      setBranch((prev) => ({
        ...prev,
        taluka: value,
      }));
    }
  };

  const handleBranches = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);

    const formPayload = new FormData();
    for (const key in branch) {
      formPayload.append(key, branch[key] || "");
    }

    try {
      const endpoint = hspbranchid
        ? `/api/hospital/${userdata.id}/hspbranches/${hspbranchid}`
        : `/api/hospital/${userdata.id}/hspbranches`;

      const registerRes = await fetch(endpoint, {
        method: hspbranchid ? "PUT" : "POST",
        body: formPayload,
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Failed to update the form.");
      }

      toast("Information updated successfully!");
      router.push(`/hospital/dashboard/branches`);
    } catch (error) {
      toast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button className="bg-blue-500 text-white rounded-xl hover:bg-blue-500 hover:opacity-100 transition-none">
            {" "}
            {hspbranchid ? "Edit" : "Add New Branch"}{" "}
          </Button>
        </DialogTrigger>
        <div className="bg-[#E9E8E9] ">
          <DialogContent>
              <DialogHeader>
                <div className="text-center justify-center mx-auto">
                  <h1 className="text-2xl font-bold text-blue-950">
                    Profile Information
                  </h1>
                  <p className="text-blue-950 font-semibold">
                    Required All Details
                  </p>
                </div>
              </DialogHeader>
              <form onSubmit={handleBranches}>
                <div className="w-full">
                  {/* 3 step form */}
                  <div className="space-y-4 ">
                    {/* 3*/}{" "}
                    <div>
                      {!hspbranchid && (
                        <>
                            <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                              <div className="w-full ">
                                <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                                  HSP Branch Name
                                </h1>
                                <Input
                                  name="branchname"
                                  type="text"
                                  className="pl-4"
                                  placeholder="Enter Name"
                                  //required
                                  value={branch.branchname}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="w-full ">
                                <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                                  HSP Branch Reg. Number*
                                </h1>
                                <Input
                                  name="branchregno"
                                  type="text"
                                  className="pl-4"
                                  placeholder="Enter Number"
                                  //required
                                  value={branch.branchregno}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="w-full ">
                                <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                                  {" "}
                                  Full Address*
                                </h1>
                                <Input
                                  name="branchaddress"
                                  type="text"
                                  className="pl-4"
                                  placeholder="Enter Full Address"
                                  //required
                                  value={branch.branchaddress}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="space-y-0 md:pt-2">
                              <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                                <div className="w-full relative">
                                  <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                                    State*
                                  </h1>
                                  <div className="relative">
                                    <Select
                                      value={branch.state || undefined}
                                      onValueChange={(value) =>
                                        handleChange({ target: { name: "state", value } })
                                      }
                                      required
                                    >
                                      <SelectTrigger className="w-full h-9 text-[14px] px-4 rounded-xl border-[1px] border-[#453565] text-gray-700 bg-transparent shadow-sm focus:ring-2 focus:ring-blue-300">
                                        <SelectValue placeholder="Select State" />
                                      </SelectTrigger>

                                      <SelectContent className="text-[10px] md:text-[11px] xl:text-[14px] bg-white shadow-lg rounded-lg">
                                        {state && Array.isArray(state) ? (
                                          state.map((stateItem) => (
                                            <SelectItem
                                              key={stateItem.id}
                                              value={stateItem.stateName}
                                              className="cursor-pointer hover:bg-gray-100"
                                            >
                                              {stateItem.stateName}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <SelectItem value="loading" disabled>
                                            Loading states...
                                          </SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>    
                                  </div>
                                </div>
                                <div className="w-full">
    <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
      District*
    </h1>
    <Select
      value={branch.district || undefined}
      onValueChange={(value) =>
        handleChange({ target: { name: "district", value } })
      }
      required
    >
      <SelectTrigger className="w-full h-9 text-[14px] px-4 rounded-xl border-[1px] border-[#453565] text-gray-700 bg-transparent shadow-sm focus:ring-2 focus:ring-blue-300">
        <SelectValue placeholder="Select District" />
      </SelectTrigger>
      <SelectContent className="text-[10px] md:text-[11px] xl:text-[14px] bg-white shadow-lg rounded-lg">
        {filteredDistricts.map((district) => (
          <SelectItem
            key={district.id}
            value={district.district}
            className="cursor-pointer hover:bg-gray-100"
          >
            {district.district}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
                                </div>
                                <div className="w-full ">
                                  <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                                    Taluka*
                                  </h1>
                                  <Select
                                    value={branch.taluka || undefined}
                                    onValueChange={(value) =>
                                      handleChange({ target: { name: "taluka", value } })
                                    }
                                    required
                                  >
                                    <SelectTrigger className="w-full h-9 text-[14px] px-4 rounded-xl border-[1px] border-[#453565] text-gray-700 bg-transparent shadow-sm focus:ring-2 focus:ring-blue-300">
                                      <SelectValue placeholder="Select Taluka" />
                                    </SelectTrigger>
                                    <SelectContent className="text-[10px] md:text-[11px] xl:text-[14px] bg-white shadow-lg rounded-lg">
                                      {filteredSubDistricts.map((subDistrict) => (
                                        <SelectItem
                                          key={subDistrict.id}
                                          value={subDistrict.subDistrict}
                                          className="cursor-pointer hover:bg-gray-100"
                                        >
                                          {subDistrict.subDistrict}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                        </>
                      )}

                      {/* 4 */}
                      <div className="space-y-0 md:pt-2">
                        <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch City*
                            </h1>
                            <Input
                              name="branchcity"
                              type="text"
                              className="pl-4"
                              placeholder="Enter City"
                              //required
                              value={branch.branchcity}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch 1 Pin Code*
                            </h1>
                            <Input
                              name="branchpincode"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Pin Code"
                              maxLength="6"
                              value={branch.branchpincode}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Reception Number 1*
                            </h1>
                            <Input
                              name="branchreceptionno1"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Number"
                              //required
                              value={branch.branchreceptionno1}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      {/* 5 */}
                      <div className="space-y-0 md:pt-2">
                        <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Reception Number 2*
                            </h1>
                            <Input
                              name="branchreceptionno2"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Number"
                              //required
                              value={branch.branchreceptionno2}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Reception Email ID*
                            </h1>
                            <Input
                              name="branchreceptionemail"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Email ID"
                              //required
                              value={branch.branchreceptionemail}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch Manager Full Name*
                            </h1>
                            <Input
                              name="branchmanagername"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Name"
                              //required
                              value={branch.branchmanagername}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-0 md:pt-2">
                        <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch Manager Number*
                            </h1>
                            <Input
                              name="branchmanagerno"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Number"
                              //required
                              value={branch.branchmanagerno}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch Manager Email ID*
                            </h1>
                            <Input
                              name="branchmanageremail"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Email ID"
                              //required
                              value={branch.branchmanageremail}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch Admin Full Name*
                            </h1>
                            <Input
                              name="branchadminname"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Name"
                              //required
                              value={branch.branchadminname}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-0 md:pt-2">
                        <div className="flex md:space-x-4 flex-wrap md:flex-nowrap">
                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch Admin Number*
                            </h1>
                            <Input
                              name="branchadminno"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Number"
                              //required
                              value={branch.branchadminno}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="w-full ">
                            <h1 className="text-[#FF5E00] font-bold text-1xl xs:text-[10px] sm:text-[10px] ml-4 font-poppins">
                              {" "}
                              Branch Admin Email ID*
                            </h1>
                            <Input
                              name="branchadminemail"
                              type="text"
                              className="pl-4"
                              placeholder="Enter Email ID"
                              //required
                              value={branch.branchadminemail}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="w-full "></div>
                        </div>
                      </div>
                    </div>
                    <div className="mx-auto w-full flex items-center justify-center">
                      {" "}
                      <button
                        className="w-full bg-blue-600 rounded-xl p-3 shadow-2xl border border-[#243460] text-white font-bold"
                        type="submit"
                      >
                        {isLoading ? "submitting Please wait.." : "Save Form"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default BranchClient;
