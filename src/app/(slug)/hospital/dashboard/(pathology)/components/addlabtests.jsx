"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";

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

const AddLabTests = ({ hospitalId }) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        testname: "",
        price: "",
        finalprice: "",
        discount: "",
        available: false,
        nabl:false,
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTests = pathologyTests.filter((test) =>
        test.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        newForm.finalprice = finalPrice; // Update the final price
        setForm(newForm);
      };

    const handleSubmit = async () => {
        if (!form.testname) {
            toast.error("Please select a Test Name.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/hospital/${hospitalId}/labtests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testname: form.testname,
                    price: form.price ? parseFloat(form.price) * 100 : null, // Convert to paise
                    finalprice: form.finalprice ? parseFloat(form.finalprice) * 100 : null,
                    discount: form.discount,
                    available: form.available,
                    nabl :form.nabl,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Lab test added successfully!");
                setOpen(false);
                setForm({
                    testname: "",
                    price: "",
                    finalprice: "",
                    discount: "",
                    available: false,
                    nabl :false,
                });
                setSearchTerm("");
            } else {
                toast.error(data.error || "Failed to add lab test.");
            }
        } catch (err) {
            toast.error("Server error during submission.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#5271FF] hover:bg-[#4460e6] text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                    Add Lab Test
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-2xl bg-gradient-to-br from-white to-blue-50">
                <DialogHeader className="text-center pb-4">
                    <DialogTitle className="text-3xl font-extrabold text-[#5271FF] drop-shadow-sm">
                        Add Lab Test
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <Label htmlFor="searchTest" className="text-base font-semibold text-gray-700 mb-2 block">
                            Search Test Name
                        </Label>
                        <Input
                            id="searchTest"
                            type="text"
                            placeholder="Search test name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 max-h-80 overflow-y-auto">
                        <Label className="text-base font-semibold text-gray-700 mb-2 block">Test Name *</Label>
                        <RadioGroup
                            value={form.testname}
                            onValueChange={(value) => setForm({ ...form, testname: value })}
                            className="grid grid-cols-1 gap-2"
                        >
                            {filteredTests.length ? (
                                filteredTests.map((test) => (
                                    <div
                                        key={test}
                                        className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                    >
                                        <RadioGroupItem
                                            value={test}
                                            id={`test-${test.replace(/[^a-zA-Z0-9]/g, "-")}`}
                                        />
                                        <Label
                                            htmlFor={`test-${test.replace(/[^a-zA-Z0-9]/g, "-")}`}
                                            className="cursor-pointer text-sm font-medium text-gray-800"
                                        >
                                            {test}
                                        </Label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No tests found.</p>
                            )}
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <Label htmlFor="price" className="text-base font-semibold text-gray-700 mb-2 block">
                                Price
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={form.price}
                                onChange={(e) => handlePriceOrDiscountChange("price", e.target.value)}
                                placeholder="Enter price"
                                className="mt-1"
                            />
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <Label htmlFor="finalprice" className="text-base font-semibold text-gray-700 mb-2 block">
                                Final Price
                            </Label>
                            <Input
                                id="finalprice"
                                type="number"
                                value={form.finalprice}
                                readOnly
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <Label htmlFor="discount" className="text-base font-semibold text-gray-700 mb-2 block">
                            Discount
                        </Label>
                        <Input
                            id="discount"
                            type="text"
                            value={form.discount}
                            onChange={(e) => handlePriceOrDiscountChange("discount", e.target.value)}
                            placeholder="Enter discount (e.g. 10%)"
                            className="mt-1"
                        />
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3 hover:border-[#5271FF] transition-all duration-200">
                        <Checkbox
                            id="available"
                            checked={form.available}
                            onCheckedChange={(checked) => setForm({ ...form, available: !!checked })}
                            className="h-5 w-5"
                        />
                        <Label htmlFor="available" className="text-base font-semibold text-gray-700 cursor-pointer">
                            Available
                        </Label>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-3 hover:border-[#5271FF] transition-all duration-200">
                        <Checkbox
                            id="nabl"
                            checked={form.nabl}
                            onCheckedChange={(checked) => setForm({ ...form, nabl: !!checked })}
                            className="h-5 w-5"
                        />
                        <Label htmlFor="nabl" className="text-base font-semibold text-gray-700 cursor-pointer">
                        NABL Accredited
                        </Label>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg tracking-wide"
                    >
                        {loading ? "Submitting..." : "Submit Lab Test"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddLabTests;