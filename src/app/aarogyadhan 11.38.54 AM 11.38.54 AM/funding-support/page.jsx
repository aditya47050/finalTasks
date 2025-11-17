"use client";

import { Suspense } from "react";
import FundingSupportClient from "./components/funding_support";





export default function StateFundingPage() {
  return ( 
    <Suspense fallback={<div>Loading...</div>}>
      <FundingSupportClient />
    </Suspense>
  );
}
