import { db } from "@/lib/db"; // your Prisma instance
import SurgeryBookingslist from "../../components/SurgeryBookingslist";

const SurgeryBookingsPage = async ({ params }) => {
  const { surgeryId } = await params; // surgery ID from URL

  const bookings = await db.bookSurgeryTreatment.findMany({
    where: {
      serviceId: surgeryId, 
      service: { type: "Surgery" } 
    },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mobile: true,
        },
      },
      service: {
        select: {
          id: true,
          serviceName: true,
          category: true,
          hospital: {
            select: {
              id: true,
              email: true,
              hspInfo: {
                select: {
                  regname: true,
                  hspcategory: {
                    select: {
                      hspcategory: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      doctors: {
      include: { doctor: true }, // brings BookSurgeryDoctor + doctor info
    },
    },
    orderBy: {
      bookingDate: "desc",
    },
  });
    const hospitalId = bookings[0].service.hospital.id;

    const doctors = await db.HospitalDoctor.findMany({
      where: { hospitalId },
      include: {
        doctor: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    const book = await db.BookSurgeryDoctor.findMany({
      include: {
        booking : true,
        doctor  : true,
      }
    });


  return <SurgeryBookingslist userdata={bookings} doctors={doctors}/>;
};

export default SurgeryBookingsPage;
