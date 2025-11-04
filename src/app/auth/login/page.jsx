"use client";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  
const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/superadmin/otps/loginsendotp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error('Failed to send OTP');
            }

            toast("OTP sent to your email");
            setIsOtpSent(true);
        } catch (error) {
            toast("Something went wrong: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/superadmin/otps/loginverifyotp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (data.success) {
                setIsOtpVerified(true);
                toast("OTP verified successfully! You can now log in.");
            } else {
                toast(data.message);
            }
        } catch (error) {
            toast("Failed to verify OTP: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loginRes = await signIn("credentials", { email, password, redirect: false });

        if (loginRes?.error) {
            toast("Invalid credentials");
        } else {
            toast("Login successful!");
            router.push("/superprofile/dashboard");
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col mt-20 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl font-bold tracking-tight text-[#243460]">
                    Log in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-4" onSubmit={!isOtpSent ? handleSendOtp : isOtpVerified ? handleLogin : handleVerifyOtp}>
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 pl-4 text-[#243460]">
                            Email address
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
                                disabled={isOtpVerified}
                                placeholder="Enter your email"
                                className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {/* OTP Input */}
                    {isOtpSent && !isOtpVerified && (
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium leading-6 pl-4 text-[#243460]">
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
                                    required
                                    placeholder="Enter the OTP sent to your email"
                                    className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    )}

                    {/* Password Input */}
                    {isOtpVerified && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 pl-4 text-[#243460]">
                                Password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                    placeholder="*****"
                                    className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
                                >
                                    {isPasswordVisible ? "Hide" : "Show"} {/* Button text based on state */}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <Button
                            type="submit"
                            className="flex w-full mt-10 justify-center rounded-xl bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            disabled={loading}
                        >
                            {loading ? (isOtpSent && !isOtpVerified ? "Verifying OTP..." : "Please wait") : (isOtpSent && !isOtpVerified ? "Verify OTP" : isOtpVerified ? "Log in" : "Log in")}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 text-center text-sm text-gray-500">
                    <Link href="/authforgot" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Forgot Password?
                    </Link>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not having an account?
                    <a href="/auth/register" className="font-semibold leading-6 pl-4 text-indigo-600 hover:text-indigo-500">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
