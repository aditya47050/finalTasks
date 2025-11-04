import React, { Suspense } from "react";

import DashboardSkeleton from "./components/dashboardskeleton"; // New Skeleton Loader
const DashboardLoader = React.lazy(() => import('./components/dashboardloader'));

const SuperOverview = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  ">
  <DashboardLoader />
    </div>
  );
};

export default SuperOverview;
