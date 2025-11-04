import { db } from '@/lib/db';
import { getSession } from '@/lib/getsession';
import React from 'react';
import { AddAmbulanceDriverDialog } from './components/addorEditdrivers';
import AllAmbulanceDriversData from './components/driversdata';

const AmbulanceDrivers = async () => {
  const session = await getSession();

  // Handle missing session or email
  if (!session || !session.email) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Unable to fetch driver data. Please log in or refresh the page.
      </div>
    );
  }

  const ambulance = await db.ambulance.findFirst({
    where: {
      email: session.email,
    },
    select: {
      id: true,
      AmbulanceDriver: true,
      AmbulanceVaichicle: true,
    },
  });

  // Handle no matching ambulance
  if (!ambulance) {
    return (
      <div className="p-6 text-center text-gray-500">
        No ambulance profile found for your account.
      </div>
    );
  }

  return (
    <div>
      <AllAmbulanceDriversData
        drivers={ambulance.AmbulanceDriver}
        ambulances={ambulance.AmbulanceVaichicle}
      />
    </div>
  );
};

export default AmbulanceDrivers;
