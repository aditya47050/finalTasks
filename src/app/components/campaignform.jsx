"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Heart,
  FileText,
  DollarSign,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import HeadingClientMain from "@/app/components/heading";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const FundraisingForm = () => {
  const [formData, setFormData] = useState({
    fundraisertitle: "",
    description: "",
    story: "",
    healthissue: "",
    goalamount: "",
    frontimage: null,
    medicaldoc1: null,
    medicaldoc2: null,
    medicaldoc3: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    try {
      const res = await fetch("/api/aarogyadhan/patient/fundraisercampaign", {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Failed to submit the form");
      toast.success("Fundraising submitted successfully!");
      setIsDialogOpen(false);
      // Reset form
      setFormData({
        fundraisertitle: "",
        description: "",
        story: "",
        healthissue: "",
        goalamount: "",
        frontimage: "",
        medicaldoc1: "",
        medicaldoc2: "",
        medicaldoc3: "",
      });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadCard = ({
    label,
    fieldName,
    icon: Icon,
    required = false,
    isImage = false,
  }) => (
    <Card className="border-dashed border-2 hover:border-blue-500 transition-colors">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <Label className="text-sm font-medium text-[#FF5E00]">
              {label} {required && <span className="text-[#FF5E00]">*</span>}
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              {isImage
                ? "Upload image (JPG, PNG)"
                : "Upload document (PDF, DOC)"}
            </p>
          </div>

          {isImage ? (
            <div>
              <Input
                type="file"
                name={fieldName}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id={fieldName}
                required={required}
              />
              <Label
                htmlFor={fieldName}
                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                {formData[fieldName] ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </>
                )}
              </Label>
            </div>
          ) : (
            <div className="w-full">
              {formData[fieldName] ? (
                <div className="flex items-center justify-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Document Uploaded
                </div>
              ) : (
                <UploadButton
                  endpoint="fileUploader"
                  content={{
                    button({ ready }) {
                      return <div>{ready && <div>Upload Document</div>}</div>;
                    },
                    allowedContent({ ready, fileTypes, isUploading }) {
                      if (!ready) return "Checking...";
                      if (isUploading) return "Uploading...";
                      return `Files: ${fileTypes.join(", ")}`;
                    },
                  }}
                  appearance={{
                    button:
                      "w-full bg-blue-600 rounded-xl hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md font-medium flex items-center justify-center cursor-pointer transition-colors",
                    container: "w-full",
                    allowedContent: "text-xs text-gray-500 mt-1",
                  }}
                  onClientUploadComplete={(res) => {
                    if (res.length > 0) {
                      setFormData((prev) => ({
                        ...prev,
                        [fieldName]: res[0].url,
                      }));
                      toast.success("Document uploaded successfully!");
                    }
                  }}
                  onUploadError={(error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-5">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r rounded-xl from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3  shadow-lg transition-all duration-200">
            <Plus className="w-5 h-5 mr-2" />
            Create Fundraising
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-white rounded-xl p-0 w-[95vw] sm:w-full">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="">
              <HeadingClientMain
                main={"   Create Your Fundraising Fundraising"}
                sub="Help us understand your cause and reach your fundraising goals"
              />
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
              {/* Fundraising Details Section */}
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 text-xs"
                >
                  Fundraising Details
                </Badge>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fundraisertitle"
                      className="text-sm font-medium text-[#FF5E00]"
                    >
                      Fundraising Title{" "}
                      <span className="text-[#FF5E00]">*</span>
                    </Label>
                    <Input
                      id="fundraisertitle"
                      name="fundraisertitle"
                      value={formData.fundraisertitle}
                      onChange={handleChange}
                      placeholder="Enter a compelling title for your Fundraising"
                      className="h-10"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="healthissue"
                        className="text-sm font-medium text-[#FF5E00]"
                      >
                        Health Issue <span className="text-[#FF5E00]">*</span>
                      </Label>
                      <Input
                        id="healthissue"
                        name="healthissue"
                        value={formData.healthissue}
                        onChange={handleChange}
                        placeholder="e.g., Cancer Treatment"
                        className="h-10"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="goalamount"
                        className="text-sm font-medium text-[#FF5E00]"
                      >
                        Goal Amount <span className="text-[#FF5E00]">*</span>
                      </Label>
                      <div className="relative">
                        <RiMoneyRupeeCircleFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="goalamount"
                          name="goalamount"
                          type="number"
                          value={formData.goalamount}
                          onChange={handleChange}
                          placeholder="0"
                          className="h-10 pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-[#FF5E00]"
                    >
                      Short Description{" "}
                      <span className="text-[#FF5E00]">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide a brief description of your Fundraising (2-3 sentences)"
                      className="min-h-[80px] resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="story"
                      className="text-sm font-medium text-[#FF5E00]"
                    >
                      Your Story <span className="text-[#FF5E00]">*</span>
                    </Label>
                    <Textarea
                      id="story"
                      name="story"
                      value={formData.story}
                      onChange={handleChange}
                      placeholder="Tell your story in detail. Explain the situation, why you need help, and how the funds will be used..."
                      className="min-h-[120px] resize-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* File Uploads Section */}
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 text-xs"
                >
                  Documents & Images
                </Badge>

                <div className="space-y-4">
                  <FileUploadCard
                    label="Fundraising Cover Image"
                    fieldName="frontimage"
                    icon={ImageIcon}
                    required={true}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FileUploadCard
                      label="Medical Doc 1"
                      fieldName="medicaldoc1"
                      icon={FileText}
                    />
                    <FileUploadCard
                      label="Medical Doc 2"
                      fieldName="medicaldoc2"
                      icon={FileText}
                    />
                    <FileUploadCard
                      label="Medical Doc 3"
                      fieldName="medicaldoc3"
                      icon={FileText}
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">
                        Document Guidelines
                      </h4>
                      <p className="text-xs text-amber-700 mt-1">
                        Upload clear medical documents like prescriptions,
                        reports, or bills to build trust with donors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Submit Fundraising
                    </>
                  )}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundraisingForm;
