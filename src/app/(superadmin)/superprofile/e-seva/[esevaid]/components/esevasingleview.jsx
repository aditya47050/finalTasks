"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Clock,
  CreditCard,
  Users,
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EsevaSingleView = ({ esevaData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const router = useRouter();
  const esevaId = esevaData.id;

  const generateEsevaIssues = () => {
    const documentIssues = [
      "Missing Shop Act Document",
      "Invalid Shop Act License",
      "Missing Registration Certificate",
      "Invalid Registration Certificate",
      "Missing Address Proof Document",
      "Invalid Address Proof",
      "Missing Incharge Aadhar Document",
      "Invalid Incharge Aadhar Card",
      "Missing Incharge PAN Document",
      "Invalid Incharge PAN Card",
      "Document Quality Issues",
      "Expired Documents",
    ];

    const personalInfoIssues = [
      "Incorrect Center Name",
      "Invalid Address Details",
      "Incorrect District Information",
      "Invalid State Information",
      "Incorrect Pincode",
      "Invalid Mobile Number",
      "Invalid Email Address",
      "Incorrect Incharge Name",
      "Invalid Incharge Details",
    ];

    const bankingIssues = [
      "Missing Banking Details",
      "Invalid Bank Account Number",
      "Incorrect IFSC Code",
      "Missing Cancelled Cheque",
      "Invalid Account Type",
      "Banking Information Mismatch",
    ];

    const verificationIssues = [
      "Location Verification Failed",
      "Background Check Failed",
      "Reference Verification Failed",
      "Physical Verification Pending",
      "Compliance Issues",
    ];

    const generalIssues = [
      "Incomplete Application",
      "Information Mismatch",
      "Duplicate Application",
      "Other",
    ];

    return [
      ...documentIssues,
      ...personalInfoIssues,
      ...bankingIssues,
      ...verificationIssues,
      ...generalIssues,
    ];
  };

  const issues = generateEsevaIssues();

  const toggleIssue = (issue) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleViewDocument = (document) => {
    setCurrentDocument(document);
    setIsDocumentModalOpen(true);
  };

  const closeDocumentModal = () => {
    setIsDocumentModalOpen(false);
    setCurrentDocument(null);
  };

  const getDocumentsList = () => {
    const documents = [];

    if (esevaData.shopactdoc) {
      documents.push({
        name: "Shop Act License",
        type: "Shop Act Document",
        url: esevaData.shopactdoc,
        status: "Uploaded",
        uploadDate: esevaData.createdAt,
      });
    }

    if (esevaData.regcertificate) {
      documents.push({
        name: "Registration Certificate",
        type: "Business Registration",
        url: esevaData.regcertificate,
        status: "Uploaded",
        uploadDate: esevaData.createdAt,
      });
    }

    if (esevaData.addressproofdoc) {
      documents.push({
        name: "Address Proof Document",
        type: "Address Verification",
        url: esevaData.addressproofdoc,
        status: "Uploaded",
        uploadDate: esevaData.createdAt,
      });
    }

    if (esevaData.inchargeaadhardoc) {
      documents.push({
        name: "Incharge Aadhar Card",
        type: "Identity Proof",
        url: esevaData.inchargeaadhardoc,
        status: "Uploaded",
        uploadDate: esevaData.createdAt,
      });
    }

    if (esevaData.inchargepandoc) {
      documents.push({
        name: "Incharge PAN Card",
        type: "Tax Document",
        url: esevaData.inchargepandoc,
        status: "Uploaded",
        uploadDate: esevaData.createdAt,
      });
    }

    if (esevaData.cancelledCheque) {
      documents.push({
        name: "Cancelled Cheque",
        type: "Banking Document",
        url: esevaData.cancelledCheque,
        status: "Uploaded",
        uploadDate: esevaData.createdAt,
      });
    }

    return documents;
  };

  const documents = getDocumentsList();

  if (!esevaData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No data available
          </h3>
          <p className="text-sm text-muted-foreground">
            E-seva center information could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    mobile,
    alternatemobile,
    address,
    district,
    state,
    taluka,
    pincode,
    incharge,
    inchargeaadharno,
    inchargepanno,
    esevacode,
    status,
    createdAt,
    updatedAt,
    logo,
    inchargeprofilepic,
    bankName,
    accountNumber,
    ifscCode,
    accountType,
    micrCode,
    patients,
    payment,
  } = esevaData;

  const stats = [
    {
      title: "Registered Patients",
      value: patients?.length?.toString() || "0",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Payments",
      value: payment?.length?.toString() || "0",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: `₹${
        payment?.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2) ||
        "0.00"
      }`,
      icon: IndianRupee,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Status",
      value: status || "PENDING",
      icon:
        status === "APPROVED"
          ? CheckCircle
          : status === "REJECTED"
          ? XCircle
          : AlertCircle,
      color:
        status === "APPROVED"
          ? "text-green-600"
          : status === "REJECTED"
          ? "text-red-600"
          : "text-yellow-600",
      bgColor:
        status === "APPROVED"
          ? "bg-green-50"
          : status === "REJECTED"
          ? "bg-red-50"
          : "bg-yellow-50",
    },
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

  const handleApproval = async () => {
    if (
      currentAction === "reject" &&
      remark.trim() === "" &&
      selectedIssues.length === 0
    ) {
      toast.error("Please provide a remark or select issues for rejection!");
      return;
    }

    try {
      setLoading(true);
      const fullRemark =
        selectedIssues.length > 0
          ? `${remark}\n\nIssues:\n- ${selectedIssues.join("\n- ")}`
          : remark;

      const response = await fetch(`/api/e-seva/${esevaId}/approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: currentAction,
          remark: fullRemark.trim() || null,
          issues: selectedIssues.length > 0 ? selectedIssues : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update E-seva center status"
        );
      }

      const data = await response.json();
      toast.success(
        `E-seva center ${
          currentAction === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      closeModal();
      router.refresh();
    } catch (error) {
      console.error("Error updating E-seva center:", error);
      toast.error(error.message || "Failed to update E-seva center status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-800 text-white p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 border-4 border-white/20">
                  <AvatarImage
                    src={logo || "/placeholder.svg?height=96&width=96"}
                    alt="E-seva Logo"
                  />
                  <AvatarFallback className="text-2xl bg-white/20 text-white">
                    <Building2 className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {name || "E-seva Center"}
                  </h1>
                  {esevacode && (
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-800 border-white/30 font-medium"
                    >
                      {esevacode}
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className={`font-medium ${
                      status === "APPROVED"
                        ? "bg-green-500 text-white border-green-400"
                        : status === "REJECTED"
                        ? "bg-red-500 text-white border-red-400"
                        : "bg-yellow-500 text-white border-yellow-400"
                    }`}
                  >
                    {status || "PENDING"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-white/90 mb-4">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{mobile}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {district}, {state} - {pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Center Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Center Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Center Name
              </p>
              <p className="text-sm">{name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                E-seva Code
              </p>
              <p className="text-sm font-mono">{esevacode || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p className="text-sm">{address || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  District
                </p>
                <p className="text-sm">{district || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  State
                </p>
                <p className="text-sm">{state || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taluka
                </p>
                <p className="text-sm">{taluka || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pincode
                </p>
                <p className="text-sm">{pincode || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mobile
                </p>
                <p className="text-sm">{mobile || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Alternate Mobile
                </p>
                <p className="text-sm">{alternatemobile || "N/A"}</p>
              </div>
            </div>

            <Separator />
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Created: {new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated: {new Date(updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incharge Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Incharge Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={inchargeprofilepic || "/placeholder.svg"}
                  alt="Incharge Photo"
                />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{incharge || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Center Incharge</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Aadhar Number
              </p>
              <p className="text-sm font-mono">{inchargeaadharno || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                PAN Number
              </p>
              <p className="text-sm font-mono">{inchargepanno || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banking Details */}
      {(bankName || accountNumber) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Banking Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bankName && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Bank Name
                  </p>
                  <p className="text-sm">{bankName}</p>
                </div>
              )}
              {accountNumber && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Number
                  </p>
                  <p className="text-sm font-mono">{accountNumber}</p>
                </div>
              )}
              {ifscCode && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    IFSC Code
                  </p>
                  <p className="text-sm font-mono">{ifscCode}</p>
                </div>
              )}
              {accountType && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Type
                  </p>
                  <p className="text-sm">{accountType}</p>
                </div>
              )}
              {micrCode && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    MICR Code
                  </p>
                  <p className="text-sm font-mono">{micrCode}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submitted Documents ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{document.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded:{" "}
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 border-green-200"
                    >
                      {document.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDocument(document)}
                      className="flex items-center rounded-xl gap-1 text-xs px-3 py-1 h-8"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Patients */}
      {patients && patients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Patients ({patients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.slice(0, 5).map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={patient.passportPhoto || "/placeholder.svg"}
                        alt="Patient Photo"
                      />
                      <AvatarFallback>
                        {patient.firstName?.[0]}
                        {patient.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {" "}
                      <Link href={`/superprofile/patient/${patient.id}`}>
                        <p className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </p>{" "}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Registered</Badge>
                </div>
              ))}
              {patients.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {patients.length - 5} more patients...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Payments */}
      {payment && payment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Recent Payments ({payment.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payment.slice(0, 5).map((pay, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border"
                >
                  <div>
                    <p className="font-medium">₹{pay.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {pay.forwhat || "Service Payment"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(pay.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      pay.paymentStatus === "SUCCESS" ? "default" : "secondary"
                    }
                    className={
                      pay.paymentStatus === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {pay.paymentStatus}
                  </Badge>
                </div>
              ))}
              {payment.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {payment.length - 5} more payments...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-center"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => openModal("approve")}
              className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
            >
              Approve
            </Button>
            <Button
              onClick={() => openModal("reject")}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approval Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="E-seva Approval"
        className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[600px] overflow-y-auto mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {currentAction === "approve"
            ? "Approve E-seva Center"
            : "Reject E-seva Center"}
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
          <button
            onClick={closeModal}
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleApproval}
            className={`${
              currentAction === "approve" ? "bg-green-500" : "bg-red-500"
            } text-white px-4 py-2 rounded`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : currentAction === "approve"
              ? "Confirm Approval"
              : "Confirm Rejection"}
          </button>
        </div>
      </Modal>

      {/* Document Viewer Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={isDocumentModalOpen}
        onRequestClose={closeDocumentModal}
        contentLabel="Document Viewer"
        className="bg-white p-6 rounded-xl mt-8 shadow-lg max-w-4xl max-h-[90vh] overflow-y-auto mx-auto"
      >
        {currentDocument && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{currentDocument.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentDocument.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(currentDocument.url, "_blank")}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = currentDocument.url;
                    link.download = currentDocument.name;
                    link.click();
                  }}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-gray-50">
              {currentDocument.url.toLowerCase().includes(".pdf") ? (
                <iframe
                  src={currentDocument.url}
                  className="w-full h-[600px]"
                  title={currentDocument.name}
                />
              ) : (
                <img
                  src={currentDocument.url || "/placeholder.svg"}
                  alt={currentDocument.name}
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={closeDocumentModal} variant="outline">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EsevaSingleView;
