"use client";

import { ArrowDown, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "react-toastify";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FaUser } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";

const TeleRadiologyPageNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navitems = [
    {
      label: "Login",
      link: `/teleradiology/login`,
    },
    {
      label: "Register",
      link: `/teleradiology/register`,
    },
    {
      labelicon: <Languages />,
      link: "#",
    },
  ];

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
      <nav
        className="fixed top-0 z-10 font-poppins w-full "
        style={{
          backgroundColor: "#fff",
        }}
      >
        <div className=" xl:mx-auto container pr-20 xl:pr-24 pl-10 w-full flex pt-1 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="https://res.cloudinary.com/dnckhli5u/image/upload/v1724307243/aarogya%20aadhar/ytwdebp7hhsjd56z0vdb.png"
              width={180}
              height={200}
              alt=""
              className="h-[60px] w-full"
            />
          </Link>

          <div className="hidden md:block items-center">
            <ul className="flex justify-center text-center space-x-2 items-center">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <li className="bg-[#243460] text-[14px] font-semibold text-white px-3 py-1 rounded-[8px] cursor-pointer hover:bg-[#ff5e00] transition">
                    Request a Demo
                  </li>
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
              </Dialog>
              {navitems.map((item, index) => (
  <Link key={index} href={item.link}>
    <li className="flex items-center">
      {item.label ? (
        <span
          className={`font-semibold text-white rounded-[8px] px-3 py-1 ${
            pathname === item.link
              ? "bg-[#ff5e00]"
              : "bg-[#243460]"
          } hover:bg-[#ff5e00] transition`}
        >
          {item.label}
        </span>
      ) : (
        <span className="text-[#ff5e00] ">{item.labelicon}</span>
      )}
    </li>
  </Link>
))}

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TeleRadiologyPageNav;
