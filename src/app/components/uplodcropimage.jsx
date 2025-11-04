"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ImageUploadCropper = ({
  userId,
  title = "Upload Image",
  description = "Please upload a clear image. It will be cropped appropriately.",
  formFieldName = "image",
  uploadEndpoint,
  redirectAfterUpload,
  aspectRatio = 1,
  cloudinaryOptions = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },
  onClose,
}) => {
  const router = useRouter();
  const [crop, setCrop] = useState({ unit: "px", width: 600, height: 600, x: 0, y: 0 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [image, setImage] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const defaultCrop = centerCrop(
      makeAspectCrop({ unit: "px", width: 600 }, aspectRatio, naturalWidth, naturalHeight),
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
    if (!completedCrop || !canvasRef.current || !imgRef.current) return null;

    const canvas = canvasRef.current;
    const image = imgRef.current;
    const ctx = canvas.getContext("2d");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const uploadToCloudinary = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", cloudinaryOptions.uploadPreset);
    formData.append("cloud_name", cloudinaryOptions.cloudName);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryOptions.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (!result.secure_url) throw new Error("Upload failed");
    return result.secure_url;
  };

  const handleUploadImage = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const croppedBlob = await generateCroppedImage();
      if (!croppedBlob) throw new Error("Could not crop image");

      const imageUrl = await uploadToCloudinary(croppedBlob);

      const data = new FormData();
      data.append(formFieldName, imageUrl);

      const response = await fetch(uploadEndpoint, {
        method: "PUT",
        body: data,
      });

      if (!response.ok) throw new Error("Upload failed");

      toast("Image uploaded successfully!");
      setIsUploaded(true);
      setIsLoading(false);
      onClose?.();

      if (redirectAfterUpload) router.push(redirectAfterUpload);
    } catch (err) {
      console.error(err);
      toast("Failed to upload image.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container md:mx-auto px-2 md:px-0 p-2">
      <div className="p-4 w-full text-center">
        <h2 className="text-[20px] font-bold mb-4">{title}</h2>
        <p className="text-[12px] text-gray-700 mb-4">{description}</p>

        {!isFileUploaded && (
          <div className="container">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="mb-4 bg-blue-500 cursor-pointer w-full xl:text-[14px] pl-2 md:text-[11px] text-[10px] border-2 border-white px-4 py-2 text-white rounded-xl"
            />
          </div>
        )}

        {image && (
          <div className="mt-6">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={100}
              minHeight={100}
              maxWidth={400}
              maxHeight={400}
            >
              <Image
                ref={imgRef}
                src={image}
                onLoad={onImageLoad}
                alt="Crop preview"
                width={300}
                height={300}
                className="max-w-full max-h-96 mx-auto rounded-xl shadow-lg"
              />
            </ReactCrop>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        )}

        <form onSubmit={handleUploadImage}>
          <button
            type="submit"
            disabled={isUploaded}
            className={`mt-4 px-4 py-2 ${
              isUploaded ? "bg-green-500" : "bg-[#2b73ec]"
            } text-white rounded-full border border-white shadow-xl xl:text-[14px] md:text-[11px] text-[10px]`}
          >
            {isUploaded ? "Uploaded" : isLoading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadCropper;
