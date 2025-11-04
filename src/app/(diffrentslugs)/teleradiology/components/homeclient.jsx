"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BsMicrosoftTeams } from "react-icons/bs";
import { FaHospitalAlt } from "react-icons/fa";
import { FaBedPulse, FaUserDoctor } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FaUser } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
const Homeclient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Trigger a request when dialog is opened
  useEffect(() => {
    if (isOpen) {
      // Example request (replace with actual API call)
      fetch("/api/dialog-open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dialog: "Request a Demo Opened" }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Request success:", data))
        .catch((error) => console.error("Request failed:", error));
    }
  }, [isOpen]);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    mobile: "",
    hspname: "",
    city: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only letters and spaces for text fields
    if (["name", "designation", "hspname", "city"].includes(name) && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    // Allow only numbers for mobile
    if (name === "mobile" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };
  // Frontend validation
  const validateForm = () => {
    const { name, designation, email, mobile, hspname, city, message } =
      formData;

    if (
      !name ||
      !designation ||
      !email ||
      !mobile ||
      !hspname ||
      !city ||
      !message
    ) {
      toast.error("All fields are required.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Mobile number must be 10 digits.");
      return false;
    }

    if (message.length > 2000) {
      toast.error("Message cannot exceed 2000 characters.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/teleradiologyenq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(result.message);
      setFormData({
        name: "",
        designation: "",
        email: "",
        mobile: "",
        hspname: "",
        city: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="font-poppins pb-0  lg:pb-4 mt-8 xs:mt-[4rem] md:mt-8 lg:mt-0 md:container ">
        <div className="flex items-center w-full relative container">
          <span className="absolute left-1/2 transform -translate-x-1/2 md:text-[25px] text-[18px] text-[#5271FF] font-extrabold text-center my-4">
            Aarogya e-RAD
          </span>
        </div>

        <div className="">
          {" "}
          <div className="w-full md:mt-6 mt-8 relative flex flex-wrap lg:flex-nowrap space-y-5 lg:space-y-0 lg:space-x-5">
  {/* Parent Image */}
  <div className="w-full h-auto rounded-[15px] relative">
    <Image
      src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732172341/31_hhiyxp.png"
      width={4000}
      height={844}
      className="w-full rounded-[15px] hidden lg:block  max-[1200px]:h-[220px] min-[1200px]:h-[240px] xl:h-[260px]"
      alt="Parent Image"
    />

{/* mobile screen image */}
<Image
      src="https://res.cloudinary.com/dwsc0vedb/image/upload/v1743660115/46_kwq5xw.png"
      width={4000}
      height={844}
      className="w-full rounded-[15px] block lg:hidden "
      alt="Parent Image"
    />

 {/* mobile Screen buttons */}
 <div className="lg:hidden absolute right-2 md:right-10 top-[10%] md:top-[26%] flex flex-col gap-2">
    <button className=" text-[10px] md:text-[14px] bg-[#344767] text-white rounded-[7px] px-1 md:px-2 py-1 md:py-2">
      <Link href="/teleradiology/register" >
          Register
      </Link>
    </button>
    <button className=" text-[10px] md:text-[14px] bg-[#344767] text-white rounded-[7px] px-1 md:px-2 py-1 md:py-2">
      <Link href="/teleradiology/login"> 
        Log In
      </Link>
    </button>
  <button className=" text-[10px] md:text-[14px] bg-[#344767] text-white rounded-[7px] px-1 md:px-2 py-1 md:py-2"><Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button className=" text-[10px] md:text-[14px] bg-[#344767] text-white rounded-[7px] px-1 md:px-2 py-1 md:py-2">
                    Book Demo
                  </button>
                </DialogTrigger>
                <DialogContent className="xs:max-w-1/4 md:max-w-lg max-h-[70vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
                  <DialogHeader>
                    <DialogDescription>
                      <div className="flex text-center items-center justify-center">
                        <button className="w-auto bg-gradient-to-r from-[#FFDE59] to-[#FF914D] p-2 text-white rounded-full flex items-center shadow-lg hover:shadow-xl transition">
                          <span className="text-[14px] font-poppins font-bold text-[#243460]">
                            Please fill below details
                          </span>
                        </button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <Label className="text-[#243460] font-semibold ml-2">Your Full Name*</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                              <FaUser />
                            </span>
                            <Input
                              type="text"
                              className="pl-8"
                              placeholder="Enter Full Name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              name="name"
                            />
                          </div>
                          <Label className="text-[#243460] font-semibold ml-2">Enter Designation*</Label>
                          <Input
                            type="text"
                            className="pl-4"
                            placeholder="Enter Designation"
                            required
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <Label className="text-[#243460] font-semibold ml-2">Enter Email ID*</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                              <FiMail />
                            </span>
                            <Input
                              type="email"
                              className="pl-8"
                              placeholder="Enter Email ID"
                              required
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                          <Label className="text-[#243460] font-semibold ml-2">Enter Mobile Number*</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#243460]">
                              <FiPhone />
                            </span>
                            <Input
                              type="text"
                              className="pl-8"
                              placeholder="Enter Mobile Number"
                              required
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <Label className="text-[#243460] font-semibold ml-2">Enter HSP Name*</Label>
                          <Input
                            type="text"
                            className="pl-4"
                            placeholder="Enter HSP Name"
                            required
                            name="hspname"
                            value={formData.hspname}
                            onChange={handleChange}
                          />
                          <Label className="text-[#243460] font-semibold ml-2">Enter City Name*</Label>
                          <Input
                            type="text"
                            className="pl-4"
                            placeholder="Enter City Name"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            name="city"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <Label className="text-[#243460] font-semibold ml-2">Enter Message*</Label>
                          <Textarea
                            className="pl-4"
                            placeholder="Message"
                            rows={3}
                            required
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="my-2 text-center">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full lg:w-full bg-[#5271FF] hover:bg-[#5271FF] px-5 py-2 text-white  rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </form>

                </DialogContent>
              </Dialog></button>
 </div>
    {/* Child Image - Positioned Inside Parent */}
    <div className="hidden lg:block absolute top-[-5%] bottom-[-5%] right-0 w-[38%] md:w-[35%] lg:w-[40%] xl:w-[40%]">
  <Image
    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732172303/29_xtamf2.png"
    width={1500}
    height={844}
    alt="Child Image"
    className="w-full  md:h-[240px] min-[1200px]:h-[265px] xl:h-[285px] border-2 border-[#243460] shadow-md rounded-[15px]"
  />
</div>



    {/* Positioned Text Block */}
    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3 xl:w-[70%] w-[90%] bg-[#4671b8] py-4 text-center px-4 md:px-14 mt-2 md:mt-[-16px] lg:mt-0 space-y-1 rounded-xl text-white font-poppins block">
      <div className="text-[10px] xs:text-[8px] lg:text-[15px]">
        <strong>Transforming Radiology with Aarogya Aadhar AI Portal</strong>
        <br />
        We are providing X-Ray, Sonography, Mammography, CT Scan, MRI Scan & Pet Scan Online Report System
      </div>
    </div>
  </div>
</div>

        </div>

        <div className="md:hidden block">
          {" "}
          {/* <div className="w-full md:mt-6">
            <div className="w-full h-auto rounded-[15px] relative">
              <div className="flex flex-col lg:flex-row justify-center items-center pt-8">
                <div className=" w-full">
                  <Image
                    src="https://res.cloudinary.com/dnckhli5u/image/upload/v1732172303/29_xtamf2.png"
                    width={1500}
                    height={844}
                    alt="Second Image"
                    className="w-full h-auto border border-[#ff5e00] shadow-md rounded-[15px]"
                  />
                </div>

                <div className="text-center mt-2 lg:text-left bg-[#4671b8] text-white py-4 px-8 rounded-xl w-full lg:w-auto">
                  <div className="text-[12px] lg:text-[15px] font-poppins">
                    Transforming Radiology with Aarogya Aadhar AI Portal. We are
                    providing X-Ray, Sonography, Mammography, CT Scan, MRI Scan
                    & Pet Scan Online Report System.
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className=" w-full bg-[#4671b8] hidden mt-[-10px]  z-30 py-1 lg:py-2 text-center md:px-14 px-2 space-y-1 rounded-[7px] text-white font-poppins">
          <div className="text-[10px] ">
           <p className=" font-bold"> Transforming Radiology with Aarogya Aadhar AI Portal</p> We are
            providing X-Ray, Sonography, Mammography, CT Scan, MRI Scan & Pet
            Scan Online Report System
          </div>
        </div>
        {/* Stats Section */}
        <div className="flex flex-wrap md:flex-nowrap md:px-8 pt-20 md:pt-12 lg:pt-20 w-full xl:w-[75%] md:mx-auto md:container  items-center justify-center  pb-4">
          <div className="grid grid-cols-5 gap-2 md:grid-cols-5 w-full ">
            {[
              {
                label: "HSP & Hospital’s",
                value: "5500+",
                iconSrc: <FaHospitalAlt className="h-4 w-4 md:h-8 md:w-8" />,
              },
              {
                label: "Patient’s",
                value: "50000+",
                iconSrc: <FaBedPulse className="h-4 w-4 md:h-8 md:w-8" />,
              },
              {
                label: "Covered Cities",
                value: "20+",
                iconSrc: <IoLocation className="h-4 w-4 md:h-8 md:w-8" />,
              },
              {
                label: "Specialists",
                value: "45+",
                iconSrc: <FaUserDoctor className="h-4 w-4 md:h-8 md:w-8" />,
              },
              {
                label: "Team Member’s",
                value: "50+",
                iconSrc: <BsMicrosoftTeams className="h-4 w-4 md:h-8 md:w-8" />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center md:space-y-2 space-y-1"
              >
                <div className="flex justify-center text-[#2271ff] space-x-1">
                  <span>{stat.iconSrc}</span>
                  <span className="text-[#243460] font-bold font-sans text-[10px] md:text-xl xl:text-2xl">
                    {stat.value}
                  </span>
                </div>
                <div className="text-[#243460] text-[7px] md:text-sm font-poppins font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto container border-2 w-full xl:w-[80%] rounded-[15px] border-[#ff5e00] p-2">
          <div className="text-[#243460] md:container md:mx-auto  text-center text-[10px] md:text-sm lg:text-[14px]">
            <p className="">
              {" "}
              <b> Aarogya e-RAD </b>mission is to make quality radiology
              services more affordable and accessible by leveraging the power of
              AI.
            </p>
            <p className="text-justify break-words mt-1 xl:mt-1">
              It is amongst very few Radiology AI companies which have
              successfully adopted its technology in a commercial mode–creating
              clear and quantifiable value for patients, hospitals, and
              radiologists. Currently, it is servicing over <b>5500+</b>{" "}
              hospitals, imaging centers, HSP and Government HSP in their
              Tuberculosis, COVID 19, Nuclear Studies and other public health
              screening programs. <b> Aarogya e-RAD </b> is a global health
              informatics company, catering to outsourcing needs of
              International diagnostic imaging centers, hospitals, HSP’s. Our
              specialized team of Inhouse 24/7 doctors, technicians &
              administrative staff enables us to uphold global standards in all
              that we do.
            </p>
          </div>
        </div>
      </div>
      {/* image with text */}
      <div className="w-full pt-0 lg:pb-4 xl:w-[90%] flex items-center justify-center  flex-wrap md:flex-nowrap">
        <div className="md:w-1/2 text-center items-center justify-center flex w-full">
          <Image
            src={
              "https://res.cloudinary.com/dnckhli5u/image/upload/v1732181738/1_taomgd.png"
            }
            alt=" "
            width={1250}
            height={938}
            className="h-full md:h-[300px] md:w-[400px] w-full"
          />
        </div>
        <div className="font-poppins hidden lg:block md:w-1/2 lg:space-y-2 xl:space-y-5 text-[10px] items-center justify-center  md:text-sm lg:text-[14px] text-justify break-words w-full text-[#243460] ">
          <p>
            <b> Aarogya e-RAD</b> boutique radiology interpretation offering
            enables your diagnostic unit to cope with the growing dearth of on
            call radiologists. Our cutting edge teleradiology solutions,
            provides a cost effective way for diagnostic imaging centers to
            leverage our radiologists located across the globe to meet the
            critical standards of turnaround time and quality.{" "}
          </p>
          <p>
            {" "}
            Our best in class tele-PACS solution eRAD, which requires a basic
            technological set up, has enabled even the remotest centers to
            report cases accurately and efficiently within the required time
            frame. eRAD, is a global leader in PACS integration, providing
            reader friendly user interface, 24x7 support and efficient storage
            solutions.
          </p>
          <p>
            {" "}
            Sign up for a free demo! See how our solutions will seamlessly fit
            into your operations protocol, contributing greatly to the
            efficiency and timeliness of reporting.
          </p>
        </div>
      </div>
      <div className="w-full xl:w-[90%] xl:mx-auto lg:mt-4 pt-4 flex items-center py-4 px-4 rounded-[15px] border-2  border-[#ff5e00] justify-center  flex-wrap md:flex-nowrap">
        <div className="md:w-2/5 md:text-start text-center justify-center items-center flex w-full">
          <div className="font-extrabold  space-y-2">
            <p className="text-[#243460] lg:text-3xl font-poppins text-xl">
              Why choose
            </p>
            <p className="text-[#ff5e00] font-cursive lg:text-4xl text-xl">
              Aarogya e-RAD
            </p>
            <p className="text-[#243460] lg:text-3xl font-poppins text-xl">
              for Radiology Reporting?
            </p>
          </div>
        </div>
        <div className="font-poppins md:w-3/5 lg:space-y-2 xl:space-y-5 text-[10px] items-center justify-center  md:text-sm lg:text-[14px] text-justify break-words w-full text-[#243460] ">
          <p>
            <b> Aarogya e-RAD</b> diagnostic radiology specialist offer
            unparalleled expertise in reporting cases across multiple
            specialties, ensuring exceptional patient care and precise
            diagnostic imaging services.
          </p>
          <p>
            {" "}
            Due to the extensive training and expertise, our radiologists are
            able to make reports precisely. Using advanced technology and a
            commitment to quality, we offer complete radiology reporting
            services that enhance medical imaging solutions.
          </p>
          <p>
            By partnering with us, providers of diagnostic imaging system in
            International & USA can expect exceptional radiology reporting
            services that are driven by expertise, precision, and a commitment
            to excellence. Join us in harnessing the power of accurate
            diagnostic imaging interpretations to transform healthcare and
            improve patient outcomes.
          </p>
        </div>
      </div>
      <div className="w-full md:hidden py-1 block">
        {" "}
        <Image
          src="https://res.cloudinary.com/dnckhli5u/image/upload/v1733469260/Aarogya_e-RAD_Image_2nd.._odvgns.png"
          width={4000}
          height={844}
          className="w-full border-[#243460]  border rounded-[15px]"
          alt=""
        />{" "}
      </div>
    </>
  );
};

export default Homeclient;
