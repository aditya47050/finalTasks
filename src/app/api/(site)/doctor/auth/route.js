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

        if (
            !apikey ||
            !email ||
            !mobile||
            !password ||
            apikey !== "479693736527271"
        ) {
             return new NextResponse(JSON.stringify({ msg: "Invalid credentials. Please check email, password, or mobile." }), { status: 400 });
        }

 const doctor = await db.Doctor.findUnique({ where: { email } });
    if (!doctor) return new NextResponse(JSON.stringify({ msg: "User not found." }), { status: 404 });

        const passwordMatch = await bcrypt.compare(
            password,
            doctor.password
        )


 if (!passwordMatch) return new NextResponse(JSON.stringify({ msg: "Incorrect password. Please try again." }), { status: 401 });
        
        

 if (mobile !== doctor.mobile) return new NextResponse(JSON.stringify({ msg: "Incorrect mobile number, Please try again." }), { status: 401 });
        return new NextResponse(JSON.stringify({ msg: "Login successful!", doctor }), { status: 200 });
    } catch (error) {
        console.log("Doctor", error)
        return new NextResponse(JSON.stringify({ msg: error.message }), {
            status: 500,
        })
    }
}
