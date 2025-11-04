import React from 'react';
import { db } from '@/lib/db';
import AarogyaMitraCLient from '../components/aarogya-mitraclient';

const AarogyaMitra = async () => {
  // Fetch the enquiries from the database
  const enquiries = await db.AarogyaMitra.findMany({
    // Add any filters or options as needed for your query
  });

  // Reverse the data before passing it to the component
  const reversedEnquiries = [...enquiries].reverse();

  return (
    <AarogyaMitraCLient enquiries={reversedEnquiries} />
  );
}

export default AarogyaMitra;
