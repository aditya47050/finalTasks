"use client"; // Make sure to use the "use client" directive for client-side component
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
const RegisterComponent = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // OTP state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sending
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!isOtpSent) {
      // Send OTP to email
      try {
        const res = await fetch("/api/superadmin/otps/registersendotp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name, email }), // Just send the email for OTP
        });

        if (!res.ok) {
          throw new Error("Failed to send OTP");
        }

        toast("OTP sent to your email");
        setIsOtpSent(true); // Set to true after OTP is sent
      } catch (error) {
        toast("Something went wrong: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Verify OTP and register the user
      try {
        const verifyRes = await fetch("/api/superadmin/otps/registerverifyotp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        });

        const data = await verifyRes.json();

        if (data.success) {
          // Register user now that OTP is verified
          const registerRes = await fetch("/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          });

          if (!registerRes.ok) {
            throw new Error("Failed to create an account");
          }

          toast("Account created successfully!");
          router.push("/auth/login"); // Redirect to login page after successful registration
        } else {
          toast(data.message); // Show error message from server
        }
      } catch (error) {
        toast("Failed to verify OTP: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col mt-20 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#243460]">
          {isOtpSent ? "Verify OTP" : "Create your account"}
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-2" noValidate onSubmit={handleSubmit}>
          {!isOtpSent && (
            <>
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 pl-4 text-[#243460]"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 pl-4 text-[#243460]"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
  <label
    htmlFor="password"
    className="block text-sm font-medium leading-6 pl-4 text-[#243460]"
  >
    Password
  </label>
  <div className="mt-2 relative">
    <input
      id="password"
      name="password"
      type={isPasswordVisible ? "text" : "password"} // Toggle input type based on visibility
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="*****"
      required
      className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
    <button
      type="button"
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
      onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
    >
      {isPasswordVisible ? "Hide" : "Show"} {/* Change button text based on state */}
    </button>
  </div>
</div>

            </>
          )}

          {/* OTP Input */}
          {isOtpSent && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium leading-6 pl-4 text-[#243460]"
              >
                Enter OTP
              </label>
              <div className="mt-2">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                     onChange={(e) => {
        const inputValue = e.target.value;
        // Allow only numbers and limit to 6 digits
        if (/^\d{0,6}$/.test(inputValue)) {
          setOtp(inputValue);
        }
      }}
                  placeholder="Enter the OTP sent to your email"
                  required
                  className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full mt-10 justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isSubmitting ? "cursor-not-allowed bg-gray-400" : ""
              }`}
            >
              {isSubmitting
                ? isOtpSent
                  ? "Please wait..."
                  : "Please wait"
                : isOtpSent
                ? "Verify OTP"
                : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
