"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
const ProfileUploadPage = ({ userdata, data, onClose }) => {
  const router = useRouter();
  const [crop, setCrop] = useState({
    unit: "px",
    width: 600,
    height: 600,
    x: 0,
    y: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [image, setImage] = useState(null);

  const [isFileUploaded, setIsFileUploaded] = useState(false); // To track if a file is uploaded
  const [isUploaded, setIsUploaded] = useState(false); // To track if the upload is successful
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [formData, setformData] = useState({
    passportphoto: "",
  });

  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;

    const defaultCrop = centerCrop(
      makeAspectCrop(
        { unit: "px", width: 600, height: 600 }, // Crop size
        1, // Aspect ratio 1:1
        naturalWidth,
        naturalHeight
      ),
      naturalWidth,
      naturalHeight
    );

    setCrop(defaultCrop);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
      setIsFileUploaded(true);
    }
  };

  const generateCroppedImage = () => {
    if (!completedCrop || !canvasRef.current || !imgRef.current) {
      return null;
    }

    const canvas = canvasRef.current;
    const crop = completedCrop;
    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  const cloudname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (croppedImageBlob) => {
    const formData = new FormData();
    formData.append("file", croppedImageBlob);
    formData.append("upload_preset", preset);
    formData.append("cloud_name", cloudname);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleUploadImage = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const croppedImageBlob = await generateCroppedImage();
      if (!croppedImageBlob) {
        throw new Error("Failed to generate cropped image.");
      }

      const cloudinaryUrl = await uploadToCloudinary(croppedImageBlob);

      setformData((prevData) => ({
        ...prevData,
        passportphoto: cloudinaryUrl,
      }));

      const data = new FormData();
      data.append("passportphoto", cloudinaryUrl);

      Object.keys(formData).forEach((key) => {
        if (key !== "passportphoto") {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch(
        `/api/doctor/${userdata.id}/doctor-profile-photo`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (response.ok) {
        setIsUploaded(true); // Mark as uploaded
        setIsLoading(false);
        toast("Profile Image updated successfully!");
        if (onClose) onClose(); // Close the modal/dialogue
        window.location.href="/doctor/dashboard/profile"
      } else {
        toast("Failed to submit the form. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="md:mx-auto container px-2 md:px-0 p-2">
      <div className="p-4 w-full" style={{ textAlign: "center" }}>
        <h2 className="text-[20px] font-bold mb-4">
          Upload Your Passport Photo
        </h2>
        <p className="text-[12px] text-gray-700 mb-4">
          Please upload a clear, recent photo with a neutral background. The
          image will be cropped to a square for passport purposes.
        </p>

        {!isFileUploaded && (
          <div className="container">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="mb-4 bg-blue-500 cursor-pointer w-full xl:text-[14px] pl-2 md:text-[11px] text-[10px] border-2 border-white px-4 py-2 space-y-3 text-white rounded-xl"
            />
          </div>
        )}

        {image && (
          <div className="mt-6">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              minWidth={100}
              minHeight={100}
              maxWidth={400}
              maxHeight={400}
            >
              <Image
                ref={imgRef}
                alt="Crop preview"
                src={image}
                onLoad={onImageLoad}
                width={300}
                height={300}
                className="max-w-full max-h-96 mx-auto rounded-xl shadow-lg"
              />
            </ReactCrop>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        <div>
          <form onSubmit={handleUploadImage}>
            <div className="mt-4">
              <button
                className={`mt-2 px-4 py-2 ${
                  isUploaded ? "bg-green-500" : "bg-[#2b73ec]"
                } shadow-xl xl:text-[14px] md:text-[11px] text-[10px] border border-white rounded-full font-poppins text-white`}
                type="submit"
                disabled={isUploaded}
              >
                {isUploaded
                  ? "Uploaded"
                  : isLoading
                  ? "Uploading.."
                  : "Upload Profile Image"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUploadPage;
