"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

// Fixed package options for AA package dropdown (optional)
const aaPackageOptions = [
  "Basic Diabetes Checkup",
  "Total Diabetes Checkup",
  "Basic Thyroid Checkup",
  "Basic Thyroid Checkup & Lipid Profile",
  "Infertility Comprehensive Panel - Women",
  "Complete Urine Analysis",
  "Basic Full Body Health Checkup",
  "Regular Full Body Health Checkup - Men",
  "Regular Full Body Health Checkup - Women",
  "Vital Organ Screening With Vitamin D",
  "Heart Risk Profile",
  "Basic Liver & Kidney Care",
];

// Pathology Tests Array (for multi-select with search)
const pathologyTests = [
  "24 HRS URINE PROTEIN",
  "ACID PHOSPHATSE",
  "ADA",
  "AEC",
  "AFB C/S",
  "ALPHA FETO PROTEIN (AFP)",
  "ALKALINE PHOSPATASE",
  "AMMONIA",
  "AMYLASE",
  "ANA BY ELISA",
  "ANA BY IF",
  "ANTI DS DNA",
  "ANTI HCV ANTIBODIES",
  "ANTI PHOSPOLIPID ANTIBODY(APLA)",
  "ANTITHYROID ANTIBODIES(ATA,TPO)",
  "APTT",
  "ASCITIC FLUID",
  "ASO TITRE",
  "ANTI CARDIOLIPIN ANTIBODIES(IgG+M)",
  "ANTI HBe ANTIBODIES",
  "AUSTRALIA ANTIGEN (Au Ag)(HBs Ag)",
  "ACTH",
  "AFB GENE XPERT",
  "ANA BLOT ASSAY",
  "ANCA-MPO ( p- ANCA )",
  "ANCA-PR3 ( c - ANCA )",
  "ANTI MICROSOMAL ( TPO )",
  "ACE ( ANGOTENSIN CONVERTING ENZYME )",
  "ANTI THYROGLOBULIN ANTOBODY",
  "ANTI CCP",
  "AMH",
  "ACETONE",
  "ASMA - ANTI SMOOTH MUSCLE  AB",
  "ANTI SPERM ANTIBODY",
  "APOLIPOTROTEINS A1",
  "ANTI D (RH) ANTIBODY TITRE",
  "B12 VITAMIN",
  "BETA HCG",
  "B J PROTEINS - URINE",
  "BILIRUBIN T&D",
  "BLOOD C/S BACTEC METHOD",
  "BLOOD GROUP",
  "BLOOD NITROGEN LEVEL (BUN)",
  "BLOOD UREA LEVEL (BUL)",
  "BRONCHIAL FLUID",
  "BS & B P- URINE",
  "BSL - RANDOM",
  "BSL-F& PP",
  "BSL PP2 (DIPSI)",
  "BT & CT",
  "BETA-2 - GLYCOPROTEIN I IGG(PHOSPHOLIPID)",
  "BETA-2 - GLYCOPROTEIN IIGM(PHOSPHOLIPID)",
  "BNP (B TYPE NATRIURATIC PEPTIDE)",
  "BRUCELLA (IGG IGM)",
  "BICARBONATE",
  "CA 125",
  "CA 19-9",
  "CALCIUM",
  "CA 15.3",
  "CD4,CD8",
  "CD4 COUNT",
  "CD8 COUNT",
  "CALPROTECTIN",
  "CHICKEN POX VARICELLA ( HERPS IGM )",
  "CHICKEN POX VARICELLA ( HERPS IGG )",
  "COPPER",
  "C3  C4",
  "CEA",
  "CERULOPLASMIN",
  "CHLORIDE",
  "CHOLESTEROL",
  "CHOLINESTERASE (COE)",
  "CK-MB",
  "CMV IgG ANTIBODIES",
  "CMV IgM ANTIBODIES",
  "CORISTOL",
  "CPK-NAC",
  "CREATININE",
  "CRP( C REACTIVE PROTEIN)",
  "CSF ROUTINE",
  "CSF C/S  ROUTINE",
  "CALCITONIN",
  "CYTOLOGY(PAP OR FLUID)",
  "CHIKUNGUNIYA IGM ANTIBODIES",
  "C-PEPTIDE",
  "COMPLETE BLOOD COUNT",
  "D-DIMMER  (FDP)",
  "DENGUE COMBI ( NS1, IGG, IGM ) QUANTITATIVE ( FIA )",
  "DENGUE COMBI ( IGG, IGM ) QUANTITATIVE ( FIA )",
  "DENGUE IGM",
  "DENGUE IGG , IGM",
  "DHEAS",
  "DIGOXIN",
  "DIRECT COOMBS TEST",
  "DENGUE COMBI CHECK Rapid (Ag+ Ab)",
  "DOUBLE MARKER",
  "DENGUE ANTIGEN ( NS-1)",
  "E2( ESTRADIOL)",
  "ELECTROLYTE NA,K,CL",
  "ENDOSCOPIC BIOPSY",
  "ESR",
  "EPTION (PHYNETOIN)",
  "FERRITIN",
  "FLUID C/S TEST",
  "FUNGAL C/S TEST",
  "FNAC",
  "FOLIC ACID",
  "FREE T3",
  "FREE T4",
  "FREE TESETSTERON",
  "FSH",
  "FSH LH PRL",
  "FT3,FT4,TSH",
  "FREE PSA",
  "FRUCTOSAMINE",
  "FIBRINOGEN LEVEL",
  "G6PD",
  "GLYCOSYLATED -HB ( HbA1c)",
  "GRAM STAIN",
  "GROWTH HORMONE",
  "GTT ( Glucose tolerance test)",
  "GFR (ESTIMATED GLOMELULAR RATE)",
  "GAMMA G T",
  "HAEMOGLOBIN",
  "HAEMOGRAM (CBC)",
  "HAV IgM",
  "HB ELECTROPHOROSIS",
  "HBE ANTIGEN ( HbeAg)",
  "HDL CHOLESTEROL",
  "HEV IgM ANTIBODIES",
  "HIV",
  "HLA B27 (PCR)",
  "HBV DNA VIRAL LOAD",
  "HOMOCYSTEINE",
  "HISTOPATH (SMALL BIOPSY)",
  "HISTOPATH (LARGE BIOPSY)",
  "HBcAb - IGM ANTIBODIES",
  "HBcAb- Total ANTIBODIES",
  "HBeab ANTIBODIES",
  "HBeAg (Envelope Antigen)",
  "HBsAb TOTAL ANTIBODIES",
  "H PYLORI IGG",
  "H PYLORI IGM",
  "H PYLORI IGA",
  "HIV(ELISA)",
  "Hbsag ( ELISA)",
  "INDIRECT COOMBS TEST",
  "INSULIN ( F )",
  "INSULINE F & PP",
  "IONIC CALCIUM",
  "IRON & TIBC",
  "IGG LEVEL",
  "IGM LEVEL",
  "IGA LEVEL",
  "IgE LEVEL",
  "IMMUNOGLOBULIN IgG/IgM/IgA",
  "KETONES SERUM",
  "KOH MOUNT",
  "LDH",
  "LEPTOSPIRA IgM",
  "LFT ( Liver function Test )",
  "LH",
  "LIPASE",
  "LIPID PROFILE",
  "LITHIUM",
  "LEAD LEVEL",
  "LACTEATE",
  "LIPOPROTEIN (a)",
  "LKM1 ANTIBODIES",
  "LUPUS ANTICOAGULANT ( LA )",
  "MALARIAL - RAPID  TEST",
  "MOUNTAUX (TT) (Tuberculin Test)",
  "MEASLES (RUBEOLA IGG AB)",
  "MEASLES (RUBEOLA IGM AB)",
  "MUMPS IGG ANTIBODIES",
  "MUMPS IGM ANTIBODIES",
  "MAGNESIUM",
  "MICROALBUMIN LEVEL",
  "P C R (TISSUE, FLUID OR BLOOD)",
  "PAP SMEAR",
  "PBS FOR MP",
  "PCV",
  "PHOSPHORUS",
  "PLATELET COUNT",
  "PLEURAL FLUID",
  "PAUL BUNNEL TEST",
  "PSA",
  "POTASSIUM",
  "PREGANCY TEST ( UPT )",
  "PROTHROMBIN TIME",
  "PROGESTERONE",
  "PROLACTIN",
  "PROTEIN ELECTROPHORESIS",
  "PROTEINS",
  "PTH",
  "PROCALCITONIN",
  "PORPHOBILINOGEN (QUALITATIVE)",
  "PROTIN C & PROTIN S",
  "PUS C/S TEST",
  "QUADRUPLE  MARKER",
  "RA FACTOR",
  "RBC INDICES",
  "RETIC COUNT",
  "RUBELLA IgG ANTIBODIES",
  "RUBELLA IgM ANTIBODIES",
  "RENAL FUNCTION TEST - (BULCREAT,URIC,ELECTROLYTE )",
  "RAPID MALARIAL TEST",
  "SEMEN ANALYSIS",
  "SGOT",
  "SGPT",
  "SICKLING TEST",
  "SMALL BIOPSY ( HPE )",
  "SODIUM",
  "SODIUM VALPORATE",
  "SPECIMEN LARGE ( HPE )",
  "SPUTUM AFB 3 SAMPLES",
  "SPUTUM ROUTINE",
  "SPUTUM(R) C/S",
  "STOOL C/S",
  "STOOL OCCULT BLOOD",
  "STOOL ROUTINE",
  "SYNOVIAL FLUID",
  "ANTI SPERM ANTIBODY",
  "STONE ANALYSIS (KIDNEY)",
  "T3",
  "T3,T4,TSH",
  "T4",
  "TESTOSTERONE",
  "THROAT SWAB",
  "TORCH IgG&IgM",
  "TORCH IgM",
  "TRIGLYCERIDES",
  "TRIPLE TEST (Beta hcg,afp,Free-E3)",
  "TOXOPLASMA IgG ANTIBODIES",
  "TYPI IGM",
  "TOXOPLASMA IgM ANTIBODIES",
  "TROP  I",
  "TROP T (AMI)",
  "TSH",
  "TUBERCULIN TEST",
  "TRANSFERRIN LEVEL",
  "TTG - IGA (tissue Transglutaminase",
  "TB- GOLD",
  "TPO ANTIBODIES(PEROXIDASE)",
  "URIC ACID",
  "URINE C/S TEST",
  "URINE MICROALBUMIN",
  "URINE ROUTINE",
  "URINE VMA",
  "URINE ALBUMIN CREATININE RATIO",
  "URINE PROTEIN CREATININE RATIO",
  "VALPROIC ACID",
  "VDRL",
  "VITAMIN  B12",
  "VITAMIN  D3 (25 HYDROXY D)",
  "WESTERN BLOT",
  "WEIL FELIX",
  "WIDAL TEST",
  "ZN STAIN ( AFB Stain)",
  "ZINC",
];

