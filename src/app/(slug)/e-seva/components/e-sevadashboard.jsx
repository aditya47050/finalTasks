"use client";
import {
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  CreditCard,
  Upload,
  Eye,
  Edit,
  Download,
  TrendingUp,

} from "lucide-react";
import { MdVerified, MdPending, MdError } from "react-icons/md";
import { FaBank, FaBuilding } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi2";
import Link from "next/link";
import Image from "next/image";

const quickActions = [
  {
    label: "Register New Patient",
    path: "/e-seva/dashboard/register-patients",
    icon: <Users className="h-6 w-6 text-blue-600" />,
    roles: ["Eseva", "SubAdmin", "Asha"], 
    restricted: true, 
    color: "blue",
    desc: "Add new patient records",
  },
  {
    label: "View All Patients",
    path: "/e-seva/dashboard/view-patients",
    icon: <Eye className="h-6 w-6 text-green-600" />,
    roles: ["Eseva", "SubAdmin", "Asha"],
    restricted: true,
    color: "green",
    desc: "Manage patient database",
  },
  {
    label: "Upload Documents",
    path: "/e-seva/dashboard/profile",
    icon: <FileText className="h-6 w-6 text-purple-600" />,
    roles: ["SubAdmin"],
    restricted: false,
    color: "purple",
    desc: "Submit required documents",
  },
  {
    label: "Payments",
    path: "/e-seva/dashboard/payment",
    icon: <Download className="h-6 w-6 text-purple-600" />,
    roles: ["Eseva", "Asha"], // only Eseva admins
    restricted: false,
    color: "purple",
    desc: "Payments & transactions",
  },
  {
    label: "Update Profile",
    path: "/e-seva/dashboard/profile",
    icon: <Upload className="h-6 w-6 text-orange-600" />,
    roles: ["Eseva", "SubAdmin", "Asha"],
    restricted: false,
    color: "orange",
    desc: "Edit personal information",
  },
];


