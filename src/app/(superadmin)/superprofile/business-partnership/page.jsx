import React from 'react';
import BusinessPartnershipclient from '../components/business-partnershipenq';
import { db } from '@/lib/db';

const BusinessPartnershipEnq = async () => {
  // Fetch the enquiries from the database
  const enquiries = await db.BusinessPartnershipEnq.findMany({
    // Add any filters or options as needed for your query
  });

  // Reverse the data before passing it to the component
  const reversedEnquiries = [...enquiries].reverse();

  return (
    <BusinessPartnershipclient enquiries={reversedEnquiries} />
  );
}

export default BusinessPartnershipEnq;
