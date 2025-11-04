"use client"

import { useState, useEffect } from "react"
import SpecialityTabs from "./SpecialityTabs"
import SurgeryCard from "./SpecialityCards/SurgeryCard"
import HospitalCard from "./SpecialityCards/HospitalCard"
import AllSections from "./AllSections"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import TopHospitalCard from "./TopHospitalCard"
import HospitalDetails from "./HospitalDetails"
import HospitalAbout from "./HospitalAbout"
import { doctorsData } from "./data"
import { DoctorCard } from "./SpecialityCards/DoctorCard"
import Doctorsingleview from './../../../../(slug)/doctor/[doctortypeid]/[doctorid]/components/doctorsingleview';
import MobileDoctorFilter from './MobileDoctorFilter';
import MobileHospitalFilter from './SpecialityCards/MobileHospitalFilter';
import MobileTreatmentFilter from './SpecialityCards/MobileTreatmentFilter';
import MobileSurgeryFilter from './SpecialityCards/MobileSurgeryFilter';

export default function SpecialityPage({ slug, data }) {
  const [activeTab, setActiveTab] = useState("Sub Categories")
  const [activeDropdowns, setActiveDropdowns] = useState({})
  const [activeSection, setActiveSection] = useState(null)
  const [selectedArea, setSelectedArea] = useState(null); // for view more
const [selectedSurgery, setSelectedSurgery] = useState(null); // track which surgery
const [selectedTreatmentArea, setSelectedTreatmentArea] = useState(null);
const [selectedTreatment, setSelectedTreatment] = useState(null);
const [selectedHospital, setSelectedHospital] = useState(null);
const [showAbout, setShowAbout] = useState(false);
const [selectedDoctorId, setSelectedDoctorId] = useState(null);
const [mobileIntroActive, setMobileIntroActive] = useState(true); // only for mobile

  const selectedDoctor = doctorsData.find((doc) => doc.id === selectedDoctorId)



  const toggleDropdown = (category) => {
    setActiveDropdowns((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSectionClick = (section) => {
    setActiveSection(section)

    // Scroll to the section
    const sectionElement = document.getElementById(`section-${section.toLowerCase().replace(/\s+/g, "-")}`)
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" })
    }
  }
  const handleTabChange = (tab) => {
  setActiveTab(tab);

  // If user clicks "Sub Categories" on mobile, hide intro
  if (tab === "Sub Categories" && window.innerWidth < 768) {
    setMobileIntroActive(false);
  }
};
  // Scroll to active section when it changes
  useEffect(() => {
    if (activeSection) {
      const sectionElement = document.getElementById(`section-${activeSection.toLowerCase().replace(/\s+/g, "-")}`)
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [activeSection])

  const groupedSurgeries = data.surgeries.reduce((acc, item) => {
  const location = item.location.replace(/[()]/g, "").trim(); // Clean "(Area)" to "Area"
  if (!acc[location]) acc[location] = [];
  acc[location].push(item);
  return acc;
}, {});
const groupedTreatments = data.treatments.reduce((acc, item) => {
  const location = item.location.replace(/[()]/g, "").trim(); // clean (Area)
  if (!acc[location]) acc[location] = [];
  acc[location].push(item);
  return acc;
}, {});



  return (
    <div className="font-sans xs:p-2 md:p-4 z-0 bg-white h-full xs:px-0  md:container md:pl-[60px] md:pr-[60px]">
      {/* Header */}
      <div className="text-center mb-3">
        <h2 className="text-[30px] font-bold text-[#5271FF] ">{slug.charAt(0).toUpperCase() + slug.slice(1)}</h2>
        <p className="text-[#5271FF] text-[15px]">Treatment by Specialities</p>
      </div>

      {/* Tabs */}
      <SpecialityTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        activeDropdowns={activeDropdowns}
        toggleDropdown={toggleDropdown}
        data={data}
      />

      {/* Content */}
      <div className="xs:mt-0 md:mt-6 ">
        {activeTab === "Sub Categories" && (
          <>          
            <div className="hidden md:block bg-white rounded-lg shadow-sm p-6">
              <div className="w-full flex gap-4">
                {/* Left sidebar with categories */}
                <div className="bg-[#E3F2FD] p-4 hidden md:block rounded-lg sticky top-4 self-start h-fit  lg:w-1/5">
                  <ul className="space-y-3">
                    {data.subCategories.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => handleSectionClick(item)}
                        className={`text-[#5271FF] hover:bg-white hover:shadow-sm p-1 rounded cursor-pointer transition-all duration-200 ${
                          activeSection === item ? "bg-white shadow-sm font-semibold" : ""
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right content area - All sections */}
                <div className="lg:w-4/5">
                  <AllSections data={data} slug={slug}/>
                </div>
              </div>
            </div>
            <div className="block md:hidden">
              {mobileIntroActive ? (
                <div className="grid grid-cols-2  gap-4 p-4">
                  <div
                    className="border-2 place-items-center text-center py-12 rounded-xl shadow font-semibold cursor-pointer"
                  >
                    ads
                  </div>
                  <div
                    className="border-2 place-items-center text-center py-12 rounded-xl shadow font-semibold cursor-pointer"
                  >
                    ads
                  </div>
                  <div
                    className="col-span-2 place-items-center border-2 text-center py-12 rounded-xl shadow font-semibold cursor-pointer"
                  >
                    Aarogya aadhar 
                  </div>
                </div>
              ) : (
                // Show the actual subcategories when intro is dismissed
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="space-y-4">
                    <AllSections data={data} slug={slug} />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === "Top Surgeries" && (
          <>
            <div className="hidden md:block">
                {!selectedArea ? (
                // 🚀 Show Surgery Cards by Area
                <Carousel opts={{ align: "start" }} className="w-full h-full">
                    <CarouselContent className="mb-4">
                    {Object.keys(groupedSurgeries).map((area) =>
                        groupedSurgeries[area].map((item, idx) => (
                        <CarouselItem key={`${area}-${idx}`} className="flex justify-center md:basis-1/2 min-[1100px]:basis-1/3 xl:basis-1/5 px-2">
                            <SurgeryCard
                            {...item}
                            type="surgery"
                            onViewMore={() => {
                                setSelectedArea(area);
                                setSelectedSurgery(item.name);
                            }}
                            />
                        </CarouselItem>
                        ))
                    )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                ) : (
                // ✅ Show Hospitals for Selected Area & Surgery
                <div>
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#5271FF]">
                        Hospitals in {selectedArea} for {selectedSurgery}
                    </h2>
                    <button
                        onClick={() => {
                        setSelectedArea(null);
                        setSelectedSurgery(null);
                        }}
                        className="mb-4 ml-auto block bg-gray-200 hover:bg-gray-300 text-blue-800 font-semibold py-2 px-4 rounded-full shadow-sm flext justify-end"
                    >
                        ← Back to Surgeries
                    </button>
                    </div>
                    <Carousel opts={{ align: "start" }} className="w-full h-full">
                      <CarouselContent className="w-full h-full !ml-auto mb-4">
                        {data.hospitals.map((hospital, i) => (
                          <CarouselItem key={i} className="flex justify-center md:basis-1/2 min-[1100px]:basis-1/3 xl:basis-1/5 px-4 ">
                            <HospitalCard
                              name={hospital.name}
                              address={hospital.address}
                              reviews={hospital.reviews}
                              surgeryName={selectedSurgery} // or selectedTreatment
                              price="Rs. 3,00,000 to Rs. 4,50,000" // or your dynamic value
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>

                </div>
                )}
            </div>
            <div className="block md:hidden px-4 py-2">
              <MobileSurgeryFilter/>
            {!selectedArea ? (
              // 👁️ Show Surgeries by Area
              <div className="grid grid-cols-2 place-items-center xs:gap-2 sm:gap-y-4 my-4 mx-auto">
                {Object.keys(groupedSurgeries).map((area) =>
                  groupedSurgeries[area].map((item, idx) => (
                    <div key={`${area}-${idx}`}>
                      <SurgeryCard
                        {...item}
                        type="surgery"
                        onViewMore={() => {
                          setSelectedArea(area);
                          setSelectedSurgery(item.name);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            ) : (
              // 🏥 Show Hospitals for Selected Surgery
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm font-bold text-[#5271FF]">
                    Hospitals in {selectedArea}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedArea(null);
                      setSelectedSurgery(null);
                    }}
                    className="text-xs text-blue-800 font-semibold px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    ← Back
                  </button>
                </div>

                <div className="grid grid-cols-2 place-items-center xs:gap-2 sm:gap-y-4 my-4 mx-auto">
                  {data.hospitals.map((hospital, i) => (
                    <div key={i}>
                      <HospitalCard
                        name={hospital.name}
                        address={hospital.address}
                        reviews={hospital.reviews}
                        surgeryName={selectedSurgery}
                        price="Rs. 3,00,000 to Rs. 4,50,000"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          </>
        )}
        {activeTab === "Top Treatment" && (
          <>
            <div className="hidden md:block">
              {!selectedTreatmentArea ? (
                // Show scrollable treatment cards grouped by area
                <Carousel opts={{ align: "start" }} className="w-full">
                  <CarouselContent className="mb-4">
                    {Object.keys(groupedTreatments).map((area) =>
                      groupedTreatments[area].map((item, idx) => (
                        <CarouselItem key={`${area}-${idx}`} className="flex justify-center md:basis-1/2 min-[1100px]:basis-1/3 xl:basis-1/5 px-2">
                          <SurgeryCard
                            {...item}
                            type="treatment"
                            onViewMore={() => {
                              setSelectedTreatmentArea(area);
                              setSelectedTreatment(item.name);
                            }}
                          />
                        </CarouselItem>
                      ))
                    )}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                // Show hospitals for selected treatment
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#5271FF]">
                      Hospitals in {selectedTreatmentArea} for {selectedTreatment}
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedTreatmentArea(null);
                        setSelectedTreatment(null);
                      }}
                      className="mb-4 ml-auto block bg-gray-200 hover:bg-gray-300 text-blue-800 font-semibold py-2 px-4 rounded-full shadow-sm flext justify-end"
                    >
                      ← Back to Treatments
                    </button>
                  </div>
                  <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="mb-4">
              {data.hospitals.map((hospital, i) => (
                <CarouselItem key={i} className="flex justify-center md:basis-1/2 min-[1100px]:basis-1/3 xl:basis-1/5 px-2">
                  <HospitalCard
                    name={hospital.name}
                    address={hospital.address}
                    reviews={hospital.reviews}
                    surgeryName={selectedSurgery} // or selectedTreatment
                    price="Rs. 3,00,000 to Rs. 4,50,000" // or your dynamic value
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

                </div>
              )}
            </div>
            <div className="block md:hidden px-4 py-2">
              <MobileTreatmentFilter/>
              {!selectedTreatmentArea ? (
                // 📌 Show Treatment Cards Grouped by Area
                <div className="grid grid-cols-2 place-items-center xs:gap-2 sm:gap-y-4 my-4 mx-auto">
                  {Object.keys(groupedTreatments).map((area) =>
                    groupedTreatments[area].map((item, idx) => (
                      <div key={`${area}-${idx}`}>
                        <SurgeryCard
                          {...item}
                          type="treatment"
                          onViewMore={() => {
                            setSelectedTreatmentArea(area);
                            setSelectedTreatment(item.name);
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // 🏥 Show Hospitals for Selected Treatment
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-bold text-[#5271FF]">
                      Hospitals in {selectedTreatmentArea}
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedTreatmentArea(null);
                        setSelectedTreatment(null);
                      }}
                      className="text-xs text-blue-800 font-semibold px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="grid grid-cols-2 place-items-center xs:gap-2 sm:gap-y-4 my-4 mx-auto">
                    {data.hospitals.map((hospital, i) => (
                      <div key={i}>
                        <HospitalCard
                          name={hospital.name}
                          address={hospital.address}
                          reviews={hospital.reviews}
                          surgeryName={selectedTreatment}
                          price="Rs. 3,00,000 to Rs. 4,50,000"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === "Top Hospitals" && (
          <>
            <div className="hidden md:block">
              {!selectedHospital ? (
                <Carousel opts={{ align: "start" }} className="w-full">
                  <CarouselContent className="mb-4">
                    {data.hospitals.map((hosp, i) => (
                      <CarouselItem
                        key={i}
                        className="flex justify-center md:basis-1/2 min-[1100px]:basis-1/3 xl:basis-1/5 px-2"
                      >
                        <TopHospitalCard
                          {...hosp}
                          onViewMore={() => setSelectedHospital(hosp)}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : !showAbout ? (
                <HospitalDetails
                  hospital={selectedHospital}
                  onAboutClick={() => setShowAbout(true)}
                />
              ) : (
                <HospitalAbout />
              )}
            </div>
            <div className="block md:hidden ">
              <MobileHospitalFilter/>
              {!selectedHospital ? (
                <div className="px-4 py-2 grid grid-cols-2 place-items-center xs:gap-2 sm:gap-y-4 my-4 mx-auto">
                  {data.hospitals.map((hosp, i) => (
                    <div key={i}>
                      <TopHospitalCard
                        {...hosp}
                        onViewMore={() => setSelectedHospital(hosp)}
                      />
                    </div>
                  ))}
                </div>
              ) : !showAbout ? (
                <HospitalDetails
                  hospital={selectedHospital}
                  onAboutClick={() => setShowAbout(true)}
                />
              ) : (
                <HospitalAbout />
              )}
            </div>
          </>
        )}
        {activeTab === "Top Doctors" && (
          <>
            <div className="hidden md:block container mx-auto py-8">
              {selectedDoctorId ? (
                <Doctorsingleview
                  doctordata={doctorsData.find((doc) => doc.id === selectedDoctorId)}
                  specialitytype="Top Doctors"
                  selectedSpecialityTitles={[
                    doctorsData.find((doc) => doc.id === selectedDoctorId)?.specialty,
                  ]}
                />
              ) : (
                <Carousel opts={{ align: "start" }} className="w-full ">
                  <CarouselContent className="mb-4">
                    {doctorsData.map((doctor) => (
                      <CarouselItem
                        key={doctor.id}
                        className="flex justify-center md:basis-1/2 min-[1100px]:basis-1/3 xl:basis-1/5 px-2"
                      >
                        <DoctorCard
                          doctor={doctor}
                          onViewMore={() => setSelectedDoctorId(doctor.id)}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
            </div>
            <div className="block md:hidden px-4 py-2">
              {<MobileDoctorFilter /> }

              {selectedDoctorId ? (
                <Doctorsingleview
                  doctordata={doctorsData.find((doc) => doc.id === selectedDoctorId)}
                  specialitytype="Top Doctors"
                  selectedSpecialityTitles={[
                    doctorsData.find((doc) => doc.id === selectedDoctorId)?.specialty,
                  ]}
                />
              ) : (
                <div className="grid grid-cols-2 place-items-center xs:gap-2 sm:gap-y-4 my-4 mx-auto">
                  {doctorsData.map((doctor) => (
                    <div key={doctor.id}>
                      <DoctorCard
                        doctor={doctor}
                        onViewMore={() => setSelectedDoctorId(doctor.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
