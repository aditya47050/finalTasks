import React from 'react';
import { db } from '@/lib/db';
import Healthcard from '../components/healthcard';
import { getSession } from '@/lib/getsession';
import { FaExclamationCircle } from 'react-icons/fa'; // For an error icon
import Link from 'next/link';

const DigitalHealthCardPage = async () => {
  const patientUser = await getSession();

  // Check if patientUser is defined
  if (!patientUser || !patientUser.email) {
    return (
      <div className='container'>
      <div className="container flex flex-col items-center justify-center p-6 bg-white border border-red-200 rounded-xl shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">No session found</h2>
        <p className="text-gray-700 text-center mb-4">Please log in to view your digital health card.</p>
      </div>
      </div>
    );
  }

  const data = await db.HealthCard.findFirst({
    where: { email: patientUser.email },
    include: {
      patient: true, // Include the patient details
    },
  });

  // Check if data is found
  if (!data) {
    return (
      <div className='container'>
        <div className=" flex flex-col items-center justify-center p-2 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6 ">
          <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
          <h2 className="text-red-500 text-xl font-bold mb-2">No health card found</h2>
          <p className="text-gray-700 text-center mb-4">We {"couldn't"} find your health card details. Please try again later.</p>
        </div>
      </div>

    );
  }

  if (data.approvalStatus === 'REJECTED') {
    return (
      <div className='container'>
      <div className="flex flex-col items-center justify-center p-6 bg-white border border-red-200 mx-auto container rounded-[15px] shadow-md mt-6">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-red-500 text-xl font-bold mb-2">Health card rejected</h2>
        <p className="text-gray-700 text-center mb-4">Your health card has been rejected. Below are the details and remarks:</p>

        {/* Displaying the remark if rejection occurred */}
        {data.remarks && (
  <div className="bg-red-100 text-red-700 rounded-xl p-4 mt-4">
    <h3 className="font-semibold mb-2">Rejection Remarks:</h3>
    <ul className="list-disc pl-5   space-y-2">
      {data.remarks.split(',').map((remark, index) => (
        <li key={index} className="text-sm">{remark.trim()}</li>
      ))}
    </ul>
  </div>
  
)}

     <div className="mt-6">
          <Link href="/patient/dashboard/profile">
            <span className="bg-blue-500 text-white px-4 py-2 rounded">Go to Profile</span>
          </Link>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div>
      {data.approvalStatus === 'APPROVED' ? (
        <div className='xlg:container'>
        <Healthcard userdata={data} />
        </div>
      ) : (
        <div className='container'>
        <div className="flex flex-col mx-auto container rounded-[15px] items-center justify-center p-6 bg-white border border-yellow-200 shadow-md mt-6">
          <FaExclamationCircle className="text-yellow-500 text-6xl mb-4" />
          <h2 className="text-yellow-500 text-xl font-bold mb-2">Health card not approved</h2>
          <p className="text-gray-700 text-center mb-4">Your health card is still awaiting approval.</p>
        </div>
        </div>
      )}
    </div>
  );
};

export default DigitalHealthCardPage;
