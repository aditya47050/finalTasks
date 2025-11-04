import React from "react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import DiagnosticCenter from "@/app/patient/dashboard/components/diagnosticcenter";

export const dynamic = "force-dynamic";

const PatientDiagnosticServicesPage = async () => {
    try {
        const session = await getSession();
        if (!session?.email) {
            throw new Error("Session or email not found");
        }

        const patient = await db.patient.findUnique({
            where: { email: session.email },
        });
        if (!patient) {
            throw new Error("Patient not found");
        }

        // 3. Diagnostic Bookings Query
        const diagnosticBookings = await db.bookDiagnosticService.findMany({
            where: { patientId: patient.id },
            include: {
                service: {
                    include: {
                        Hospital: {
                            include: {
                                hspInfo: {
                                    include: {
                                        hspcategory: {
                                            include: {
                                                diagnosticcategory: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                bookingDate: 'desc'
            }
        });

        const formattedData = diagnosticBookings.map((booking, index) => {
            // Service data verification
            const serviceData = booking.service ? {
                facility: booking.service.facility,
                category: booking.service.category,
                subCategory: booking.service.subCategory,
                hospitalId: booking.service.hospitalId
            } : null;

            // Hospital data verification
            const hospitalData = booking.service?.Hospital ? {
                name: booking.service.Hospital.name,
                hspInfo: booking.service.Hospital.hspInfo
            } : null;

            // Diagnostic category verification
            const diagnosticCategories = booking.service?.Hospital?.hspInfo?.hspcategory
                ?.filter(cat => cat.diagnosticcategory !== null)
                ?.map(cat => cat.diagnosticcategory);

            const primaryDiagnosticCategory = diagnosticCategories?.[0];

            const transformedData = {
                id: booking.id,
                serviceId: booking.serviceId,
                facility: booking.service?.facility || "Not specified",
                category: booking.service?.category || "Not specified",
                subCategory: booking.service?.subCategory || "Not specified",
                hospitalRegName: booking.service?.Hospital?.hspInfo?.regname || "Not specified",
                minPrice: booking.service?.minPrice || "Not specified",


                maxPrice: booking.service?.maxPrice || "Not specified",
                available: booking.service?.available || false,
                hospitalId: booking.service?.hospitalId || null,

                hospitalName: booking.service?.Hospital?.name || "Not specified",
                hospitalRegName: booking.service?.Hospital?.hspInfo?.regname || "Not specified",
                diagnosticCategory: primaryDiagnosticCategory?.title || "Not specified",
                diagnosticCategoryId: primaryDiagnosticCategory?.id || null,
                bookingDate: booking.bookingDate,
                preferredDate: booking.preferredDate,
                preferredTimeSlot: booking.preferredTimeSlot,
                status: booking.status,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                _raw: {
                    service: booking.service ? {
                        id: booking.service.id,
                        hospitalId: booking.service.hospitalId
                    } : null,
                    hospital: booking.service?.Hospital ? {
                        id: booking.service.Hospital.id,
                        hspInfoId: booking.service.Hospital.hspInfoId
                    } : null,
                    hspInfo: booking.service?.Hospital?.hspInfo ? {
                        id: booking.service.Hospital.hspInfo.id,
                        regname: booking.service.Hospital.hspInfo.regname,
                        hspcategoryCount: booking.service.Hospital.hspInfo.hspcategory?.length || 0
                    } : null
                }
            };

            return transformedData;
        });

        return <DiagnosticCenter bookings={formattedData} />;
    } catch (error) {
        console.error("Error loading DiagnosticServicesPage:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        return <div className="text-center p-6">Something went wrong. Check console for details.</div>;
    }
};

export default PatientDiagnosticServicesPage;