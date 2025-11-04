"use client";
import Mobilenav from "@/app/components/mobilenav";
import NavBar from "@/app/components/nav";
import MainSidebar from "@/app/components/sidebar";
import { useState, useEffect } from "react";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
const [loading, setloading] = useState(false)
const [userData, setUserData] = useState({ passportPhoto: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    const response = await fetch('/api/hospital/register/reqtoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setloading(false)
    setMessage(data.message);
    
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
<><NavBar userData={userData}/> <Mobilenav  data={userData}/> <MainSidebar/>    <div className="flex min-h-screen flex-col items-center justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#243460]">
          Request Password Reset
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 pl-4 text-[#243460]">
              Email Address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="Enter your email"
                className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={loading}>
         {loading ?"Please Wait "  : "  Request Password Reset"}   
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <p className="mt-4 text-center text-sm text-gray-500">
              {message}
            </p>
          )}
        </form>
      </div>
    </div></>
  );
}
