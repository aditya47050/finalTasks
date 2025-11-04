import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {
    // Get hospitalId from query parameters
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");
    
    console.log("🔍 Fetching diagnostic center service hours...");
    console.log("📍 Hospital ID:", hospitalId);

    if (!hospitalId) {
      return NextResponse.json(
        {
          success: false,
          error: "Hospital ID is required",
        },
        { status: 400 }
      );
    }
    
    // Fetch the specific diagnostic center with related data
    const diagnosticCenter = await db.hospital.findUnique({
      where: {
        id: hospitalId,
      },
      include: {
        hspInfo: true,
        hspcontact: true,
        hspdetails: true,
        diagnosticServices: {
          where: {
            available: true,
          },
          select: {
            id: true,
            facility: true,
            category: true,
            available: true,
            _count: {
              select: {
                BookDiagnosticService: true,
              },
            },
          },
        },
      },
    });

    if (!diagnosticCenter) {
      return NextResponse.json(
        {
          success: false,
          error: "Diagnostic center not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ Diagnostic center found:", diagnosticCenter.hspInfo?.regname);

    // Transform data into service hours format
    const serviceHoursData = [];
    
    const centerName = diagnosticCenter.hspInfo?.regname || "Diagnostic Center";
    const contact = diagnosticCenter.hspcontact?.receptioncontact1 || diagnosticCenter.mobile || "";
    const city = diagnosticCenter.hspcontact?.city || "";
    const state = diagnosticCenter.hspcontact?.state || "";
    const onlineConsultation = diagnosticCenter.hspInfo?.onlineconsultation === "yes";
    const homeCollection = diagnosticCenter.hspInfo?.homehealthcare === "yes";
    
    // Calculate total bookings from diagnostic services
    const totalBookings = diagnosticCenter.diagnosticServices?.reduce(
      (sum, service) => sum + (service._count?.BookDiagnosticService || 0),
      0
    ) || 0;
    
    // Service 1: Main Diagnostic Services (24/7)
    serviceHoursData.push({
      id: `diagnostic-${diagnosticCenter.id}`,
      serviceName: "Diagnostic Services",
      type: "24/7 Service",
      days: "All Days",
      hours: "24 Hours",
      status: "Available",
      description: "Round-the-clock diagnostic testing and emergency services",
      color: "green",
      hospitalName: centerName,
      hospitalId: diagnosticCenter.id,
      contact: contact,
      location: city ? `${city}${state ? `, ${state}` : ""}` : null,
      totalTests: diagnosticCenter.diagnosticServices?.length || 0,
    });

    // Service 2: Sample Collection Center
    serviceHoursData.push({
      id: `collection-${diagnosticCenter.id}`,
      serviceName: "Sample Collection Center",
      type: "Regular Hours",
      days: "Monday - Saturday",
      hours: "8:00 AM - 8:00 PM",
      status: "Available",
      description: "Walk-in sample collection and home collection booking",
      color: "blue",
      hospitalName: centerName,
      hospitalId: diagnosticCenter.id,
      contact: contact,
      location: city ? `${city}${state ? `, ${state}` : ""}` : null,
    });

    // Service 3: Report Collection
    serviceHoursData.push({
      id: `reports-${diagnosticCenter.id}`,
      serviceName: "Report Collection",
      type: "Extended Hours",
      days: "Monday - Saturday",
      hours: "7:00 AM - 9:00 PM",
      status: "Available",
      description: "Physical report collection and digital report download",
      color: "purple",
      hospitalName: centerName,
      hospitalId: diagnosticCenter.id,
      contact: contact,
      location: city ? `${city}${state ? `, ${state}` : ""}` : null,
    });

    // Service 4: Home Sample Collection (if available)
    if (homeCollection) {
      serviceHoursData.push({
        id: `home-${diagnosticCenter.id}`,
        serviceName: "Home Sample Collection",
        type: "Scheduled Service",
        days: "All Days",
        hours: "6:00 AM - 10:00 PM",
        status: "Available",
        description: "Book home collection with advance scheduling",
        color: "orange",
        hospitalName: centerName,
        hospitalId: diagnosticCenter.id,
        contact: contact,
        location: city ? `${city}${state ? `, ${state}` : ""}` : null,
      });
    }

    // Service 5: Customer Support (24/7)
    serviceHoursData.push({
      id: `support-${diagnosticCenter.id}`,
      serviceName: "Customer Support",
      type: "24/7 Support",
      days: "All Days",
      hours: "24 Hours",
      status: "Available",
      description: "Phone and online support for queries and bookings",
      color: "cyan",
      hospitalName: centerName,
      hospitalId: diagnosticCenter.id,
      contact: contact,
      location: city ? `${city}${state ? `, ${state}` : ""}` : null,
    });

    // Service 6: Online Consultation (if available)
    if (onlineConsultation) {
      serviceHoursData.push({
        id: `online-${diagnosticCenter.id}`,
        serviceName: "Online Consultation",
        type: "Scheduled Service",
        days: "Monday - Saturday",
        hours: "9:00 AM - 6:00 PM",
        status: "Available",
        description: "Online consultation with specialists for test reports",
        color: "indigo",
        hospitalName: centerName,
        hospitalId: diagnosticCenter.id,
        contact: contact,
        location: city ? `${city}${state ? `, ${state}` : ""}` : null,
      });
    }

    console.log("✅ Service hours mapped:", serviceHoursData.length);

    // Calculate statistics for this specific diagnostic center
    const stats = {
      totalServices: serviceHoursData.length,
      centerName: centerName,
      totalTests: diagnosticCenter.diagnosticServices?.length || 0,
      totalBookings: totalBookings,
      location: city ? `${city}${state ? `, ${state}` : ""}` : null,
      onlineConsultation: onlineConsultation,
      homeCollection: homeCollection,
      experience: diagnosticCenter.hspInfo?.experience || null,
    };

    console.log("✅ Statistics:", stats);
    console.log("📤 Returning response with", serviceHoursData.length, "service hours");

    return NextResponse.json({
      success: true,
      data: serviceHoursData,
      stats: stats,
      centerInfo: {
        name: centerName,
        contact: contact,
        location: city ? `${city}${state ? `, ${state}` : ""}` : null,
        logo: diagnosticCenter.hspdetails?.hsplogo || null,
      },
    });
  } catch (error) {
    console.error("Error fetching service hours:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch service hours",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

