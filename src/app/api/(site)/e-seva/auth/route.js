import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"


import { db } from "@/lib/db"

export async function GET(request, params) {
    try {
        const searchParams = new URL(request.url).searchParams
        const apikey = searchParams.get("apikey")
        const email = searchParams.get("email")
        const password = searchParams.get("password")
        const mobile = searchParams.get("mobile")
        const role = searchParams.get("role")

        if (
            !apikey ||
            !email ||
            !mobile ||
            !password ||
            !role ||
            apikey !== "479693736527271"
        ) {
            throw new Error("Invalid credentials")
        }


        let user;
        
        // Handle different user types based on role
        if (role === "Eseva" || role === "Asha") {
            // Eseva and Asha users are in the Eseva table
            user = await db.Eseva.findUnique({
                where: { 
                    email: email,
                    role: role
                },
            });
        } else if (role === "SubAdmin") {
            // SubAdmin users are in the EsevaSubAdmin table
            user = await db.EsevaSubAdmin.findUnique({
                where: { 
                    email: email
                },
            });
        } else {
            throw new Error("User not found");
        }

        if (!user) {
            return NextResponse.json(
                { msg: "User not found" },
                { status: 404 }
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ msg: "Incorrect password, Please try again." }, { status: 401 });
        }

        if (mobile !== user.mobile) {
            return NextResponse.json({ msg: "Incorrect mobile number, Please try again" }, { status: 401 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Eseva Login Error:", error);
        return NextResponse.json(
            { msg: "Server error", error: error.message },
            { status: 500 }
        );
    }
}

