"use client";
import React, { useEffect, useState } from "react";
import DashboardClient from "../../components/dashboardclient";
import DashboardSkeleton from "./dashboardskeleton";

const DashboardLoader = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/superadmin/dashboard`, {
          cache: "no-store", // Forces Next.js to fetch fresh data
          headers: {
            "Cache-Control": "no-store", // Ensures browser doesn't cache
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
      
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // If data is still loading or not yet fetched, show the skeleton loader
  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return <DashboardClient {...data} />;
};

export default DashboardLoader;
