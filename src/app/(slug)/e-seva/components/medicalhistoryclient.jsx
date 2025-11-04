"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Plus, Calendar, Stethoscope, FileText, Activity, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";

const MedicalHistoryPage = ({ userdata, existingHistory = [] }) => {
  const [showAddModal, setShowAddModal] = useState(false);
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
  });
  const [diseaseDetails, setDiseaseDetails] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentDisease, setCurrentDisease] = useState("");
  const [modalForm, setModalForm] = useState({
    startDate: "",
    onTreatment: false,
    notes: "",
  });
  const [consent, setConsent] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const itemsPerPage = 3;

const [tempFormValues, setTempFormValues] = useState(null);
const [tempDiseaseDetails, setTempDiseaseDetails] = useState({});

  const inheritableConditions = [
    "diabetes",
    "highBloodPressure",
    "heartAttack",
    "strokeOrTia",
    "cancer",
    "arthritis",
    "asthma",
    "multipleSclerosis",
    "parkinsonsDisease"
  ];



  useEffect(() => {
    if (userdata?.medicalhistory) {
      const history = userdata.medicalhistory;
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
      }));
      if (history.diseaseDetails) {
        setDiseaseDetails(history.diseaseDetails);
      }
    }
  }, [userdata]);

  const formatDateForDisplay = (date) => {
    if (!date) return "Not specified";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Not specified";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^./, (str) => str.toUpperCase());
  };

  const currentDisplayData = useMemo(() => {
    const data = [];
    const combinedDetails = { ...diseaseDetails };

    Object.keys(allFormValues).forEach((key) => {
      if (allFormValues[key] || combinedDetails[key]) {
        const details = combinedDetails[key] || {};
        const conditionObj = {
          name: key,
          startDate: details.startDate || null,
          onTreatment: details.onTreatment || false,
          notes: details.notes || null,
          inherited:
            details.inherited !== undefined
              ? details.inherited
              : inheritableConditions.includes(key), // fallback for inheritable conditions
        };
        data.push(conditionObj);
      }
    });

    return data;
  }, [allFormValues, diseaseDetails]);



  const totalPages = Math.ceil(currentDisplayData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDisplayData = currentDisplayData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleTempInputChange = (e) => {
  const { name, checked } = e.target;

  if (!tempFormValues) return;

  if (checked) {
    setTempFormValues((prev) => ({ ...prev, [name]: true }));
    const existing = tempDiseaseDetails[name] || {}; // use temp details
    setCurrentDisease(name);
    setShowDetailsModal(true);
    setModalForm({
      startDate: existing.startDate || "",
      onTreatment: existing.onTreatment || false,
      inherited: existing.inherited || false,
      notes: existing.notes || "",
    });
  } else {
    setTempFormValues((prev) => ({ ...prev, [name]: false }));
    setTempDiseaseDetails((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }
};



const handleModalSubmit = () => {
setTempDiseaseDetails((prev) => ({
...prev,
   [currentDisease]: {
...modalForm,
inherited: !!modalForm.inherited,
   },
 }));
 setShowDetailsModal(false);
  setCurrentDisease("");
 };


 const handleModalCancel = () => {
   if (currentDisease) {
     // If user cancels details for a newly-checked condition, uncheck it in *temp*
     setTempFormValues((prev) => ({ ...prev, [currentDisease]: !!tempDiseaseDetails[currentDisease] }));
     // and drop any unsaved temp details for that disease
     setTempDiseaseDetails((prev) => {
       const copy = { ...prev };
       // keep if it existed before opening modal and was already true in allFormValues/diseaseDetails as "committed"
       // otherwise remove (simple rule: remove on cancel)
       delete copy[currentDisease];
       return copy;
     });
   }
   setShowDetailsModal(false);
   setCurrentDisease("");
 };

const handleSubmit = async () => {
    if (!consent) {
      toast.error("Please provide consent before submitting");
      return;
    }
    setIsSaving(true);

 // Commit drafts (if dialog was opened). If not opened, just reuse current
 const committedFormValues = tempFormValues ?? allFormValues;
 const committedDiseaseDetails = tempFormValues ? tempDiseaseDetails : diseaseDetails;

 // Ensure booleans and details align: keep only diseases that are checked
 const newFormValues = { ...committedFormValues };
 const newDiseaseDetails = Object.fromEntries(
   Object.keys(committedDiseaseDetails)
     .filter((k) => newFormValues[k])
     .map((k) => [k, committedDiseaseDetails[k]])
 );

    const formData = {
      ...newFormValues,
      diseaseDetails: newDiseaseDetails,
    };

    try {
      const response = await fetch(`/api/patient/${userdata.id}/medical-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Medical history saved successfully");
     setDiseaseDetails(newDiseaseDetails);     
     setAllFormValues(newFormValues);
     setTempFormValues(null);
     setTempDiseaseDetails({});
        setShowAddModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save medical history");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving medical history");
    } finally {
      setIsSaving(false);
    }
  };

  const getConditionIcon = (conditionName) => {
    const name = conditionName.toLowerCase();
    if (
      name.includes("heart") ||
      name.includes("blood") ||
      name.includes("angina") ||
      name.includes("congestiveheartfailure") ||
      name.includes("pacemaker") ||
      name.includes("peripheralvascular")
    ) {
      return <Heart className="w-4 h-4 text-red-600" />;
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
      return <Brain className="w-4 h-4 text-purple-600" />;
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
      return <Stethoscope className="w-4 h-4 text-green-600" />;
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
      return <Activity className="w-4 h-4 text-orange-600" />;
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
      return <X className="w-4 h-4 text-gray-600" />;
    }
    if (
      name.includes("diabetes") ||
      name.includes("hypoglycemia") ||
      name.includes("thyroid") ||
      name.includes("cholesterol")
    ) {
      return <Activity className="w-4 h-4 text-yellow-600" />;
    }
    if (name.includes("skin") || name.includes("allergies")) {
      return <Activity className="w-4 h-4 text-pink-600" />;
    }
    if (name.includes("immunosuppressant") || name.includes("cancer") || name.includes("bleedingdisorders")) {
      return <Activity className="w-4 h-4 text-red-800" />;
    }
    if (name.includes("visual") || name.includes("hearing") || name.includes("ringing")) {
      return <Activity className="w-4 h-4 text-cyan-600" />;
    }
    if (name.includes("pregnancy") || name.includes("sexualdysfunction")) {
      return <Activity className="w-4 h-4 text-fuchsia-600" />;
    }
    return <Activity className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="container mx-auto font-poppins p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              Medical History
            </h2>
            <p className="text-blue-600 mt-1">Manage and view your medical conditions</p>
          </div>
          <div className="flex justify-start pb-2">
            <Button
                onClick={() => {
    setTempFormValues({ ...allFormValues });
    setTempDiseaseDetails({ ...diseaseDetails });
    setShowAddModal(true);
  }}
              className="bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Condition
            </Button>
          </div>
        </div>
        <div className="xs:p-2 sm:p-6">
          {paginatedDisplayData.length ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedDisplayData.map((condition, index) => (
                  <div
                    key={index}
                    className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 overflow-hidden flex flex-col h-[250px]"
                  >
                    {/* Condition Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center bg-blue-100 rounded-xl w-10 h-10 p-2">
                          {getConditionIcon(condition.name)}
                        </div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {formatFieldName(condition.name)}
                        </h3>
                      </div>
                    </div>

                    {/* Body with proper spacing */}
                    <div className="p-4 flex flex-col space-y-3 pb-3">
                      {/* First Row - Since and Treatment */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors min-h-[60px]">
                          <div className="flex items-center justify-center bg-green-100 rounded-xl w-8 h-8 p-1.5">
                            <Calendar className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex flex-col leading-tight">
                            <h4 className="text-xs font-medium text-gray-500">Since</h4>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {formatDateForDisplay(condition.startDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors min-h-[60px]">
                          <div className="flex items-center justify-center bg-purple-100 rounded-xl w-8 h-8 p-1.5">
                            <Stethoscope className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex flex-col leading-tight">
                            <h4 className="text-xs font-medium text-gray-500">Treatment</h4>
                            <p className="text-sm font-medium text-gray-900">
                              {condition.onTreatment ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>

{/* Second Row - Notes and Inherited */}
<div className="grid grid-cols-2 gap-3">
  {/* Notes */}
  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors min-h-[60px]">
    <div className="flex items-center justify-center bg-gray-200 rounded-xl w-8 h-8 p-1.5">
      <FileText className="w-4 h-4 text-gray-600" />
    </div>
    <div className="flex flex-col leading-tight">
      <h4 className="text-xs font-medium text-gray-500">Notes</h4>
      <p className="text-sm text-gray-700 line-clamp-2 overflow-hidden">
        {condition.notes || "NA"}
      </p>
    </div>
  </div>

  {/* Inherited */}
  {condition.inherited && inheritableConditions.includes(condition.name) && (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors min-h-[60px]">
      <div className="flex items-center justify-center bg-yellow-100 rounded-xl w-8 h-8 p-1.5">
        <Activity className="w-4 h-4 text-yellow-600" />
      </div>
      <div className="flex flex-col leading-tight">
        <h4 className="text-xs font-medium text-gray-500">Inherited</h4>
      </div>
    </div>
  )}
</div>

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
              <p className="text-gray-500">You {"don't"} have any medical conditions registered yet.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-center relative">
              <h3 className="text-xl font-semibold text-gray-900">Add New Medical Condition</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute right-6 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {Object.keys(allFormValues).map((field, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-4 bg-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <input
                        type="checkbox"
                        name={field}
                       checked={!!tempFormValues?.[field]}
                        onChange={(e) => handleTempInputChange(e)}
                        className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                      />
                      <span className="text-gray-700 font-medium">{formatFieldName(field)}</span>
                    </label>
                    {diseaseDetails[field] ? (
                      <div className="ml-9 text-xs text-green-600 bg-green-50 p-2 rounded">✓ Details added</div>
                    ) : tempDiseaseDetails?.[field] ? (
                      <div className="ml-9 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">Now Added (Do final Submit)</div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-6 mb-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 rounded mt-1"
                  />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    I hereby confirm that the medical history information provided above is accurate and complete to the
                    best of my knowledge. I understand that providing false or incomplete information may affect my
                    medical care and treatment.
                  </span>
                </label>
              </div>
              <div className="flex justify-center gap-4 rounde-xl">
                <Button onClick={() => setShowAddModal(false)} variant="outline" className="px-8 py-3 text-lg rounded-xl">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!consent || isSaving}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-8 text-lg font-bold shadow hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="loader-border animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>

              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentDisease ? `${formatFieldName(currentDisease)} Details` : "Add New Condition Details"}
              </h3>
              <button onClick={handleModalCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">When did this condition start?</label>
                <DatePicker
                  format="YYYY-MM-DD"
                  value={modalForm.startDate ? dayjs(modalForm.startDate) : null}
                  onChange={(date, dateString) =>
                    setModalForm((prev) => ({
                      ...prev,
                      startDate: dateString,
                    }))
                  }
                  placeholder="Select start date"
                  style={{ width: "100%", padding: "8px" }}
                  allowClear
                  inputReadOnly={false}
                />
              </div>
              {/* On Treatment */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalForm.onTreatment}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, onTreatment: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Currently receiving treatment</span>
                </label>
              </div>

              {/* Inherited (only for inheritable conditions) */}
              {currentDisease && inheritableConditions.includes(currentDisease) && (
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modalForm.inherited || false}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, inherited: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Is this condition inherited?</span>
                  </label>
                </div>
              )}


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes (optional)</label>
                <textarea
                  value={modalForm.notes}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional information about this condition..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button onClick={handleModalCancel} variant="outline" className="px-4 py-2 text-sm bg-transparent rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleModalSubmit} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-xl">
                {diseaseDetails[currentDisease] && isSaving ? "Update Details" : "Add Details"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryPage;