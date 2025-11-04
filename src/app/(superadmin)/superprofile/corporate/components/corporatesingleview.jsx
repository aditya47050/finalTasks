"use client";

import Docviewer from "@/app/patient/dashboard/components/docviewer";
import { Building2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CorporateSingleView = ({ userdata }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const formatText = (text) => {
    return text
      ? text
          .toString()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "N/A";
  };

  const maskNumber = (num) => {
    return num ? `${num}` : "N/A";
  };

  const [remark, setRemark] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(userdata);
  const [loading, setLoading] = useState(false);
  const CorporateCertificateId = userdata.CorporateCertificate?.id || userdata.CorporateCertificate?.[0]?.id;
  const [currentAction, setCurrentAction] = useState(null);
  const [currentCorporateCertificateId, setCurrentCorporateCertificateId] =
    useState(CorporateCertificateId);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState(
    userdata.CorporateCertificate?.approvalStatus ||
    userdata.CorporateCertificate?.[0]?.approvalStatus ||
    "Pending"
  );

  const corporatefields = [
    "companyName", "companyType", "cinNumber", "dateOfIncorporation",
    "companyPan", "gstNumber", "employeeCount", "corporateHealthInsurance",
    "factoryInspector", "presentAddress", "city", "state", "district",
    "taluka", "pincode", "bankName", "bankAccountNumber", "ifscCode",
    "accountType", "companyLogo", "cancelledCheque", "contactPersonName",
    "contactPersonRelation", "additionalEmail", "emergencyContact", "email", "mobile"
  ];

  const issues = [
    ...corporatefields.map(
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
        `/api/corporate/${userdata.id}/approvalstatus`,
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
        throw new Error(`Failed to update corporate certificate: ${errorMessage}`);
      }

      const updatedCard = await response.json();
      const newStatus = updatedCard?.updatedCorporateCertificate?.approvalStatus;
      setApprovalStatus(newStatus || approvalStatus);

      setData((prevData) => ({
        ...prevData,
        CorporateCertificate: Array.isArray(prevData.CorporateCertificate)
          ? [
              {
                ...(prevData.CorporateCertificate[0] || {}),
                approvalStatus: newStatus || approvalStatus,
              },
            ]
          : {
              ...(prevData.CorporateCertificate || {}),
              approvalStatus: newStatus || approvalStatus,
            },
      }));

      toast.success(
        `Corporate has been ${currentAction === "approve" ? "approved" : "rejected"} successfully!`
      );

      closeModal();
    } catch (error) {
      console.error("Error updating corporate certificate:", error.message);
      toast("Failed to update approval status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentCertStatus =
    (Array.isArray(userdata.CorporateCertificate)
      ? userdata.CorporateCertificate[0]?.approvalStatus
      : userdata.CorporateCertificate?.approvalStatus) || "PENDING";

  return (
    <div className="min-h-screen font-poppins py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 h-40 relative">
          <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h1 className="text-2xl font-semibold">
              {formatText(userdata.companyName) || "Corporate"}
            </h1>
            <p className="text-sm">Contact: {userdata.mobile || "N/A"}</p>
            <p className="text-sm">Email: {userdata.email || "N/A"}</p>
          </div>
          {userdata.companyLogo ? (
            <Image
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover"
              src={userdata.companyLogo}
              alt="Company Logo"
              width={400}
              height={400}
            />
          ) : (
            <Building2
              className="absolute bottom-[-40px] right-4 w-24 h-24 rounded-full border-4 border-white object-cover bg-indigo-600"
              color="#ffff"
            />
          )}
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Corporate Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Corporate Information
              </h2>
              <ul className="mt-4 space-y-3">
                <li>Company Type: {formatText(userdata.companyType)}</li>
                <li>CIN Number: {userdata.cinNumber || "N/A"}</li>
                <li>
                  Date of Incorporation:{" "}
                  {userdata.dateOfIncorporation
                    ? new Date(userdata.dateOfIncorporation).toLocaleDateString("en-GB")
                    : "N/A"}
                </li>
                <li>Employees: {userdata.employeeCount ?? "N/A"}</li>
                <li>Corporate Health Insurance: {userdata.corporateHealthInsurance ? "Yes" : "No"}</li>
                <li>Factory Inspector: {userdata.factoryInspector ? "Yes" : "No"}</li>
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
                <li>Additional Email: {userdata.additionalEmail || "N/A"}</li>
                <li>Emergency Contact: {userdata.emergencyContact || "N/A"}</li>
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
              <li>Present Address: {userdata.presentAddress || "N/A"}</li>
              <li>City: {userdata.city || "N/A"}</li>
              <li>State: {userdata.state || "N/A"}</li>
              <li>District: {userdata.district || "N/A"}</li>
              <li>Taluka: {userdata.taluka || "N/A"}</li>
            </ul>
          </div>

          {/* About (kept for parity with pharmacy; shows N/A if not present) */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              About
            </h2>
            <p className="mt-2 text-gray-600">
              {showFullDesc
                ? userdata.about || "N/A"
                : (userdata.about?.slice(0, 200) || "N/A") + "..."}
              {userdata.about?.length > 200 && (
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
                Account Number: {maskNumber(userdata.bankAccountNumber)}
              </li>
              <li>IFSC Code: {userdata.ifscCode || "N/A"}</li>
              <li>Account Type: {formatText(userdata.accountType)}</li>
            </ul>
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              Uploaded Documents
            </h2>
            <ul className="mt-4 space-y-3">
              <li>PAN: {maskNumber(userdata.companyPan)}</li>
              <li>GST Number: {maskNumber(userdata.gstNumber)}</li>
            </ul>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Document Files
              </h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Cancelled Cheque
                  </label>
                  <Docviewer
                    userdata={userdata.cancelledCheque}
                    title="Cancelled Cheque"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Company Logo
                  </label>
                  <Docviewer
                    userdata={userdata.companyLogo}
                    title="Company Logo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Employee ID Card
                  </label>
                  <Docviewer
                    userdata={userdata.employeeIdCard}
                    title="Employee ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Aadhar Front
                  </label>
                  <Docviewer
                    userdata={userdata.aadharCardFront}
                    title="Aadhar Front"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Aadhar Back
                  </label>
                  <Docviewer
                    userdata={userdata.aadharCardBack}
                    title="Aadhar Back"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    PAN
                  </label>
                  <Docviewer
                    userdata={userdata.panCard}
                    title="PAN"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Approvals Section */}
          <div className="my-2 mx-2 flex gap-2 justify-center">
            {currentCertStatus === "APPROVED" ? (
              <>
                <button className="bg-green-600 text-white px-6 py-2 rounded-xl">
                  Approved
                </button>
              </>
            ) : currentCertStatus === "REJECTED" ? (
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
                    openModal("approve", userdata.CorporateCertificate?.id || userdata.CorporateCertificate?.[0]?.id)
                  }
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded-xl"
                  onClick={() =>
                    openModal("reject", userdata.CorporateCertificate?.id || userdata.CorporateCertificate?.[0]?.id)
                  }
                >
                  Reject
                </button>
              </>
            )}

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

export default CorporateSingleView;