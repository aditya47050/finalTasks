// PhotographerRegistrationForm.jsx

"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  User,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Camera,
  CreditCard,
  Building,
  Building2,
  Banknote,
  FileText,
  Upload,
  UserCheck,
  MapPinIcon,
  Smartphone,
} from "lucide-react";
import HeadingClientMain from "@/app/components/heading";
import UploadSection from "./uploadsection";

const PhotographerRegistrationForm = ({
  formData,
  handleInputChange,
  handleStateChange,
  handleDistrictChange,
  handleRegistration,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isSubmitting,
  filteredDistricts,
  filteredSubDistricts,
  state,
  dist,
  subdist,
  setFormData, // Ensure this is passed
}) => {
  return (
    <div className="w-full md:max-w-5xl mx-auto p-4 space-y-6">
      <Card className="border-none">
        <HeadingClientMain
          main={"Photographer Registration"}
          sub={"Join our platform and start your photography journey"}
        />
        <CardContent>
          <form onSubmit={handleRegistration} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-[#5271FF]" />
                <h3 className="text-lg font-semibold text-[#243460]">
                  Personal Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={Mail}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={User}
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Mobile Number *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={Phone}
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Alternate Number
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={Smartphone}
                    type="tel"
                    name="alternateno"
                    value={formData.alternateno}
                    onChange={handleInputChange}
                    placeholder="Enter alternate number"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-[#5271FF]" />
                <h3 className="text-lg font-semibold text-[#243460]">
                  Address Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Pincode *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={MapPinIcon}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    City *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={Building}
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    State *
                  </Label>
                  <select
                    className={
                      "bg-[#5271FF] w-full border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50 "
                    }
                    icon={MapPin}
                    name="stateName"
                    value={formData.stateName}
                    onChange={handleStateChange}
                    required
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {state.map((s) => (
                      <option key={s.stateName} value={s.stateName}>
                        {s.stateName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    District *
                  </Label>
                  <select
                    className={
                      "bg-[#5271FF] w-full border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50 "
                    }
                    icon={Building}
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    required
                  >
                    <option value="" disabled>
                      Select District
                    </option>
                    {filteredDistricts.map((d) => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Taluka
                  </Label>
                  <select
                    className={
                      "bg-[#5271FF] w-full border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50 "
                    }
                    icon={MapPin}
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Taluka
                    </option>
                    {filteredSubDistricts.map((sd) => (
                      <option key={sd.subDistrict} value={sd.subDistrict}>
                        {sd.subDistrict}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Security */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-[#5271FF]" />
                <h3 className="text-lg font-semibold text-[#243460]">
                  Account Security
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confirm Password *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={Lock}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Identity Documents */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="h-5 w-5 text-[#5271FF]" />
                <h3 className="text-lg font-semibold text-[#243460]">
                  Identity Documents
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadSection
                  icon={Camera}
                  label="Passport Photo"
                  onUpload={(url) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      passportphoto: url,
                    }))
                  }
                  required
                />
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Aadhar Card Number *
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={CreditCard}
                    name="aadharcardno"
                    value={formData.aadharcardno}
                    onChange={handleInputChange}
                    placeholder="Enter Aadhar number"
                    required
                  />
                </div>
                <UploadSection
                  icon={Upload}
                  label="Aadhar Card Image"
                  onUpload={(url) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      aadharcardimage: url,
                    }))
                  }
                  required
                />
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PAN Card Number
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={FileText}
                    name="pancardno"
                    value={formData.pancardno}
                    onChange={handleInputChange}
                    placeholder="Enter PAN number"
                  />
                </div>
                <UploadSection
                  icon={Upload}
                  label="PAN Card Image"
                  onUpload={(url) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      pancardimage: url,
                    }))
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Company Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-[#5271FF]" />
                <h3 className="text-lg font-semibold text-[#243460]">
                  Company Information (Optional)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Name
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={Building2}
                    name="companyname"
                    value={formData.companyname}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Company Address
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={MapPin}
                    name="companyaddress"
                    value={formData.companyaddress}
                    onChange={handleInputChange}
                    placeholder="Enter company address"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Banking Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Banknote className="h-5 w-5 text-[#5271FF]" />
                <h3 className="text-lg font-semibold text-[#243460]">
                  Banking Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Bank Name
                  </Label>
                  <select
                    className={
                      "bg-[#5271FF] w-full border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50 "
                    }
                    icon={Building}
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Bank
                    </option>
                    {/* Add bank options here */}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Account Number
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={CreditCard}
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    IFSC Code
                  </Label>
                  <Input
                    className={
                      "bg-[#5271FF] border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50"
                    }
                    icon={FileText}
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="Enter IFSC code"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#243460] font-semibold flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Account Type
                  </Label>
                  <select
                    className={
                      "bg-[#5271FF] w-full border-[#5271FF] text-white placeholder:text-white/70 rounded-full h-12 pl-10 focus:ring-2 focus:ring-[#5271FF]/50 "
                    }
                    icon={Banknote}
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select Account Type
                    </option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <UploadSection
                    icon={Upload}
                    label="Cancelled Cheque"
                    onUpload={(url) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        cancelledCheque: url,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5271FF] hover:bg-[#4461ee] text-white font-semibold px-12 py-3 rounded-full min-w-[200px] transition-all duration-200 text-lg"
              >
                {isSubmitting ? "Registering..." : "Register Now"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotographerRegistrationForm;