const AddPackages = ({ hospitalId }) => {
  const [open, setOpen] = useState(false);
  const [aaPackage, setAaPackage] = useState("");
  const [form, setForm] = useState({
    labpackagename: "",
    includestest: [],
    price: "",
    discount: "",
    finalpackageprice: "",
    available: false,
    homevisit: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchIncluded, setSearchIncluded] = useState("");

  // Handle discount and price calculation for final package price
  const calculateFinalPrice = (price, discount) => {
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return "";
    if (!discount) return p;

    let discVal = 0;
    if (discount.trim().endsWith("%")) {
      discVal = parseFloat(discount.trim().slice(0, -1));
      if (isNaN(discVal)) return p;
      return Math.round(p - (p * discVal) / 100);
    } else {
      discVal = parseFloat(discount);
      if (isNaN(discVal)) return p;
      return Math.round(p - discVal);
    }
  };

  const handlePriceOrDiscountChange = (field, value) => {
    const newForm = { ...form, [field]: value };
    let finalPrice = calculateFinalPrice(newForm.price, newForm.discount);
    if (finalPrice === "") finalPrice = "";
    newForm.finalpackageprice = finalPrice;
    setForm(newForm);
  };

  const filteredTests = useMemo(() => {
    if (!searchIncluded.trim()) return pathologyTests;
    return pathologyTests.filter((test) =>
      test.toLowerCase().includes(searchIncluded.trim().toLowerCase())
    );
  }, [searchIncluded]);

  const toggleTestSelection = (testName) => {
    let included = [...form.includestest];
    if (included.includes(testName)) {
      included = included.filter((test) => test !== testName);
    } else {
      included.push(testName);
    }
    setForm({ ...form, includestest: included });
  };

  const handleSubmit = async () => {
    if (!aaPackage && !form.labpackagename.trim()) {
      toast.error("Please select or enter a package name.");
      return;
    }
    if (!form.price) {
      toast.error("Please enter the price.");
      return;
    }

    setLoading(true);

    try {
      const bodyPayload = {
        aapackagename: aaPackage || null,
        labpackagename: form.labpackagename.trim() || null,
        includestest: form.includestest.join(", ") || null,
        price: parseFloat(form.price) * 100,
        discount: form.discount.trim() || null,
        finalpackageprice: typeof form.finalpackageprice === "number" ? form.finalpackageprice * 100 : parseFloat(form.price) * 100, // Convert to paise
        available: form.available,
        homevisit: form.homevisit,
      };

      const res = await fetch(`/api/hospital/${hospitalId}/wellnesspackages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Package added successfully!");
        setOpen(false);
        setAaPackage("");
        setForm({
          labpackagename: "",
          includestest: [],
          price: "",
          discount: "",
          finalpackageprice: "",
          available: false,
          homevisit: false,
        });
        setSearchIncluded("");
      } else {
        toast.error(data.error || "Failed to add package.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during submission.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5271FF] text-white font-bold rounded-xl shadow-md transition hover:shadow-lg hover:scale-105">
          Add Package
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-gradient-to-br from-white to-blue-50">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-3xl font-extrabold text-[#5271FF] drop-shadow-sm">
            Add Wellness Package
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* AA Package Dropdown (Optional) */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <Label
              htmlFor="aapackage-select"
              className="text-gray-700 mb-2 font-semibold block"
            >
              AA Package Name (Optional)
            </Label>
            <Select
              value={aaPackage}
              onValueChange={setAaPackage}
              id="aapackage-select"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select AA Package" />
              </SelectTrigger>
              <SelectContent>
                {aaPackageOptions.map((pkg) => (
                  <SelectItem key={pkg} value={pkg}>
                    {pkg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lab Package Name */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <Label
              htmlFor="labpackagename"
              className="text-gray-700 mb-2 font-semibold block"
            >
              Lab Package Name
            </Label>
            <Input
              id="labpackagename"
              type="text"
              placeholder="Enter Lab Package Name"
              value={form.labpackagename}
              onChange={(e) =>
                setForm({ ...form, labpackagename: e.target.value })
              }
            />
          </div>

          {/* Included Test Multi-Select with Search */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <Label
              htmlFor="includetest-search"
              className="text-gray-700 mb-2 font-semibold block"
            >
              Includes Test(s)
            </Label>
            <Input
              id="includetest-search"
              type="text"
              placeholder="Search tests to include..."
              value={searchIncluded}
              onChange={(e) => setSearchIncluded(e.target.value)}
              className="mb-3"
            />
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded p-2">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => {
                  const checked = form.includestest.includes(test);
                  return (
                    <div
                      key={test}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
                      onClick={() => toggleTestSelection(test)}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className="w-4 h-4 cursor-pointer"
                        id={`test-checkbox-${test.replace(/\s+/g, "-")}`}
                      />
                      <label
                        htmlFor={`test-checkbox-${test.replace(/\s+/g, "-")}`}
                        className="select-none text-sm text-gray-700"
                      >
                        {test}
                      </label>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No tests found.</p>
              )}
            </div>
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <Label
                htmlFor="price"
                className="text-gray-700 mb-2 font-semibold block"
              >
                Price
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => handlePriceOrDiscountChange("price", e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <Label
                htmlFor="discount"
                className="text-gray-700 mb-2 font-semibold block"
              >
                Discount (e.g. 10% or 100)
              </Label>
              <Input
                id="discount"
                type="text"
                value={form.discount}
                onChange={(e) =>
                  handlePriceOrDiscountChange("discount", e.target.value)
                }
                placeholder="Enter discount"
              />
            </div>
          </div>

          {/* Final Package Price (readonly) */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <Label
              htmlFor="finalpackageprice"
              className="text-gray-700 mb-2 font-semibold block"
            >
              Final Package Price
            </Label>
            <Input
              id="finalpackageprice"
              type="number"
              min={0}
              value={form.finalpackageprice}
              readOnly
            />
          </div>

          {/* Available and Home Visit Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={form.available}
                onCheckedChange={(checked) =>
                  setForm({ ...form, available: !!checked })
                }
                className="h-5 w-5"
              />
              <Label
                htmlFor="available"
                className="cursor-pointer font-semibold text-gray-700"
              >
                Available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="homevisit"
                checked={form.homevisit}
                onCheckedChange={(checked) =>
                  setForm({ ...form, homevisit: !!checked })
                }
                className="h-5 w-5"
              />
              <Label
                htmlFor="homevisit"
                className="cursor-pointer font-semibold text-gray-700"
              >
                Home Visit
              </Label>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
          >
            {loading ? "Submitting..." : "Submit Package"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPackages;