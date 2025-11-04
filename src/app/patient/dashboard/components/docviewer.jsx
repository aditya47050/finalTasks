import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";

const Docviewer = ({ userdata }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to check if the file is an image
  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <div className="font-poppins p-2">
      {userdata ? (
        <>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            View
          </button>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Document Viewer"
            className="relative w-[90%] max-w-4xl bg-white rounded shadow-lg outline-none p-4 mx-auto mt-10"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            ariaHideApp={false}
          >
            <div className="relative w-full h-[70vh] overflow-auto">
              {isImage(userdata) ? (
                // If it's an image, show with Image component
                <Image
                  src={userdata}
                  alt="Document preview"
                  width={1900}
                  height={1356}
                  quality={100}
                  objectFit="contain"
                  className="rounded"
                />
              ) : (
                // If it's a PDF, use iframe
                <iframe
                  src={userdata}
                  className="w-full h-full rounded"
                  title="PDF Preview"
                />
              )}
            </div>

            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-red-500 text-lg font-bold"
            >
              ✕
            </button>
          </Modal>
        </>
      ) : (
        <span>No Document</span>
      )}
    </div>
  );
};

export default Docviewer;
