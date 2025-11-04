import React from "react"
import { db } from "@/lib/db"
import FamilyMemberList from "../../components/viewfamilymembers"
import { getReciprocalRelationshipWithGender } from "@/lib/relationshipUtils"

const FamilyDetailsMainPage = async ({ params }) => {
  try {
    const { patientid: patientId } = params // ✅ extract patientId from URL

    if (!patientId) {
      return <div>Patient ID not provided</div>
    }

    const userdata = await db.Patient.findUnique({
      where: { id: patientId }, // ✅ use patientId instead of session.email
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        familymembers: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            relation: true,
            age: true,
            mobile: true,
            bloodgroup: true,
            aadharCardNumber: true,
            gender: true,
            presentAddress: true,
            city: true,
            pincode: true,
            state: true,
            district: true,
            taluka: true,
            approvalStatus: true,
            Remark: true,
            registeredPatientId: true,
            Patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                gender: true,
              },
            },
          },
        },
        addedAsFamilyMember: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            relation: true,
            age: true,
            mobile: true,
            bloodgroup: true,
            aadharCardNumber: true,
            gender: true,
            presentAddress: true,
            city: true,
            pincode: true,
            state: true,
            district: true,
            taluka: true,
            approvalStatus: true,
            Remark: true,
            registeredPatientId: true,
            Patient: {
              select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                email: true,
                mobile: true,
                gender: true,
                bloodgroup: true,
                aadharCardNumber: true,
                dateOfBirth: true,
                presentAddress: true,
                city: true,
                state: true,
                district: true,
                taluka: true,
                pincode: true,
              },
            },
          },
        },
      },
    })

    if (!userdata) {
      return <div>Patient not found</div>
    }

    const [state, dist, subdist] = await Promise.all([
      db.State.findMany({}),
      db.District.findMany({}),
      db.SubDistrict.findMany({}),
    ])

    // ✅ Owned family members
    const ownedMembers = (userdata.familymembers || []).map((m) => ({
      ...m,
      type: "owned",
      isRegisteredPatient: !!m.registeredPatientId,
    }))

    // ✅ Invited members (reverse relationship)
    const invitedMembers = (userdata.addedAsFamilyMember || []).map((m) => {
      const reciprocalRelation = getReciprocalRelationshipWithGender(
        m.relation || "",
        userdata.gender || ""
      )

      return {
        id: m.id,
        firstName: m.Patient?.firstName || m.firstName || "",
        middleName: m.Patient?.middleName || m.middleName || "",
        lastName: m.Patient?.lastName || m.lastName || "",
        email: m.Patient?.email || m.email || "",
        mobile: m.Patient?.mobile || m.mobile || "",
        gender: m.Patient?.gender || m.gender || "",
        bloodgroup: m.Patient?.bloodgroup || m.bloodgroup || "",
        aadharCardNumber:
          m.Patient?.aadharCardNumber || m.aadharCardNumber || "",
        presentAddress: m.Patient?.presentAddress || m.presentAddress || "",
        city: m.Patient?.city || m.city || "",
        district: m.Patient?.district || m.district || "",
        taluka: m.Patient?.taluka || m.taluka || "",
        state: m.Patient?.state || m.state || "",
        pincode: m.Patient?.pincode || m.pincode || "",
        relation: reciprocalRelation || m.relation || "",
        age: m.age || null,
        approvalStatus: m.approvalStatus,
        Remark: m.Remark,
        type: "invited",
        isRegisteredPatient: !!m.registeredPatientId,
        registeredPatientId: m.registeredPatientId,
      }
    })

    const allMembers = [...ownedMembers, ...invitedMembers]

    // ✅ Filter: remove duplicates (owned vs invited)
    const filteredMembers = allMembers.filter((member) => {
      if (member.type === "invited") return true

      const hasInvitedCounterpart = invitedMembers.some(
        (invited) =>
          (invited.aadharCardNumber &&
            member.aadharCardNumber &&
            invited.aadharCardNumber === member.aadharCardNumber) ||
          (invited.email && member.email && invited.email === member.email)
      )

      return !hasInvitedCounterpart
    })

    return (
      <FamilyMemberList
        userdata={userdata}
        state={state}
        dist={dist}
        subdist={subdist}
        members={filteredMembers}
      />
    )
  } catch (error) {
    console.error("Error loading family details:", error)
    return <div>Something went wrong. Please try again later.</div>
  }
}

export default FamilyDetailsMainPage
