import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import ChangePasswordClient from './../../components/changepassword';

const ChangePasswordPage = async () => {
  try {
    const patientUser = await getSession();

    // Check if patientUser is defined
    if (!patientUser || !patientUser.email) {
      return <div>No session found. Please log in</div>;
    }

    const data = await db.JObUser.findFirst({
      where: { email: patientUser.email },
    });

    // Check if data is found
    if (!data) {
      return <div>No User found</div>;
    }

    return (
      <div>
        <ChangePasswordClient user={data} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user for ChangePasswordPage:", error);
    return <div className="text-red-500">Something went wrong. Please try again later.</div>;
  }
};

export default ChangePasswordPage;
