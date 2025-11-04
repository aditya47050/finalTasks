import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/getsession";
import { db } from "@/lib/db";
import FamilyMemberList from "../components/viewfamilymembers";
import { getReciprocalRelationshipWithGender } from "@/lib/relationshipUtils";

const FamilyDetailsMainPage = async () => {
  const session = await getSession();

  // If no session exists, redirect to the login page
  if (!session) {
    redirect("/patient/login");
  }

  const userdata = await db.Patient.findUnique({
    where: { email: session.email },
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
              gender: true
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
              pincode: true
            },
          },
        },
      },
    },
  });

  const [state, dist, subdist] = await Promise.all([
    db.State.findMany({}),
    db.District.findMany({}),
    db.SubDistrict.findMany({}),
  ]);

  // Get all family members that the current user added
  const ownedMembers = (userdata.familymembers || []).map(m => ({ 
    ...m, 
    type: "owned",
    isRegisteredPatient: !!m.registeredPatientId
  }));

  // Get family members where the current user was added by someone else
  const invitedMembers = (userdata.addedAsFamilyMember || []).map(m => {
    const reciprocalRelation = getReciprocalRelationshipWithGender(
      m.relation || "", 
      userdata.gender || ""
    );
    
    return {
      id: m.id,
      firstName: m.Patient?.firstName || m.firstName || "",
      middleName: m.Patient?.middleName || m.middleName || "",
      lastName: m.Patient?.lastName || m.lastName || "",
      email: m.Patient?.email || m.email || "",
      mobile: m.Patient?.mobile || m.mobile || "",
      gender: m.Patient?.gender || m.gender || "",
      bloodgroup: m.Patient?.bloodgroup || m.bloodgroup || "",
      aadharCardNumber: m.Patient?.aadharCardNumber || m.aadharCardNumber || "",
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
      registeredPatientId: m.registeredPatientId
    };
  });

  const allMembers = [...ownedMembers, ...invitedMembers];

  // FILTER LOGIC: Remove owned entries that have a corresponding invited entry
  const filteredMembers = allMembers.filter(member => {
    // If it's an invited member, always keep it
    if (member.type === "invited") return true;
    
    // If it's an owned member, check if there's a corresponding invited entry
    const hasInvitedCounterpart = invitedMembers.some(invited => 
      (invited.aadharCardNumber && member.aadharCardNumber && 
       invited.aadharCardNumber === member.aadharCardNumber) ||
      (invited.email && member.email && invited.email === member.email)
    );
    
    // Only keep owned member if there's NO invited counterpart
    return !hasInvitedCounterpart;
  });
  const connectionReq = await db.connectionRequest.findFirst({
        where: { senderEmail: userdata.email },
      });

  return (
    <>
      <FamilyMemberList
        userdata={userdata}
        connectionReq={connectionReq}
        state={state}
        dist={dist}
        subdist={subdist}
        members={filteredMembers}
      />
    </>
  );
};

export default FamilyDetailsMainPage;