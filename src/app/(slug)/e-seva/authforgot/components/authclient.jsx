"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/app/components/nav";
import Mobilenav from "@/app/components/mobilenav";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
export default function ClientPassreset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setloading] = useState(false)
  const [userData, setUserData] = useState({ passportPhoto: null });


  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUppercase = /[A-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUppercase.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!hasNumber.test(password)) {
      return "Password must include at least one number.";
    }
    if (!hasSpecialChar.test(password)) {
      return "Password must include at least one special character.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setloading(true)
    // Validate password
    const error = validatePassword(newPassword);
    if (error) {
      setPasswordError(error);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!token) {
      toast.error("Token is missing. Please ensure you accessed the link correctly.");
      return;
    }

    try {
      const response = await fetch("/api/e-seva/register/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password.");
      }

      const data = await response.json();
      toast.success(data.message);
      router.push("/e-seva/login");
    } catch (error) {
      toast.error(error.message);
    }
  };
 useEffect(() => {
  const fetchProfileImage = async () => {
    try {
      const res = await fetch("/api/user/profile-img");
      const data = await res.json();
      setUserData(prev => ({ passportPhoto: data.passportPhoto }));
    } catch (err) {
      console.error("Failed to fetch profile image:", err);
    }
  };

  fetchProfileImage();
}, []);


  return (
    <>
      <NavBar userData={userData} />
      <Mobilenav data={userData} />
      <div className="flex min-h-screen flex-col px-6 mt-64 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#243460]">
            Reset Your Password
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 pl-4 text-[#243460]">
                New Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 pl-4 text-[#243460]">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isPasswordVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-red-500 text-sm pl-4">{passwordError}</p>
            )}

            <div className="border-2 mt-4 container max-w-xl rounded-[15px] p-2 justify-center items-center">
              <p className="text-[#002e6e] text-[14px] font-bold ml-4">Password Strength:</p>
              <p className="text-[#002e6e] text-[14px] ml-4">
                Use at least 8 characters. Don’t use a password from another site, or something too obvious like your pet’s name. Use one special character, one capital letter, one number.
              </p>
            </div>

            <div>
              <button
                type="submit"
         disabled={loading}       className="flex w-full mt-10 justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
     {loading ? "Please Wait " : "     Reset Password"}       
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
