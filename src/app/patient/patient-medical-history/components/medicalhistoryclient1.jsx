"use client"
import { useState, useEffect, useMemo } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { X, Plus, Calendar, Stethoscope, FileText, Activity, Heart, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MedicalHistoryPage = ({ userdata, existingHistory = [] }) => {
  const [allFormValues, setAllFormValues] = useState({
    acquiredRespiratoryDistressSyndrome: false,
    allergies: false,
    headaches: false,
    angina: false,
    backInjury: false,
    anxietyOrPanicDisorders: false,
    bleedingDisorders: false,
    arthritis: false,
    bowelBladderAbnormalities: false,
    asthma: false,
    cancer: false,
    copd: false,
    dizzyOrFaintingSpells: false,
    congestiveHeartFailure: false,
    epilepsyOrSeizureDisorder: false,
    fracture: false,
    degenerativeDiscDisease: false,
    hepatitis: false,
    hernia: false,
    depression: false,
    highBloodPressure: false,
    diabetes: false,
    hypoglycemia: false,
    emphysema: false,
    immunosuppressantCondition: false,
    hearingImpairment: false,
    heartAttack: false,
    kidneyProblems: false,
    multipleSclerosis: false,
    liverGallbladderProblems: false,
    osteoporosis: false,
    metalImplants: false,
    parkinsonsDisease: false,
    nauseaVomiting: false,
    peripheralVascularDisease: false,
    pacemaker: false,
    strokeOrTia: false,
    pregnancy: false,
    upperGastrointestinalDisease: false,
    ringingInYourEars: false,
    sexualDysfunction: false,
    visualImpairment: false,
    skinAbnormalities: false,
    smoking: false,
    specialDietGuidelines: false,
    tuberculosis: false,
    thyroid: false,
    cholesterol: false,
  })
  const [diseaseDetails, setDiseaseDetails] = useState({})

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3 // Show only 3 cards per page

  useEffect(() => {
    if (userdata?.medicalhistory) {
      const history = userdata.medicalhistory
      setAllFormValues((prev) => ({
        ...prev,
        acquiredRespiratoryDistressSyndrome: history.acquiredRespiratoryDistressSyndrome ?? false,
        allergies: history.allergies ?? false,
        headaches: history.headaches ?? false,
        angina: history.angina || false,
        backInjury: history.backInjury || false,
        anxietyOrPanicDisorders: history.anxietyOrPanicDisorders || false,
        bleedingDisorders: history.bleedingDisorders || false,
        arthritis: history.arthritis || false,
        bowelBladderAbnormalities: history.bowelBladderAbnormalities || false,
        asthma: history.asthma || false,
        cancer: history.cancer || false,
        copd: history.copd || false,
        dizzyOrFaintingSpells: history.dizzyOrFaintingSpells || false,
        congestiveHeartFailure: history.congestiveHeartFailure || false,
        epilepsyOrSeizureDisorder: history.epilepsyOrSeizureDisorder || false,
        fracture: history.fracture || false,
        degenerativeDiscDisease: history.degenerativeDiscDisease || false,
        hepatitis: history.hepatitis || false,
        hernia: history.hernia || false,
        depression: history.depression || false,
        highBloodPressure: history.highBloodPressure || false,
        diabetes: history.diabetes || false,
        hypoglycemia: history.hypoglycemia || false,
        emphysema: history.emphysema || false,
        immunosuppressantCondition: history.immunosuppressantCondition || false,
        hearingImpairment: history.hearingImpairment || false,
        heartAttack: history.heartAttack || false,
        kidneyProblems: history.kidneyProblems || false,
        multipleSclerosis: history.multipleSclerosis || false,
        liverGallbladderProblems: history.liverGallbladderProblems || false,
        osteoporosis: history.osteoporosis || false,
        metalImplants: history.metalImplants || false,
        parkinsonsDisease: history.parkinsonsDisease || false,
        nauseaVomiting: history.nauseaVomiting || false,
        peripheralVascularDisease: history.peripheralVascularDisease || false,
        pacemaker: history.pacemaker || false,
        strokeOrTia: history.strokeOrTia || false,
        pregnancy: history.pregnancy || false,
        upperGastrointestinalDisease: history.upperGastrointestinalDisease || false,
        ringingInYourEars: history.ringingInYourEars || false,
        sexualDysfunction: history.sexualDysfunction || false,
        visualImpairment: history.visualImpairment || false,
        skinAbnormalities: history.skinAbnormalities || false,
        smoking: history.smoking || false,
        specialDietGuidelines: history.specialDietGuidelines || false,
        tuberculosis: history.tuberculosis || false,
        thyroid: history.thyroid || false,
        cholesterol: history.cholesterol || false,
      }))
      if (history.diseaseDetails) {
        setDiseaseDetails(history.diseaseDetails)
      }
    }
  }, [userdata])

  const formatDateForDisplay = (date) => {
    if (!date) return "Not specified"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "Not specified"
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^./, (str) => str.toUpperCase())
  }

  // Create display data with all active conditions
  const currentDisplayData = useMemo(() => {
    const data = []
    Object.keys(allFormValues).forEach((key) => {
      if (allFormValues[key]) {
        const details = diseaseDetails[key] || {}
        data.push({
          name: key,
          startDate: details.startDate || null,
          onTreatment: details.onTreatment || false,
          notes: details.notes || null,
        })
      }
    })
    return data
  }, [allFormValues, diseaseDetails])

  // Pagination logic
  const totalPages = Math.ceil(currentDisplayData.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDisplayData = currentDisplayData.slice(startIndex, endIndex)

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  const getConditionIcon = (conditionName) => {
    const name = conditionName.toLowerCase()
    if (
      name.includes("heart") ||
      name.includes("blood") ||
      name.includes("angina") ||
      name.includes("congestiveHeartFailure") ||
      name.includes("pacemaker") ||
      name.includes("peripheralvascular")
    ) {
      return <Heart className="w-4 h-4 text-red-600" />
    }
    if (
      name.includes("brain") ||
      name.includes("seizure") ||
      name.includes("stroke") ||
      name.includes("epilepsy") ||
      name.includes("parkinsons") ||
      name.includes("multiple sclerosis") ||
      name.includes("anxiety") ||
      name.includes("depression") ||
      name.includes("headaches") ||
      name.includes("dizzy")
    ) {
      return <Brain className="w-4 h-4 text-purple-600" />
    }
    if (
      name.includes("lung") ||
      name.includes("respiratory") ||
      name.includes("asthma") ||
      name.includes("copd") ||
      name.includes("emphysema") ||
      name.includes("tuberculosis") ||
      name.includes("smoking")
    ) {
      return <Stethoscope className="w-4 h-4 text-green-600" />
    }
    if (
      name.includes("kidney") ||
      name.includes("liver") ||
      name.includes("gallbladder") ||
      name.includes("hepatitis") ||
      name.includes("bowel") ||
      name.includes("gastrointestinal") ||
      name.includes("nausea") ||
      name.includes("hernia")
    ) {
      return <Activity className="w-4 h-4 text-orange-600" />
    }
    if (
      name.includes("bone") ||
      name.includes("arthritis") ||
      name.includes("fracture") ||
      name.includes("osteoporosis") ||
      name.includes("backinjury") ||
      name.includes("degenerativedisc") ||
      name.includes("metalimplants")
    ) {
      return <X className="w-4 h-4 text-gray-600" /> // Using X as a placeholder for bone/skeletal issues
    }
    if (
      name.includes("diabetes") ||
      name.includes("hypoglycemia") ||
      name.includes("thyroid") ||
      name.includes("cholesterol")
    ) {
      return <Activity className="w-4 h-4 text-yellow-600" /> // General metabolic/endocrine
    }
    if (name.includes("skin") || name.includes("allergies")) {
      return <Activity className="w-4 h-4 text-pink-600" /> // Skin/allergy
    }
    if (name.includes("immunosuppressant") || name.includes("cancer") || name.includes("bleedingdisorders")) {
      return <Activity className="w-4 h-4 text-red-800" /> // Immune/blood/cancer
    }
    if (name.includes("visual") || name.includes("hearing") || name.includes("ringing")) {
      return <Activity className="w-4 h-4 text-cyan-600" /> // Sensory
    }
    if (name.includes("pregnancy") || name.includes("sexualdysfunction")) {
      return <Activity className="w-4 h-4 text-fuchsia-600" /> // Reproductive/sexual health
    }
    return <Activity className="w-4 h-4 text-blue-600" /> // Default icon
  }

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <FileText className="w-6 h-6" />
              Medical History
            </h2>
          </div>
        </div>
        <div className="p-6">
          {paginatedDisplayData.length ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedDisplayData.map((condition, index) => (
                  <div
                    key={index}
                    className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200 overflow-hidden min-h-[220px] flex flex-col"
                  >
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center justify-center bg-blue-100 rounded-lg w-8 h-8">
                          {getConditionIcon(condition.name)}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm text-center">
                          {formatFieldName(condition.name)}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4 flex-grow flex flex-col">
                      {condition.notes ? (
                        <>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center bg-gray-200 rounded-lg w-8 h-8 mt-0.5">
                                <FileText className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Notes</h4>
                                <p className="text-sm text-gray-700">{condition.notes}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-auto">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center bg-green-100 rounded-lg w-8 h-8 mt-0.5">
                                <Calendar className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-gray-500">Since</h4>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDateForDisplay(condition.startDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center bg-purple-100 rounded-lg w-8 h-8 mt-0.5">
                                <Stethoscope className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-gray-500">Treatment</h4>
                                <p className="text-sm font-medium text-gray-900">{condition.onTreatment ? "Yes" : "No"}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 h-full items-center">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center bg-green-100 rounded-lg w-8 h-8 mt-0.5">
                              <Calendar className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500">Since</h4>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDateForDisplay(condition.startDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center bg-purple-100 rounded-lg w-8 h-8 mt-0.5">
                              <Stethoscope className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-gray-500">Treatment</h4>
                              <p className="text-sm font-medium text-gray-900">{condition.onTreatment ? "Yes" : "No"}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 px-4">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    variant="outline"
                    className="px-6 py-2 rounded-full bg-transparent"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    variant="outline"
                    className="px-6 py-2 rounded-full bg-transparent"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical conditions found</h3>
<p className="text-gray-500">{`You don't have any medical conditions registered yet.`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MedicalHistoryPage