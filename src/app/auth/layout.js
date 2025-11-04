import { getCurrentUser } from "../../lib/session"
import Link from "next/link"

import { redirect } from "next/navigation"
import NavBar from "../components/nav"



export default async function AuthLayout({ children }) {
  const user = await getCurrentUser()

  if (user) {
    redirect("/superprofile/dashboard")
  }
 
  return (
    <>
<div><NavBar/></div>
      <div className="mt-[200px]">{children}</div>
    </>
  )
}