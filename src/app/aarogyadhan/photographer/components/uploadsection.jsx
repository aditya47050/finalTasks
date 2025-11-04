// UploadSection.jsx

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { Label } from "@/components/ui/label";
import { FaSpinner } from "react-icons/fa6";
import { toast } from "react-toastify";

const UploadSection = ({ icon: Icon, label, onUpload, required = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadComplete = (res) => {
    setIsLoading(false);
    if (res && res.length > 0) {
      const uploadedUrl = res[0].ufsUrl; // Use ufsUrl instead of url
      console.log("Upload successful, URL:", uploadedUrl);
      onUpload(uploadedUrl); // Ensure this updates the correct state
    } else {
      console.error("Upload failed or no URL returned");
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-[#243460] font-semibold flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label} {required && "*"}
      </Label>
      <div className="relative">
        <UploadButton
          endpoint="fileUploader"
          content={{
            button({ ready }) {
              return <div>{ready && <div> Upload</div>}</div>;
            },
            allowedContent({ ready, fileTypes, isUploading }) {
              if (!ready) return "Checking allowed files...";
              if (isUploading) return "Uploading your files...";
              return `Allowed file types: ${fileTypes.join(", ")}`;
            },
          }}
          onClientUploadComplete={handleUploadComplete} // Use the function here
          onUploadError={(error) => {
            toast(`ERROR! ${error.message}`);
          }}
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
          className={`bg-[#5271FF] border-[#5271FF] text-white rounded-full h-12 focus:ring-2 focus:ring-[#5271FF]/50 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <FaSpinner className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                <Icon className="h-4 w-4" />
              </span>
              Upload
            </>
          )}
        </UploadButton>
      </div>
    </div>
  );
};

export default UploadSection;