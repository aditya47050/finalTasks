"use client"

import { useParams } from "next/navigation"
import SpecialityPage from "../components/SpecialityPage"
import { specialityData } from "../components/specialityData"

export default function SpecialitySlugPage() {
  const { slug } = useParams()
  const data = specialityData[slug] || null

  if (!data) {
    return <div className="text-center p-10 text-red-500">Speciality not found</div>
  }

  return <SpecialityPage slug={slug} data={data} />
}