const EsevaDashboard = ({ data, role }) => {
  // Determine if user is SubAdmin
  const isSubAdmin = role === "SubAdmin";
  
  // Get the actual data object
  const userData = isSubAdmin ? data : data;
  const parentEseva = isSubAdmin ? data.eseva : null;

  // Calculate profile completion percentage based on role
  const calculateProfileCompletion = () => {
    let requiredFields = [];
  
    if (role === "Asha") {
      requiredFields = [
        "name",
        "address",
        "district",
        "state",
        "pincode",
        "mobile",
        "email",
        "inchargeaadharno",
        "inchargepandoc",
        "addressproofdoc", // Assuming this is the Asha Worker ID Document
      ];
    } else if (isSubAdmin) {
      requiredFields = [
        "name",
        "address",
        "mobile",
        "email",
        "panno",
        "aadharno",
        "profilepic"
      ];
    } else {
      requiredFields = [
        "name",
        "address",
        "district",
        "state",
        "pincode",
        "mobile",
        "email",
        "incharge",
        "inchargeaadharno",
        "bankName",
        "accountNumber",
        "ifscCode",
      ];
    }
  
    const completedFields = requiredFields.filter(
      (field) => userData[field] && userData[field].trim() !== ""
    );
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  // Check document upload status based on role
  const getDocumentStatus = () => {
    let documents = [];
  
    if (role === "Asha") {
      documents = [
        { name: "Aadhaar Document", field: "inchargeaadhardoc" },
        { name: "PAN Document", field: "inchargepandoc" },
        { name: "Asha Worker ID Document", field: "addressproofdoc" },
      ];
    } else if (isSubAdmin) {
      documents = [
        { name: "Aadhaar Document", field: "aadhardoc" },
        { name: "PAN Document", field: "pandoc" },
        { name: "Profile Picture", field: "profilepic" },
      ];
    } else {
      documents = [
        { name: "Aadhaar Document", field: "inchargeaadhardoc" },
        { name: "PAN Document", field: "inchargepandoc" },
        { name: "Shop Act Document", field: "shopactdoc" },
        { name: "Address Proof", field: "addressproofdoc" },
        { name: "Registration Certificate", field: "regcertificate" },
        { name: "Cancelled Cheque", field: "cancelledCheque" },
      ];
    }
  
    return documents.map((doc) => ({
      ...doc,
      uploaded: userData[doc.field] ? true : false,
    }));
  };

  const profileCompletion = calculateProfileCompletion();
  const documentStatus = getDocumentStatus();
  const uploadedDocs = documentStatus.filter((doc) => doc.uploaded).length;
  const totalDocs = documentStatus.length;

  const isApprovedOrActive = data?.status === "APPROVED" || data?.status === "ACTIVE";

const filterQuickActions = (items) =>
  items.filter((item) => {
    if (!item.roles.includes(role)) return false;

    if (item.restricted && !isApprovedOrActive) {
      return false; // hide restricted actions if not approved/active
    }

    return true;
  });


  // Mock patient data - replace with actual data from data.patients
  const patientStats = {
    total: userData.patients?.length || 0,
    thisMonth: 15,
    thisWeek: 5,
    today: 2,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-100";
        case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "REJECTED":
        return "text-red-600 bg-red-100";
        case "DEACTIVATED":
          return "text-red-600 bg-red-100";
          case "SUSPENDED":
            return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <MdVerified className="h-5 w-5" />;
      case "PENDING":
        return <MdPending className="h-5 w-5" />;
      case "REJECTED":
        return <MdError className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {userData.profilepic || userData.logo ? (
                    <Image
                      src={isSubAdmin ? userData.profilepic : userData.logo || "/placeholder.svg"}
                      alt={isSubAdmin ? "SubAdmin Profile" : "E-seva Center Logo"}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-blue-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getStatusColor(
                      userData.status
                    )}`}
                  >
                    {getStatusIcon(userData.status)}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">
                    {isSubAdmin ? userData.name : userData.name || "E-seva Center"}
                  </h1>
                  {isSubAdmin && parentEseva && (
                    <p className="text-gray-600 mb-2">
                      SubAdmin of: <span className="font-medium">{parentEseva.name}</span>
                    </p>
                  )}
                  <p className="text-gray-600 flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    {userData.address || "Address not provided"}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                        userData.status
                      )}`}
                    >
                      {userData.status || "PENDING"} Status
                    </span>
                    {userData.subAdminCode && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        Code: {userData.subAdminCode}
                      </span>
                    )}
                    {userData.esevacode && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        Code: {userData.esevacode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-semibold text-gray-800">
                  {new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUBADMIN SPECIFIC LAYOUT */}
        {isSubAdmin ? (
          <>
            {/* Key Metrics - Horizontal Layout with increased spacing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Profile Completion
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {profileCompletion}%
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Documents</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {uploadedDocs}/{totalDocs}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {uploadedDocs === totalDocs ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      All documents uploaded
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {totalDocs - uploadedDocs} pending
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Patients
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {patientStats.total}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    +{patientStats.thisMonth} this month
                  </span>
                </div>
              </div>
            </div>

            {/* Single Row Layout for SubAdmin - Information, Documents, Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* SubAdmin Information */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  SubAdmin Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="text-gray-800 font-medium">
                      {userData.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mobile
                    </label>
                    <p className="text-gray-800 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {userData.mobile || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-800 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">
                        {userData.email || "Not provided"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Address
                    </label>
                    <p className="text-gray-800">
                      {userData.address || "Not provided"}
                    </p>
                  </div>
                  {parentEseva && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        E-Seva Center Name
                      </label>
                      <p className="text-gray-800 font-medium">
                        {parentEseva.name}
                      </p>
                      {parentEseva.esevacode && (
                        <p className="text-sm text-gray-600">
                          Code: {parentEseva.esevacode}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Link
                    href="/e-seva/dashboard/profile"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Update Profile
                  </Link>
                </div>
              </div>

              {/* Document Status */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <HiDocumentText className="h-5 w-5" />
                  Document Status
                </h3>
                <div className="space-y-4">
                  {documentStatus.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${doc.uploaded ? "bg-green-100" : "bg-gray-100"
                            }`}
                        >
                          {doc.uploaded ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Upload className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {doc.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${doc.uploaded ? "text-green-600" : "text-gray-500"
                          }`}
                      >
                        {doc.uploaded ? "Uploaded" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Document Requirements</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Please upload all required documents for account verification.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-4">
  {filterQuickActions(quickActions).map((action, index) => (
    <Link
      key={index}
      href={action.path}
      className={`flex items-center gap-3 p-4 rounded-lg hover:bg-${action.color}-50 transition-colors group border border-gray-200`}
    >
      <div className={`bg-${action.color}-100 p-3 rounded-lg group-hover:bg-${action.color}-200`}>
        {action.icon}
      </div>
      <div className="flex-1">
        <span className="font-medium text-gray-800 block">{action.label}</span>
        <span className="text-sm text-gray-600">{action.desc}</span>
      </div>
    </Link>
  ))}
</div>

              </div>
            </div>
          </>
        ) : (
          // E-SEVA LAYOUT (without duplicate outer div)
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 min-[1100px]:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Profile Completion
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {profileCompletion}%
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Documents</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {uploadedDocs}/{totalDocs}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {uploadedDocs === totalDocs ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      All documents uploaded
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {totalDocs - uploadedDocs} pending
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Patients
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {patientStats.total}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    +{patientStats.thisMonth} this month
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Bank Account
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {data.bankName ? "Linked" : "Not Linked"}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <FaBuilding className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {data.bankName ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {data.bankName}
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Setup required
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Center Information */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Center Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Center Name
                      </label>
                      <p className="text-gray-800 font-medium">
                        {data.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        District
                      </label>
                      <p className="text-gray-800">
                        {data.district || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        State
                      </label>
                      <p className="text-gray-800">
                        {data.state || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Pincode
                      </label>
                      <p className="text-gray-800">
                        {data.pincode || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Incharge Name
                      </label>
                      <p className="text-gray-800 font-medium">
                        {data.incharge || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Mobile
                      </label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {data.mobile || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <p className="text-gray-800 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">
                          {data.email || "Not provided"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Taluka
                      </label>
                      <p className="text-gray-800">
                        {data.taluka || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <Link
                    href="/e-seva/dashboard/profile"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Update Profile
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3">
  {filterQuickActions(quickActions).map((action, index) => (
    <Link
      key={index}
      href={action.path}
      className={`flex items-center gap-3 p-4 rounded-lg hover:bg-${action.color}-50 transition-colors group border border-gray-200`}
    >
      <div className={`bg-${action.color}-100 p-3 rounded-lg group-hover:bg-${action.color}-200`}>
        {action.icon}
      </div>
      <div className="flex-1">
        <span className="font-medium text-gray-800 block">{action.label}</span>
        <span className="text-sm text-gray-600">{action.desc}</span>
      </div>
    </Link>
  ))}
</div>

              </div>
            </div>

            {/* Document Status and Banking Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Document Status */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <HiDocumentText className="h-5 w-5" />
                  Document Status
                </h3>
                <div className="space-y-3">
                  {documentStatus.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${doc.uploaded ? "bg-green-100" : "bg-gray-100"
                            }`}
                        >
                          {doc.uploaded ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Upload className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {doc.name}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${doc.uploaded ? "text-green-600" : "text-gray-500"
                          }`}
                      >
                        {doc.uploaded ? "Uploaded" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banking Information */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Banking Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Bank Name
                    </label>
                    <p className="text-gray-800 font-medium">
                      {data.bankName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Account Number
                    </label>
                    <p className="text-gray-800">
                      {data.accountNumber
                        ? `****${data.accountNumber.slice(-4)}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      IFSC Code
                    </label>
                    <p className="text-gray-800">
                      {data.ifscCode || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Account Type
                    </label>
                    <p className="text-gray-800">
                      {data.accountType || "Not provided"}
                    </p>
                  </div>
                </div>
                {!data.bankName && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Banking setup required</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Complete your banking information to receive payments.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EsevaDashboard;