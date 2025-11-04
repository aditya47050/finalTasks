"use client";
import React from "react";
import Image from "next/image";
import FormatDate from "@/components/dateformatter";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "react-qr-code"; // New QR code library

const Healthcard = ({ userdata }) => {
  const downloadImages = async () => {
    const zip = new JSZip();

    const leftCard = document.getElementById("leftCard");
    const rightCard = document.getElementById("rightCard");

    // Temporarily remove the hidden class to make them visible for html2canvas
    leftCard.classList.remove("hidden");
    rightCard.classList.remove("hidden");

    // Ensure QR code is rendered
    const qrCodeElement = rightCard.querySelector("svg");
    if (qrCodeElement) {
      qrCodeElement.style.display = "block"; // Make sure QR code is displayed
    }

    // Capture the left image with text
    const leftCanvas = await html2canvas(leftCard);
    const leftImgData = leftCanvas.toDataURL("image/png");
    zip.file("leftCard.png", leftImgData.split(",")[1], { base64: true });

    // Capture the right image with QR code
    const rightCanvas = await html2canvas(rightCard);
    const rightImgData = rightCanvas.toDataURL("image/png");
    zip.file("rightCard.png", rightImgData.split(",")[1], { base64: true });

    // Restore the hidden class after capturing the images
    leftCard.classList.add("hidden");
    rightCard.classList.add("hidden");

    // Generate the zip file and trigger the download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${userdata.patient.firstName}-Healthcard.zip`);
  };

  // The URL to which the QR code will redirect
  const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}patient/patient-medical-history/${userdata.patient.email}`; // Adjust as needed

  return (
    <div className="mx-auto max-w-6xl md:pb-40 font-poppins container xs:my-4 md:my-10">
      <div className="justify-center font-poppins text-center pt-1">
        <h1 className="text-[20px] text-[#243460] font-extrabold">
          Aarogya Aadhar
        </h1>
        <p className="text-[#5271FF] text-[12px]">Digital Health Card</p>
      </div>
      {/* Download Button
      <div className="flex justify-center mt-2 mb-2">
        <button
          onClick={downloadImages}
          className="px-4 py-2 bg-blue-600 hidden xl:block text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Download Health Card
        </button>
      </div> */}
      <div className="hidden md:flex flex-col md:flex-row justify-center items-center md:space-x-4 mt-4">
        {/* Left Side with User Data */}
        <div
          id="leftCard"
          className="relative w-full md:w-1/2 overflow-hidden rounded-xl shadow-lg hidden"
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729693644/ok_B_azosfg.png"
            alt="Health Background"
            width={400}
            height={400}
            className="h-full rounded-[15px] w-full object-cover"
          />
          <div className="absolute inset-0 flex  text-white bg-gradient-to-t  p-4">
            <div>
              {" "}
              <Image
                src={userdata.patient.passportPhoto}
                height={1400}
                width={867}
                alt=""
                className="h-[180px] rounded-[15px] w-36 items-start justify-start ml-6 mt-[74px]"
              />
            </div>
            <div className="flex flex-col lg:mt-[120px] xl:mt-[130px] ml-4">
              <div className="flex mb-4">
                <h2 className="text-[14px] font-poppins font-semibold text-white mr-2">
                  Name:
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  {userdata.firstName} {userdata.lastName}
                </p>
              </div>

              <div className="flex mb-4">
                <h2 className="text-[14px] font-poppins font-semibold text-white mr-2">
                  Birth Date:
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  <FormatDate dateString={userdata.patient.dateOfBirth} />
                </p>
              </div>

              <div className="flex mb-4">
                <h2 className="text-[14px] font-poppins font-semibold text-white mr-2">
                  BLOOD GROUP:
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  {userdata.patient.bloodgroup}
                </p>
              </div>
              <div className="flex mt-14 -ml-7">
                <h2 className="text-[16px] font-poppins font-semibold text-white mr-2">
                  ABHA No:
                </h2>
                <p className="">
                  {" "}
                  {userdata?.patient.abhaCardNumber?.length
                    ? `${userdata.patient?.abhaCardNumber?.slice(
                        0,
                        2
                      )}XXXXXXXX${userdata.patient.abhaCardNumber?.slice(-2)}`
                    : userdata.patient?.abhaCardNumber}
                </p>{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side with Background Image */}
        <div
          id="rightCard"
          className="relative w-full md:w-1/2 overflow-hidden rounded-xl  mt-4 md:mt-0 hidden "
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729693578/ok_A_hb3ruk.png"
            alt="Health Background"
            width={400}
            height={400}
            className="h-full rounded-[15px] w-full object-cover"
          />
          <div className="absolute inset-0   text-white pr-4">
            <div className="mt-4 items-end    justify-end flex">
              <div className="bg-white rounded-xl p-4">
                {" "}
                <QRCode
                  value={qrCodeUrl}
                  size={150}
                  className=" bg-white p-- "
                />
              </div>
            </div>

            <div className="flex flex-col mt-[80px] ml-[70px]">
              <div className="flex mb-4 flex-col">
                <h2 className="text-[45px] font-normal font-sans text-white mb-1">
                  Card No
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  {userdata.patient.aadharCardNumber.length === 12 ? (
                    <div className="text-[50px] mt-1 ml-2">
                      <span>
                        {userdata.patient.aadharCardNumber.slice(0, 2)}XX
                      </span>

                      <br />
                      <hr className="w-32 h-2 mt-2 border-t-2 text-white" />
                      <span>XXXX</span>
                      <br />
                      <hr className="w-32 h-2 mt-2 border-t-2 text-white" />

                      <span>
                        XX{userdata.patient.aadharCardNumber.slice(-2)}
                      </span>
                    </div>
                  ) : (
                    userdata.patient.aadharCardNumber
                  )}
                </p>
              </div>

              <div className="">
                <Image
                  src={
                    "https://res.cloudinary.com/dnckhli5u/image/upload/v1729696034/map_rlvat4.png"
                  }
                  width={300}
                  height={300}
                  alt=""
                  className="h-54 w-40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Displaying data image  */}
      <div className="hidden md:flex flex-col md:flex-row justify-center items-center md:space-x-10">
        {/* Left Side with User Data */}
        <div
          id=""
          className="relative w-full md:w-1/2 overflow-hidden  shadow-lg"
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1734340436/final_ok_B_teffsd.png"
            alt="Health Background"
            width={1050}
            height={600}
            className=" h-full md:rounded-[15px] rounded-[10px] w-full "
          />
          <div className="absolute inset-0 flex  text-white bg-gradient-to-t  p-4">
            <div>
              {" "}
              <Image
                src={userdata.patient.passportPhoto}
                height={400}
                width={800}
                alt=""
                className="min-[1100px]:h-[150px] xl:h-[170px]  xs:h-[80px] xs:w-16 sm:h-[120px] xsm:h-[100px] xsm:w-20 md:h-[110px] h-28 w-20 md:rounded-[15px] rounded-[10px]  md:w-24 min-[1100px]:w-32 xl:w-36  items-start justify-start md:ml-2 ml-2 mt-[25px] object-cover sm:mt-[34px] sm:w-28 min-[1100px]:ml-6 md:mt-[26px] xl:mt-[60px] min-[1100px]:mt-[50px]"
              />
            </div>
            <div className="flex flex-col xs:text-[8px] xsm:text-[9px] sm:text-[11px]  md:text-[10px] xs:mt-[50px] xsm:mt-[68px] sm:mt-[86px] md:mt-[70px] xl:mt-[120px] min-[1100px]:mt-[110px] ml-4">
              <div className="flex xl:mb-3 mb-2">
                <h2 className="min-[1100px]:text-[14px] font-poppins font-semibold text-white mr-2">
                  Name:
                </h2>
                <p className="min-[1100px]:text-[14px] font-poppins text-white">
                  {userdata.firstName} {userdata.lastName}
                </p>
              </div>

              <div className="flex xl:mb-3 mb-2">
                <h2 className="min-[1100px]:text-[14px] font-poppins font-semibold text-white mr-2">
                  Birth Date:
                </h2>
                <p className="min-[1100px]:text-[14px] font-poppins text-white">
                  {<FormatDate dateString={userdata.patient.dateOfBirth} />}
                </p>
              </div>

              <div className="flex xl:mb-3 mb-2">
                <h2 className="min-[1100px]:text-[14px] font-poppins font-semibold text-white mr-2">
                  BLOOD GROUP:
                </h2>
                <p className="min-[1100px]:text-[14px] font-poppins text-white">
                  {userdata.patient.bloodgroup}
                </p>
              </div>
              <div className="flex xl:mt-6 sm:mt-2 lg:mt-3 xsm:mt-1  md:mt-3 -ml-7">
                <h2 className="min-[1100px]:text-[16px] font-poppins font-semibold text-white mr-2">
                  ABHA No:
                </h2>
                <p className="min-[1100px]:text-[16px]">
                  {" "}
                  {userdata.patient?.abhaCardNumber?.length
                    ? `${userdata.patient.abhaCardNumber?.slice(
                        0,
                        2
                      )}XXXXXXXX${userdata.patient.abhaCardNumber?.slice(-2)}`
                    : userdata.patient?.abhaCardNumber}
                </p>{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side with Background Image */}
        <div
          id=""
          className="relative w-full md:w-1/2 overflow-hidden rounded-xl  mt-4 md:mt-0"
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729693578/ok_A_hb3ruk.png"
            alt="Health Background"
            width={300}
            height={700}
            className="h-full rounded-[15px] w-full md:w-[320px] object-cover"
          />
          <div className="absolute inset-0  text-white p-2 md:p-4">
            <div className="  md:ml-[180px] min-[1100px]:ml-14 xs:ml-[152px] xsm:ml-[200px] sm:ml-[220px] xl:-ml-2 items-center justify-center flex">
              <QRCode
                value={qrCodeUrl}
                size={100} // Placeholder size, overridden by CSS
                className="bg-white rounded-xl p-1 h-20 w-20 sm:h-24 sm:w-24"
              />
            </div>{" "}
            <div className="flex flex-col min-[1100px]:mt-[20px]  sm:mt-[36px] xsm:mt-[24px] xsm:ml-[39px] xs:ml-[32px] sm:ml-[50px]  md:ml-[25px]  min-[1100px]:ml-[30px]">
              <div className="flex mb-4 flex-col">
                <h2 className="md:text-[25px] font-thin sm:text-[28px] xsm:text-[25px] xs:text-[20px] font-sans text-white mb-1">
                  Card No
                </h2>
                <p className="min-[1100px]:text-[14px] sm:text-[27px] xs:text-[19px]  xsm:text-[23px] font-poppins text-white">
                  {userdata.patient.aadharCardNumber.length === 12 ? (
                    <div className="md:text-[30px] mt-1 ml-2">
                      <span>
                        {userdata.patient.aadharCardNumber.slice(0, 2)}XX
                      </span>

                      <br />
                      <hr className="lg:w-20 sm:w-16 w-12 h-2 border-t-2 text-white" />
                      <span>XXXX</span>
                      <br />
                      <hr className="lg:w-20 h-2 sm:w-16 w-12  border-t-2 text-white" />

                      <span>
                        XX{userdata.patient.aadharCardNumber.slice(-2)}
                      </span>
                    </div>
                  ) : (
                    userdata.patient.aadharCardNumber
                  )}
                </p>
              </div>

              <div className="md:mt-[-10px] xsm:-mt-4 xs:-ml-2 xsm:-ml-3 sm:-ml-4 md:-ml-4 ">
                <Image
                  src={
                    "https://res.cloudinary.com/dnckhli5u/image/upload/v1729696034/map_rlvat4.png"
                  }
                  width={300}
                  height={300}
                  alt=""
                  className="sm:h-40 xsm:h-36 xsm:w-28 h-24 w-20 sm:w-32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="xs:flex md:hidden flex-col md:flex-row justify-center items-center md:space-x-4 ">
        {/* Left Side with User Data */}
        <div
          id="leftCard"
          className="relative w-full md:w-1/2 overflow-hidden rounded-xl shadow-lg hidden"
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729693644/ok_B_azosfg.png"
            alt="Health Background"
            width={400}
            height={400}
            className="h-full rounded-[15px] w-full object-cover"
          />
          <div className="absolute inset-0 flex  text-white bg-gradient-to-t  p-4">
            <div>
              {" "}
              <Image
                src={userdata.patient.passportPhoto}
                height={1400}
                width={867}
                alt=""
                className="h-[180px] rounded-[15px] w-36 items-start justify-start ml-6 mt-[74px]"
              />
            </div>
            <div className="flex flex-col mt-[130px] ml-4">
              <div className="flex mb-4">
                <h2 className="text-[14px] font-poppins font-semibold text-white mr-2">
                  Name:
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  {userdata.firstName} {userdata.lastName}
                </p>
              </div>

              <div className="flex mb-4">
                <h2 className="text-[14px] font-poppins font-semibold text-white mr-2">
                  Birth Date:
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  <FormatDate dateString={userdata.patient.dateOfBirth} />
                </p>
              </div>

              <div className="flex mb-4">
                <h2 className="text-[14px] font-poppins font-semibold text-white mr-2">
                  BLOOD GROUP:
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  {userdata.patient.bloodgroup}
                </p>
              </div>
              <div className="flex mt-14 -ml-7">
                <h2 className="text-[16px] font-poppins font-semibold text-white mr-2">
                  ABHA No:
                </h2>
                <p className="">
                  {" "}
                  {userdata?.patient.abhaCardNumber?.length
                    ? `${userdata.patient?.abhaCardNumber?.slice(
                        0,
                        2
                      )}XXXXXXXX${userdata.patient.abhaCardNumber?.slice(-2)}`
                    : userdata.patient?.abhaCardNumber}
                </p>{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side with Background Image */}
        <div
          id="rightCard"
          className="relative w-full md:w-1/2 overflow-hidden rounded-xl  mt-4 md:mt-0 hidden "
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729693578/ok_A_hb3ruk.png"
            alt="Health Background"
            width={400}
            height={400}
            className="h-full rounded-[15px] w-full object-cover"
          />
          <div className="absolute inset-0   text-white pr-4">
            <div className="mt-4 items-end    justify-end flex">
              <div className="bg-white rounded-xl p-4">
                {" "}
                <QRCode
                  value={qrCodeUrl}
                  size={150}
                  className=" bg-white p-- "
                />
              </div>
            </div>

            <div className="flex flex-col mt-[80px] ml-[70px]">
              <div className="flex mb-4 flex-col">
                <h2 className="text-[45px] font-normal font-sans text-white mb-1">
                  Card No
                </h2>
                <p className="text-[14px] font-poppins text-white">
                  {userdata.patient.aadharCardNumber.length === 12 ? (
                    <div className="text-[50px] mt-1 ml-2">
                      <span>
                        {userdata.patient.aadharCardNumber.slice(0, 2)}XX
                      </span>

                      <br />
                      <hr className="w-32 h-2 mt-2 border-t-2 text-white" />
                      <span>XXXX</span>
                      <br />
                      <hr className="w-32 h-2 mt-2 border-t-2 text-white" />

                      <span>
                        XX{userdata.patient.aadharCardNumber.slice(-2)}
                      </span>
                    </div>
                  ) : (
                    userdata.patient.aadharCardNumber
                  )}
                </p>
              </div>

              <div className="">
                <Image
                  src={
                    "https://res.cloudinary.com/dnckhli5u/image/upload/v1729696034/map_rlvat4.png"
                  }
                  width={300}
                  height={300}
                  alt=""
                  className="h-54 w-40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Displaying data image  */}
      <div className="xs:flex md:hidden flex-col md:flex-row justify-center mt-4 items-center md:space-x-10">
        {/* Left Side with User Data */}
        <div
          id=""
          className="relative w-full md:w-1/2 overflow-hidden  shadow-lg"
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1734340436/final_ok_B_teffsd.png"
            alt="Health Background"
            width={1050}
            height={600}
            className=" h-full md:rounded-[15px] rounded-[10px] w-full "
          />
          <div className="absolute inset-0 flex  text-white bg-gradient-to-t  p-4">
            <div>
              {" "}
              <Image
                src={userdata.patient.passportPhoto}
                height={400}
                width={800}
                alt=""
                className="xs:h-[110px] xs:w-[90px] sm:h-[120px] sm:w-[100px] rounded-[10px] items-start justify-start ml-0 mt-[5px] object-cover xs:mt-[25px] sm:mt-[30px] sm:ml-1"
              />
            </div>
            <div className="flex flex-col   sm:text-[10px]  md:text-[10px] xs:mt-[70px]  sm:mt-[80px] ml-3">
              <div className="flex xl:mb-3 mb-1">
                <h2 className="lg:text-[14px] xs:text-[8px] sm:text-[10px] font-poppins font-semibold text-white mr-2">
                  Name:
                </h2>
                <p className="lg:text-[14px] xs:text-[8px] sm:text-[10px] font-poppins text-white">
                  {userdata.firstName} {userdata.lastName}
                </p>
              </div>

              <div className="flex xl:mb-3 mb-1">
                <h2 className="lg:text-[14px] xs:text-[8px] sm:text-[10px] font-poppins font-semibold text-white mr-2">
                  Birth Date:
                </h2>
                <p className="lg:text-[14px] xs:text-[8px] sm:text-[10px] font-poppins text-white">
                  {<FormatDate dateString={userdata.patient.dateOfBirth} />}
                </p>
              </div>

              <div className="flex xl:mb-3 mb-1">
                <h2 className="lg:text-[14px] xs:text-[8px] sm:text-[10px] font-poppins font-semibold text-white mr-2">
                  BLOOD GROUP:
                </h2>
                <p className="lg:text-[14px] xs:text-[8px] sm:text-[10px] font-poppins text-white">
                  {userdata.patient.bloodgroup}
                </p>
              </div>
              <div className="flex xl:mt-6 sm:mt-1.5 lg:mt-3 xs:mt-3  md:mt-3 -ml-5">
                <h2 className="lg:text-[16px] xs:text-[10px] sm:text-[12px] font-poppins font-semibold text-white mr-2">
                  ABHA No:
                </h2>
                <p className="lg:text-[16px] xs:text-[10px] sm:text-[12px]">
                  {" "}
                  {userdata.patient?.abhaCardNumber?.length
                    ? `${userdata.patient.abhaCardNumber?.slice(
                        0,
                        2
                      )}XXXXXXXX${userdata.patient.abhaCardNumber?.slice(-2)}`
                    : userdata.patient?.abhaCardNumber}
                </p>{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side with Background Image */}
        <div
          id=""
          className="relative w-full md:w-1/2 overflow-hidden rounded-xl  mt-4 md:mt-0"
        >
          <Image
            src="https://res.cloudinary.com/dnckhli5u/image/upload/v1729693578/ok_A_hb3ruk.png"
            alt="Health Background"
            width={300}
            height={700}
            className="h-full rounded-[15px] w-full md:w-[320px] object-cover"
          />
          <div className="absolute inset-0  text-white p-2 xs:pt-4 md:p-4">
            <div className=" xs:ml-[185px]  sm:ml-[215px]  items-center justify-center flex">
              <QRCode
                value={qrCodeUrl}
                size={100} // Placeholder size, overridden by CSS
                className="bg-white rounded-xl p-1 h-20 w-20 xs:h-24 xs:w-24"
              />
            </div>{" "}
            <div className="flex flex-col   xs:mt-2 sm:mt-6  xs:ml-[35px] sm:ml-[40px] ">
              <div className="flex mb-4 flex-col">
                <h2 className="md:text-[25px] font-thin sm:text-[30px]  xs:text-[28px] font-sans text-white mb-1">
                  Card No
                </h2>
                <p className="lg:text-[14px] sm:text-[30px] xs:text-[27px] font-poppins text-white">
                  {userdata.patient.aadharCardNumber.length === 12 ? (
                    <div className="md:text-[30px] mt-1 ml-2">
                      <span>
                        {userdata.patient.aadharCardNumber.slice(0, 2)}XX
                      </span>

                      <br />
                      <hr className="lg:w-20 xs:w-20 w-12 h-2 border-t-2 text-white" />
                      <span>XXXX</span>
                      <br />
                      <hr className="lg:w-20 h-2 xs:w-20 w-12  border-t-2 text-white" />

                      <span>
                        XX{userdata.patient.aadharCardNumber.slice(-2)}
                      </span>
                    </div>
                  ) : (
                    userdata.patient.aadharCardNumber
                  )}
                </p>
              </div>

              <div className="md:mt-[-10px]  xs:-ml-2  sm:-ml-2 md:-ml-4 ">
                <Image
                  src={
                    "https://res.cloudinary.com/dnckhli5u/image/upload/v1729696034/map_rlvat4.png"
                  }
                  width={300}
                  height={300}
                  alt=""
                  className="xs:h-40  h-24 w-20 xs:w-32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Healthcard;
