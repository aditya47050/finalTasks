"use client";

import Docviewer from "@/app/patient/dashboard/components/docviewer";
import { Building2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

const PharmacySingleView = ({ userdata }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Format text properly
  const formatText = (text) => {
    return text
      ? text
          .toString()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "N/A";
  };

  // Mask sensitive numbers (show only last 4 digits)
  const maskNumber = (num) => {
    return num ? `${num}` : "N/A";
  };

  //remark
  const [remark, setRemark] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(userdata);
  const [loading, setLoading] = useState(false);
  const PharmacyCertificateId = userdata.PharmacyCertificate?.id;
  const [currentAction, setCurrentAction] = useState(null);
  const [currentPharmacyCertificateId, setCurrentPharmacyCertificateId] =
    useState(PharmacyCertificateId);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState(
    userdata.PharmacyCertificate?.approvalStatus || "Pending"
  );

  const pharmacyfields = [
    "regname", "regno", "regdate", "regcertificate", "pharmacypancardno",
    "pharmacypancarddoc", "servicetimeinday", "servicetimeinweek",
    "onlineplotformservice", "homedelivery", "pharmacytype", "TotalregPharmacist",
    "fulladdress", "city", "state", "district", "taluka", "primarycontactno",
    "alternatemobile", "secondaryemail", "bankName", "accountNumber",
    "ifscCode", "accountType", "cancelledCheque", "micrCode", "pharmacylogo",
    "aboutus", "email", "mobile", "pincode"
  ];

  const issues = [
    ...pharmacyfields.map(
      (field) => `Incorrect ${field.charAt(0).toUpperCase() + field.slice(1)}`
    ),
    "Missing Documents",
    "Invalid Registration Details",
    "Document Quality Issues",
    "Other",
  ];

  const openModal = (action) => {
    setCurrentAction(action);
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
    if (currentAction === "reject" && !remark.trim() && selectedIssues.length === 0) {
      toast.error("Please provide a remark or select issues for rejection!");
      return;
    }
    try {
      setLoading(true);

      const fullRemark = selectedIssues.length > 0
        ? `${remark ? remark + '\n\n' : ''}Issues:\n- ${selectedIssues.join("\n- ")}`
        : remark;

      const response = await fetch(
        `/api/pharmacy/${userdata.id}/approvalstatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approvalStatus:
              currentAction === "approve" ? "APPROVED" : "REJECTED",
            remark: fullRemark.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update pharmacy certificate: ${errorMessage}`);
      }

      const updatedCard = await response.json();
      setApprovalStatus(updatedCard?.updatedPharmacyCertificate?.approvalStatus);

      setData((prevData) => ({
        ...prevData,
        PharmacyCertificate: {
          ...prevData.PharmacyCertificate,
          approvalStatus: updatedCard?.updatedPharmacyCertificate?.approvalStatus,
        },
      }));

      toast.success(
        `Pharmacy has been ${currentAction === "approve" ? "approved" : "rejected"} successfully!`
      );

      closeModal();
    } catch (error) {
      console.error("Error updating pharmacy certificate:", error.message);
      toast("Failed to update approval status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-poppins py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 h-40 relative">
          <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              {formatText(userdata.regname) || "Pharmacy"}
            </h1>
            <p className="text-sm">Contact: {userdata.mobile || "N/A"}</p>
            <p className="text-sm">Email: {userdata.email || "N/A"}</p>
          </div>
          {userdata.pharmacylogo ? (
            <Image
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover"
              src={userdata.pharmacylogo}
              alt="Pharmacy Logo"
              width={400}
              height={400}
            />
          ) : (
            <Building2
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover bg-green-600"
              color="#ffff"
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pharmacy's Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Pharmacy Information
              </h2>
              <ul className="mt-4 space-y-3">
                <li>Registration Number: {userdata.regno || "N/A"}</li>
                <li>
                  Registration Date:{" "}
                  {userdata.regdate
                    ? new Date(userdata.regdate).toLocaleDateString("en-GB")
                    : "N/A"}
                </li>
                <li>Pharmacy Type: {formatText(userdata.pharmacytype)}</li>
                <li>Total Registered Pharmacists: {userdata.TotalregPharmacist || "N/A"}</li>
                <li>Service Time in Day: {userdata.servicetimeinday || "N/A"}</li>
                <li>Service Time in Week: {userdata.servicetimeinweek || "N/A"}</li>
                <li>Online Platform Service: {userdata.onlineplotformservice ? "Yes" : "No"}</li>
                <li>Home Delivery: {userdata.homedelivery ? "Yes" : "No"}</li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Contact Information
              </h2>
              <ul className="mt-4 space-y-3">
                <li>Email: {userdata.email || "N/A"}</li>
                <li>Mobile: {userdata.mobile || "N/A"}</li>
                <li>Primary Contact: {userdata.primarycontactno || "N/A"}</li>
                <li>Alternate Mobile: {userdata.alternatemobile || "N/A"}</li>
                <li>Secondary Email: {userdata.secondaryemail || "N/A"}</li>
                <li>Pincode: {userdata.pincode || "N/A"}</li>
              </ul>
            </div>
          </div>

          {/* Address Information */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Address Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li>Full Address: {userdata.fulladdress || "N/A"}</li>
              <li>City: {userdata.city || "N/A"}</li>
              <li>State: {userdata.state || "N/A"}</li>
              <li>District: {userdata.district || "N/A"}</li>
              <li>Taluka: {userdata.taluka || "N/A"}</li>
            </ul>
          </div>

          {/* About Us */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              About Us
            </h2>
            <p className="mt-2 text-gray-600">
              {showFullDesc
                ? userdata.aboutus || "N/A"
                : (userdata.aboutus?.slice(0, 200) || "N/A") + "..."}
              {userdata.aboutus?.length > 200 && (
                <button
                  className="text-blue-500 ml-2"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
          </div>

          {/* Banking Details */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Banking Information
            </h2>
            <ul className="mt-4 space-y-3">
              <li>Bank Name: {userdata.bankName || "N/A"}</li>
              <li>
                Account Number: {maskNumber(userdata.accountNumber)}
              </li>
              <li>IFSC Code: {userdata.ifscCode || "N/A"}</li>
              <li>MICR Code: {userdata.micrCode || "N/A"}</li>
              <li>Account Type: {formatText(userdata.accountType)}</li>
            </ul>
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Uploaded Documents
            </h2>
            <ul className="mt-4 space-y-3">
              <li>PAN Number: {maskNumber(userdata.pharmacypancardno)}</li>
            </ul>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Document Files
              </h2>

              {/* Documents Grid with Labels */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Registration Certificate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Registration Certificate
                  </label>
                  <Docviewer
                    userdata={userdata.regcertificate}
                    title="Registration Certificate"
                  />
                </div>

                {/* PAN Card Document */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    PAN Card Document
                  </label>
                  <Docviewer
                    userdata={userdata.pharmacypancarddoc}
                    title="PAN Card Document"
                  />
                </div>

                {/* Cancelled Cheque */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Cancelled Cheque
                  </label>
                  <Docviewer
                    userdata={userdata.cancelledCheque}
                    title="Cancelled Cheque"
                  />
                </div>

                {/* Pharmacy Logo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Pharmacy Logo
                  </label>
                  <Docviewer
                    userdata={userdata.pharmacylogo}
                    title="Pharmacy Logo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacists Section */}
          {userdata.Pharmacist && userdata.Pharmacist.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Registered Pharmacists ({userdata.Pharmacist.length})
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {userdata.Pharmacist.map((pharmacist, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold">{pharmacist.fullname || "N/A"}</h3>
                    <p className="text-sm text-gray-600">Reg No: {pharmacist.regno || "N/A"}</p>
                    <p className="text-sm text-gray-600">Gender: {pharmacist.gender || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Branches Section */}
          {userdata.pharmacybranch && userdata.pharmacybranch.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Pharmacy Branches ({userdata.pharmacybranch.length})
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {userdata.pharmacybranch.map((branch, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold">{branch.branchname || "N/A"}</h3>
                    <p className="text-sm text-gray-600">Address: {branch.branchaddress || "N/A"}</p>
                    <p className="text-sm text-gray-600">Contact: {branch.branchcontact || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Approve and Reject Buttons */}
          <div className="my-2 mx-2 flex gap-2 justify-center">
            {userdata?.PharmacyCertificate?.approvalStatus === "APPROVED" ? (
              <>
                <button className="bg-green-600 text-white px-6 py-2 rounded-xl">
                  Approved
                </button>
              </>
            ) : userdata?.PharmacyCertificate?.approvalStatus === "REJECTED" ? (
              <>
                <button className="bg-gray-600 text-white px-6 py-2 rounded-xl">
                  Rejected
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-xl"
                  onClick={() =>
                    openModal("approve", userdata.PharmacyCertificate?.id)
                  }
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded-xl"
                  onClick={() =>
                    openModal("reject", userdata.PharmacyCertificate?.id)
                  }
                >
                  Reject
                </button>
              </>
            )}

            {/* Modal for remark and issue selection */}
            {isModalOpen && (
              <div className="fixed inset-0 z-10 container max-w-max bg-white p-6 rounded-xl mt-16 shadow-lg h-[400px] overflow-y-auto mx-auto">
                <div className="bg-white p-6 rounded-xl max-w-max">
                  <h3 className="text-xl font-semibold">Add Remark</h3>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter remarks"
                    className="mt-4 w-full p-2 border rounded-xl"
                  ></textarea>

                  {currentAction === "reject" && (
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {issues.map((issue) => (
                        <label key={issue} className="block">
                          <input
                            type="checkbox"
                            value={issue}
                            onChange={() => toggleIssue(issue)}
                          />
                          {issue}
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmitRemark}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      onClick={closeModal}
                      className="ml-4 bg-gray-300 text-black px-6 py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacySingleView;