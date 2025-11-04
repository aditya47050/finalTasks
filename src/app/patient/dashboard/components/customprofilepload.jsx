"use client";
import { UploadButton } from "@uploadthing/react";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
const ProfileUploadPage = ({userdata}) => {
  const [formData, setFormData] = useState({
    passportPhoto: "",
  });
  const [uploadComplete, setUploadComplete] = useState(false);

  // Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  // Validate the form
  if (!formData.passportPhoto) {
    toast("Please upload your passport photo before submitting.");
    return;
  }

  try {
    // Create a FormData object
    const data = new FormData();
    data.append("passportPhoto", formData.passportPhoto);

    // Append other fields if needed
    Object.keys(formData).forEach((key) => {
      if (key !== "passportPhoto") {
        data.append(key, formData[key]);
      }
    });

    // Send the request
    const response = await fetch(`/api/patient/${userdata.id}/profile-photo`, {
      method: "PUT",
      body: data, // No need to set Content-Type manually
    });

    if (response.ok) {
      toast("Profile updated successfully!");
      console.log("Form submitted successfully:", await response.json());
    } else {
      toast("Failed to submit the form. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast("An error occurred. Please try again later.");
  }
};

  return (
    <div className="mx-auto container bg-white p-6">
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-[#FF5E00] xl:text-[14px] md:text-[11px] text-[10px] font-bold text-center ml-4">
                Passport Photo*
              </h1>

              <UploadButton
                endpoint="fileUploader"
                content={{
                  button({ ready }) {
                    return (
                      <div>
                        {ready
                          ? formData.passportPhoto
                            ? "Uploaded" // Button text after upload completes
                            : "Upload Passport Photo"
                          : "Preparing..."}
                      </div>
                    );
                  },
                  allowedContent({ ready, fileTypes, isUploading }) {
                    if (!ready) return "Checking allowed files...";
                    if (isUploading) return "Uploading your files...";
                    return `Allowed file types: ${fileTypes.join(", ")}`;
                  },
                }}
                appearance={{
                  button:
                    "w-auto bg-transparent text-[10px] xl:text-[14px] md:text-[11px] text-white font-bold rounded-full font-normal flex items-center justify-center cursor-pointer",
                  container:
                    "rounded-full xl:h-9 md:h-8 h-7 px-4  border w-auto px-1 bg-[#002e6e]",
                  allowedContent:
                    "flex h-2 flex-col items-center justify-center px-2 text-[1px] text-white hidden",
                }}
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  if (res.length > 0) {
                    setFormData((prevData) => ({
                      ...prevData,
                      passportPhoto: res[0].url, // Ensure res structure matches
                    }));
                    setUploadComplete(true); // Set the upload as complete
                    toast("Upload Completed");
                  }
                }}
                onUploadError={(error) => {
                  toast(`ERROR! ${error.message}`);
                }}
              />
            </div>
            <div className="bg-[#2b73ec] rounded-xl flex items-center justify-center">
              {formData.passportPhoto ? (
                <Image
                  src={formData.passportPhoto}
                  height={100}
                  width={100}
                  alt=""
                  className="h-16 w-16 border-blue-600 border-2 object-cover rounded-xl xl:h-20 xl:w-20"
                />
              ) : (
                <User className="h-16 w-16 xl:h-20 xl:w-20" color="#fff" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUploadPage;