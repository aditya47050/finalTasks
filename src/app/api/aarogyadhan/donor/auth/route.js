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
            throw new Error("Invalid credentials")
        }

        const donor = await db.donor.findUniqueOrThrow({
            where: { email : email } ,
         
           
        })

        const passwordMatch = await bcrypt.compare(
            password,
            donor.password
        )


        // if password does not match
        if (!passwordMatch) {
            throw new Error("Incorrect password")
        }
        
        

        // if mobile does not match
        if (mobile !== donor.mobile) {
            throw new Error("Incorrect Mobile Number")
        }
        return new NextResponse(JSON.stringify(donor), { status: 200 })
    } catch (error) {
        console.log("donor", error)
        return new NextResponse(JSON.stringify({ msg: error.message }), {
            status: 500,
        })
    }
}
