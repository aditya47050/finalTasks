import DhanFooter from "../../components/dhan-footer";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
const stateSchemes = {
  "Assam": [
    {
        title: "Free Drug Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government +NHM, Assam",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Directorate of Medical Education, Assam- National Health Mission (DME + NHM)",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers and other disease areas",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Residents of Assam or adjoining north eastern states undergoing treatment at state government run medical colleges and district hospitals.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "No financial assistance under this scheme. All the patients undergoing treatment at state government run medical colleges and district hospitals to get those medicines free of cost which are enlisted in Essential Drug List (EDL), Assam. This facility can also be availed by patients from neighbouring states in NorthEast who are undergoing treatment at above mentioned institution types."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "No financial assistance, only free drugs."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Report regarding confirmation of cancer and blood group of the patient",
            "Voter card, driving license, passport, arms license, kisan credit card with photo, aadhar card (optional), photographs for more information available at the website",
            "Along with the confirmation report, blood group of the patient is mandatory",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "NA"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://nhm.assam.gov.in/"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "NA"
            ],
        },
        {
            heading: "Remarks",
            content: [
            "For detailed information on the scheme, click on the link below:",
            "https://nhm.gov.in/images/pdf/NHM/NHM-Guidelines/Free_Drugs_Service_Intitiative.pdf",
            ],
        },
        ],
    },
    {
        title: "Atal Amrit Abhiyan Health Insurance Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Government of Assam",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer types",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "All the BPL and APL (up to INR 5 lakh per annum income) and resident of Assam state are eligible for the insurance scheme",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The scheme provides coverage for various diseases such as cardiovascular, cancer, kidney disease, neonatal disease, burn and heart related ailments, and burn injuries."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "An insurance coverage up to INR 2 lakhs per annum per family."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Voter ID card",
            "EPIC card (In case of minors the birth certificate in original)",
            "Income certificate, other valid documents",
            "NFSA card",
            "A photograph of the patient attested by doctor",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 2 lakhs"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://atalamritabhiyan.assam.gov.in/"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "1 800 102 7480"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "Cashless care at:",
            "Empanelled network hospital anywhere in the state of Assam",
            "Empanelled hospitals in the following cities: Kolkata, Delhi (NCR region), Chennai, Bengaluru, Mumbai (only cancer treatment)",
            ],
        },
        ],
    },
    {
        title: "Assam Arogya Nidhi (AAN)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "MoHFW, Government of Assam",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "Cancer (radiation and chemotherapy)",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "BPL families with monthly income of less then INR 10,000/-.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "A financial assistance program for general and specialized treatment of life threatening diseases or injuries caused by natural calamities and man-made disasters."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Financial assistance of INR 1,50,000/-"
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Voter ID card",
            "EPIC card (In case of minors the birth certificate in original)",
            "Income certificate",
            "other valid documents",
            "NFSA card",
            "A photograph of the patient attested by doctor",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 1.5 lakhs"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://hfw.assam.gov.in/schemes/assam-arogya-nidhi-aan"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "hlahealthassam@gmail.com"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "As on date, around 822 patients have been benefited out of this scheme",
            ],
        },
        ],
    },
],
"West Bengal": [
    {
        title: "Swasthya Sathi Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Department of Health and Family Welfare, Government of West Bengal",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "All citizens of West Bengal state. Firstly, applicants should be permanent residents of West Bengal state. Secondly, for applying under this scheme, he/she should not have already registered with any other health-related scheme",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "All pre-existing diseases are covered. The entire premium is borne by the state government and no contribution from the beneficiary. Online Swathya Sathi smart card is provided to each family on the day of enrollment. Smart card captures the details of the family members, photographs, biometric, address, mobile number, and SECC ID. Management of the scheme is in paperless IT platform from day one. Online empanellment and gradation of hospitals based on the services and infrastructure are available. 100% online pre-authorization with turn around time of 24 hrs. SMS triggers and instant alerts to the beneficiaries on blocking of card. Real-time uploading of e-health record of the beneficiaries on discharge. Claim reimbursement to the hospital with TAT of 30 days else interest are being charged for delayed payment. Online grievance monitoring mechanism. Online triggers and alerts to detect probable frauds with escalation matrix."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Basic health cover for secondary and tertiary care up to INR 5 lakhs per annum per family."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Swasthya Sathi Smart Card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 5 lakhs per annum per family. There is no cap on the family size and parents of both the spouses are included. All dependent physically challenged persons in the family are also covered."
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://swasthyasathi.gov.in/AboutScheme"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "https://swasthyasathi.gov.in/OurTeam"
            ],
        },
        {
            heading: "Remarks",
            content: [
            "The scheme is operated online through the smart card number. Beneficiary will have to install the app to avail its services.",
            ],
        },
        ],
    },
    {
        title: "West Bengal Health Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government - State",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Department of Health and Family Welfare, Government of West Bengal",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "West Bengal government sector employees, superannuated employees, family pensioners of Govt. of WB, and central government employees. Click here to download the scheme details:",
            "https://wbhealthscheme.gov.in/Home/wbhs_about_scheme.aspx",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "In addition to the West Bengal Services (Medical Attendance) Rules 1964, with a view to providing better medical facilities to the employees of government of West Bengal, West Bengal Health Scheme, 2008 was introduced. Since 2008 it was known as West Bengal Health Scheme. Since 2014 it is renamed as West Bengal Health for All Employees and Pensioners Cashless Medical Treatment Scheme, 2014. Cost of OPD treatment relating to the indoor treatment incurred during the period of thirty days prior to admission as well as during the period of thirty days after discharge is available for reimbursement. OPD treatment cost is reimbursable in case of certain specified diseases provided treatment done in recognized hospitals. Follow-up medical treatment cost is reimbursable in case of certain specified disease provided treatment done in recognized hospitals. 60% (80% where number of bed is more than 80) of approved cost or actual amount paid whichever is less is reimbursable when treatment is done in non-empanelled hospitals within the state. Cost of certain investigations are reimbursable on the basis of OPD prescriptions of doctors consulted in a recognized hospitals in case of any disease, provided the investigations are done in empanelled hospital/diagnostic centre. Actual cost of treatment, including cost of journey with one attendant, is reimbursable provided treatment is done in certain specified specialty hospitals outside the state."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Cashless indoor treatment facilities up to INR 1 lakh, provided treatment is done in private empanelled hospitals. Reimbursement of indoor treatment cost beyond INR 1 lakh is also available, subject to submission of claim to DDO/PSA."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Service ID card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Cashless indoor treatment facilities up to INR 1 lakh, provided treatment is done in private empanelled hospitals. Reimbursement of indoor treatment cost beyond INR 1 lakh is also available, subject to submission of claim to DDO/PSA."
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://wbhealthscheme.gov.in/First_page.aspx"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "https://wbhealthscheme.gov.in/Home/wbhs_contact_us_new.aspx"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "This scheme is only for the state government employees.",
            ],
        },
        ],
    },
    {
        title: "Health Minister's Cancer Patient Fund (HMCPF) of Rashtriya Arogya Nidhi (RAN)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Central Government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Ministry of H&FW, Government of India",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "The fund will provide financial assistance to patients who is living below poverty line and is suffering from cancer",
            "Assistance is admissible for treatment in 27 Regional Cancer Centre(s) (RCC) only",
            "Central govt./state govt. /PSU employees are not eligible for financial assistance from HMCPF",
            "Grant from HMCPF would not be used where treatment/facilities for cancer treatment are available free of cost",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The “Health Minister's Cancer Patient Fund (HMCPF) within the Rashtriya Arogya Nidhi (RAN)” has also been set up in 2009. In order to utilize the Health Minister's Cancer Patient Fund, the revolving fund as under RAN, has been established in 27 Regional Cancer Centres (RCCs). Such step would ensure and speed up financial assistance to needy patients and help fulfil the objective of HMCPF under RAN. The financial assistance to a cancer patient of up to INR 2,00,000/- (INR Two lakh only) would be processed by the concerned RCC, on whose disposal the revolving fund has been placed. Individual cases, which require assistance of more than INR 2 lakhs is to be sent to the ministry for processing. Revolving funds have been created in all the 27 Regional Cancer Centres (RCCs) and funds upto INR 50 lakhs will be placed at their disposal. The revolving funds will be replenished on fulfilment of conditions regarding submission of utilization certificate and list of beneficiaries.",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "INR 2 lakhs per treatment cycle"
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Citizenship documents, income certificate or declaration, etc.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 2 lakhs per treatment cycle"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://main.mohfw.gov.in/sites/default/files/2563214569875214.pdf"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "Chittaranjan National Cancer Institute, Kolkata",
            "37,S.P.Mukherjee Road,Kolkata-700 026.INDIA",
            "Tel : (Off.)2475-9313/2475-8057",
            "(EPABX) : 2476-5101,5102,5104",
            "Fax : 91-33-2475-7606",
            "cncinstkol@gmail.com",
            ],
        },
        ],
    },
    {
        title: "Health Minister's Discretionary Grant (HMDG)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Central Government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Ministry of H&FW, Government of India",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Only those who have an annual family income up to INR 1,25,000 and below are eligible for financial assistance from Health Minister's Discretionary Grant (HMDG).",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Financial assistance towards treatment in government hospitals, including super specialty government hospitals/institutes, as per guidelines."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "INR 75,000/- if the estimated cost of treatment is up to INR 1,25,000/-",
            "INR 1,00,000/- if the estimated cost of treatment is above INR 1,25,000/- up to INR 1,75,000/-",
            "INR 1,25,000/- if the estimated cost of treatment is above INR 1,75,000/-",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Application form in prescribed proforma duly signed by the treating doctor and countersigned by the medical superintendent of the government hospital/institute",
            "Copy of the income certificate",
            "Copy of the ration card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 75,000/- if the estimated cost of treatment is up to INR 1,25,000/-",
            "INR 1,00,000/- if the estimated cost of treatment is above INR 1,25,000/- up to INR 1,75,000/-",
            "INR 1,25,000/- if the estimated cost of treatment is above INR 1,75,000/-",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://main.mohfw.gov.in/major-programmes/poor-patients-financial-assistance/health-ministers-discretionary-grant-hmdg"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "Application form:",
                "https://main.mohfw.gov.in/sites/default/files/4451946500hmdgappl_1_1_0.pdf"
            ],
        },
        ],
    },
    {
        title: "The Central Government Health Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Central Government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Ministry of H&FW, Government of India",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Applicable for retired central government employees and dependents as well as pensioners, freedom fighters and other specific groups of people. It offers coverage for cancer treatment at approved rates from any hospital, apart from the hospitals set up under CGHS.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Inpatient treatment for all enrolled members at government and empanelled facilities. Cashless treatment at empanelled hospitals and diagnostic centers. Medical investigations conducted at government or empanelled diagnostic centers. Specialist consultations at polyclinic or government hospitals. Outpatient treatment (OPD), including expenses for medications. Reimbursement for emergency medical treatments undertaken at government or private hospitals. Expenses related to maternity, child health services, and family welfare. Expenses incurred for external medical accessories, such as hearing aids, appliances, artificial limbs, etc. Alternative treatment procedures such as ayurveda, homeopathy, siddha, and unani."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "NA"
            ],
        },
        {
            heading: "Documents required",
            content: [
            "CGHS health insurance card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "As per 7th CPC, the contribution per month based on the level include:",
            "Level 1-5 : INR 250/-",
            "Level 6 : INR 450/-",
            "Level 7-11 : INR 650/-",
            "Level 12 and above : INR 1000/-",
            ],
        },
        {
            heading: "Website link",
            content: [
            "http://cghskolkata.nic.in/",
            "https://cghs.gov.in/CghsGovIn/faces/ViewPage.xhtml",
            ],
        },
        {
            heading: "Contact details",
            content: [
            "http://cghskolkata.nic.in/contact_us.html"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "For more details, check out this link",
                "http://cghskolkata.nic.in/pdf/Frequently%20Asked%20Questions%20about%20CGHS13.pdf",
            ],
        },
        ],
    },
    {
        title: "National Health Protection Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Central Government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Ministry of H&FW, Government of India",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Families who are found to belong to the criteria used as proxies for deprivation as per the Socio Economic and Caste Census (SECC).",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The components of the National Health Protection Scheme (NHPS) provides coverage for hospitalization expenses and transportation charges. India's NHPS all assess poverty through multidimensional poverty measures (MPM) that formally target the household level."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Provides coverage up to INR 5 lakhs per family per year for secondary and tertiary care hospitalization."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Biomatric NHP card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "NA"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://www.india.gov.in/spotlight/ayushman-bharat-national-health-protection-mission"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "NA"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "NA",
            ],
        },
        ],
    },
    {
        title: "Prime Minister's National Relief Fund",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Ministry of H&FW, Government of India",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Ministry of H&FW, Government of India",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "The PMNRF provides financial assistance to indigent patients for treatment of major diseases at government/PMNRF empanelled hospitals to partially defray the expenses.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "It provides partial coverage for heart surgeries, kidney transplantation, cancer treatment, and more such treatments."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "The disbursement out of the fund is made at the discretion of the Prime Minister and in accordance with the Prime Minister's directions."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Two passport size photographs of patient (one pasted on application, another stapled with application), copy of residence proof, original medical certificate mentioning the type of disease, estimated cost of expenditure, and copy of his income certificate.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "NA"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://pmnrf.gov.in/en/"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "011-2301-3683",
            "https://pmnrf.gov.in/en/contact-us",
            ],
        },
        {
            heading: "Remarks",
            content: [
                "List of empanelled hospitals:",
                "https://pmnrf.gov.in/en/about/private-hospital-lists"
            ],
        },
        ],
    },
    {
        title: "Chief Minister's Relief Fund",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government - State",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Chief Minister's Office, Government of WB",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Permanent residents of the State of West Bengal",
            "Distressed patients who have undergone treatment in the govt./non govt. hospitals/institutions and also are unable to bear the cost of treatment",
            "Patients who are not eligible to get benefit of Employees State Insurance Scheme/any other insurance scheme or get reimbursement from employer/organization",
            "Patients whose annual family income does not exceed INR 1,20,000/-",
            "Patients can avail the assistance only once for the same case in a financial year",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Applications for sanction of financial assistance from Chief Minister's Relief Fund are processed and examined by the CMRF Cell of Chief Minister's Office."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Health problems which require expensive Medicare."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "All papers relating to the probable or actual expenditure for the treatment, including quotation, the tentative date of operation certificate from the concerned authority, if patient is admitted. The expenditure incurred prior to the date of receipt of application in CMO is not admissible",
            "Monthly family income certificate from any one mentioned within the bracket (DM/SDO/BDO/Jt. B.D.O./Executive officer in case of municipality/Deputy Commissioner of Corporation) on his official letterhead",
            "Certificate regarding availability/non-availability of financial assistance/reimbursement from the employer. Pay certificate from the employer showing medical allowance",
            "Recommendation from an elected people's representative (MP/MLA) to the Hon'ble Chief Minister, Govt. of West Bengal",
            "In case of kidney transplantation, one is required to submit no objection certificate (in case of non-blood related donor) from Health & Family Welfare Department, Govt. of West Bengal, Salt Lake, Kolkata or an affidavit (in case of blood related donor) from the First Class Judicial Magistrate (Original/attested)",
            "Contact details with the mobile number",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "NA"
            ],
        },
        {
            heading: "Website link",
            content: [
            "http://wbcmo.gov.in/default.aspx"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "cm@wb.gov.in",
            "(033) 2253 5278",
            ],
        },
        {
            heading: "Remarks",
            content: [
                "NA",
            ],
        },
        ],
    },

],
"Goa": [
    {
        title: "Goa Mediclaim Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Directorate of health services, Government of Goa",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "CAPD Dialysis",
            "Plastic surgery,",
            "ICU, NICU, PICU, Trauma Care",
            "CABG/PTCA(Angiography & Angioplasty),",
            "Open Heart Surgery (Valve replacement, MVR, VSD, ASD),",
            "Kidney Transplantation",
            "Neuro Surgery",
            "Radio therapy/Chemotherapy(Cancer)",
            "Cochlear implant",
            "Spastic child",
            "Cerebral palsy, skeletal deformities",
            "Bone Marrow Transplant"
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Person should be permanent residents of Goa for last 15 years and figuring in the voters list and holding permanent ration card",
            "Family income should be less than 1.5 lakhs per annum",
            "Facilities not available in the government hospital, including Goa Medical College, Bambolim, and district hospitals",
            "Hospital should be recognized under Mediclaim Scheme",
            "Retired state government employees shall also be entitled for the scheme.They are exempted from monetary income ceiling",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Provide financial assistance under Mediclaim Scheme to every permanent resident residing in Goa for last 15 years for availing super speciality treatments that is not available in the government hospitals in the State of Goa."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "https://www.goa.gov.in/wp-content/uploads/2020/02/Goa-Mediclaim-Scheme.pdf"
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Medical certificate from treating doctor either from",
            "Goa Medical College, Bambolim",
            "OR",
            "Hospicio Hospital, Margao",
            "OR",
            "Asilo Hospital, Mapusa",
            "Income certificate in prescribed Form 'B' from the concerned Mamlatdar in original or certified copy of the P.P.O. retired state government employee (15 years residence certificate)",
            "Mediclaim certificate from Medical Superintendent, Goa Medical College, Bambolim, along with photo copy",
            "Affix passport size recent photograph of the patient on Form 'C' or Form 'D' alongwith declaration form",
            "Photocopy of the election card/ration card of the patient. If the patient is minor, photocopy of the election card of either of the parents, DDSSY, and aadhaar card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "The amount of Mediclaim facility is up to INR 3.00 lakhs in case of Open Heart Surgery; Kidney transplants, Nuero Surgery including medicines for post operative care.",
            "Maximum limit for Cancer is up to INR 5.00 lakhs",
            "Maximum limit for Bone Marrow transplant disease is INR 8.00 lakhs",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://dhsgoa.gov.in/"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "https://dhsgoa.gov.in/contact-us/"
            ],
        },
        ],
    },
],
"Haryana": [
    {
        title: "Mukhymantri Muft Ilaaj Yojana (MMIY)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government-State",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Director General Health Services , Government of Haryana",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All diseases as per the list",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Residents of Haryana state",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "As per prescribed list of treatments and ratelist only"
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Surgeries under surgery package program (For Haryana residents only)",
            "Free basic laboratory investigations along with free X-Ray, ECG, and USG (wherever available in the govt. health institutions).",
            "Free indoor services",
            "Free OPD services",
            "Free drug supply",
            "Free referral transport/ambulance services",
            "Free dental treatment",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Haryana residence proof",
            ],
        },
        {
            heading: "Website link",
            content: [
            "http://haryanahealth.nic.in/Documents/MMIY_30122013.pdf"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "NA"
            ],
        },
        ],
    },
    {
        title: "Dr. Ambedkar Medical Aid Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government-Central",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Welfare of Scheduled Caste and Backward Class Department",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All types of life threatening diseases",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "The applicant shall belong to Scheduled Caste and Scheduled Tribe community",
            "Annual family income shall not exceed INR 1 lakh per annum",
            "Those who are suffering from major ailments which need surgery, such as kidney, heart, liver, cancer, brain, or any other life threatening disease, including knee surgery and spinal surgery",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The scheme will be implemented through the empalled hospitals, the list of which be found here:",
            "http://ambedkarfoundation.nic.in/assets/schemes/Medical%20Aid%20scheme.pdf",
            "100% of the estimated cost of the treatment will be directly released to the concerned Hospital. With a maximum ceiling limit as indicated in the following in each case, in the through NEFT / RTGS:-",
            "Heart Surgery: INR 1.25 lakhs",
            "Kidney Surgery / Dialysis: INR 3.50 lakhs",
            "Cancer Surgery / Chemotherapy / Radiotherapy: INR 1.75 lakhs",
            "Brain Surgery: INR 1.50 lakhs",
            "Kidney / Organ Transplant: INR 3.50 lakhs",
            "Spinal Surgery: INR 1.00 lakh",
            "Other life threatening disease: INR 1.00 lakh",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "75% of the estimated cost of the treatment will be directly released to the concerned Hospital, with a maximum ceiling limit of INR 1 lakh in each case, in the form of a crossed cheque / DD",
            "The 50% of the total admissible medical aid will be paid, in advance, directly to the Hospital before surgery as first installment",
            "The remaining 50% amount will be released to the concerned Hospital after the surgery, on submission of the final bills duly certified by the Medical Superintendent of the said Hospital",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Original estimated cost certificate duly signed by the medical superintendent of the concerned hospital",
            "Original or attested photocopies of the income certificate, caste certificate, and the ration card of the patient",
            "The application should be recommended and forwarded either by a local sitting Member of Parliament (Lok Sabha or Rajya Sabha) or by the district magistrate and collectors/deputy commissioner of the concerned district or the secretary in-charge of health and social welfare departments of state/UT",
            "Medical aid from the foundation and other sources should not exceed the total estimated cost of the treatment. A certificate in this regard should be obtained from the Medical Superintendent of the concerned Hospital",
            "The estimated cost certificate, accompanied with the application, should contain the date fixed for the surgical operation as far as possible",
            "An attested photograph of the patient should be affixed on the application form",
            ],
        },
        {
            heading: "Website link",
            content: [
            "http://haryanascbc.gov.in/dr-ambedkar-medical-aid-scheme-revised-2009"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "0172-2564006 , 2567009"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "To asess the Application form click on the following link:",
            "http://haryanascbc.gov.in/sites/default/files/documents/application_form_for_medical_aid.pdf",
            ],
        },
        ],
    },
],
"Himachal Pradesh": [
    {
        title: "Ayushman Bharat-Pradhan Mantri Jan Arogya Yojana",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Himachal Pradesh Swasthya Bima Yojna Society, Department of Health & Family Welfare, Govt of HP",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "All AB-NHPM beneficiary family units, Socio-Economic Caste Census (SECC) HP",
            "Existing RSBY beneficiary families workers, street vendors, building and workers, auto rickshaw and taxi drivers, contract employees and >70% disabled",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Providing cashless treatment upto INR 5.00 lakh per year per family for secondary and tertiary care hospitalization",
            "As per database, 478985 families are eligible to prepare card under Ayushman Bharat in Himachal Pradesh. Under this scheme all the members of a family are covered.",
            "A beneficiary covered under the scheme is allowed to take cashless benefits from any public/private empanelled hospitals across the country",
            "https://www.hpsbys.in/Application/uploadDocuments/content/Guidelines_Booklet_dated_26.10.2018_2.pdf",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Cashless treatment with coverage up to INR 5.00 lakhs per year per family."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Aadhar card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 5.00 lakhs per year per family"
            ],
        },
        {
            heading: "Website link",
            content: [
            "Beneficiaries would have to reach to the nearest government hospital for identification under beneficiary identification software of AB-PMJAY and would be issued an e-card."
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "Technical Support- 9312046444",
            "Card Approvals-9312046444",
            "Pre-Auth and Claims- 9311407574"
            ],
        },
        ],
    },
    {
        title: "Himachal Health Care Scheme-HIMCARE",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Himachal Pradesh Swasthya Bima Yojna Society, Department of Health & Family Welfare, Govt of HP",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Category 1",
            "BPL (Not covered under Ayushman Bharat)",
            "Registered street vendors (Not covered under Ayushman Bharat)",
            "MNREGA workers who have worked minimum 50 days under MNREGA during previous financial year or current financial year.",
            "Sr. Citizens above 70 years of age",
            "Children living in Orphanages",
            "Category 2",
            "Ekal Naaris",
            "Disabled >40%",
            "Anganwari workers",
            "Anganwari helpers",
            "ASHA workers",
            "Mid-day meal workers",
            "Daily wage workers (govt., autonomous bodies, societies, boards & corporations, etc. under the control of state government)",
            "Part-time workers (govt., autonomous bodies, societies, boards & corporations, etc. under the control of state government)",
            "Contractual employees (govt., autonomous bodies, societies, boards & corporations, etc. under the control of state government)",
            "Outsource employees",
            "Category 3",
            "Beneficiaries not covered under category-I and category-II or who are not govt. servants/pensioners or their dependent family members.",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Cashless treatment with coverage up to INR 5.00 lakhs per year per family on family floater basis. In case of more than five members, remaining members enrolled as a separate unit subject to the capping of five members for each such additional unit."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "The beneficiary can apply through online system directly by visiting",
            "https://www.hpsbys.in/",
            "or through Lok Mitra Kendra/Common Service Centers for enrollment and uploading relevant documents under the scheme. The LMK/CSC will collect INR 50/- per family up to unit of five for enrollment/preparation of e-card under this vibrant scheme. Himcare documents required are:",
            "Aadhar card",
            "Permanent residence proof",
            "BPL certificate copy authorized by the Panchayat Sachiv officer",
            "Proof for registered vendor",
            "Registered form signed by MC/NP/NAC",
            "For MNREGA workers, MANREGA job card",
            "Proof for widow/divorcee/unmarried/single women",
            "Document proof for handicapped applicants",
            "For old age people, age proof should be mandatory",
            "Certificate proof for anganwadi workers",
            "Document proof of ASHA workers",
            "Certification is required in which category you have applied",
            "Passport size photo",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "This scheme is being implemented on co-payment basis. Under this scheme, differential premium rates have been decided based on the categories as follows:",
            "Category 1: Zero premium amount",
            "Category 2: INR 365/- per year",
            "Category 3: INR 1000/- per year",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://www.hpsbys.in/content/mmmn"
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "8091773886 (avaliable on all working days from 10 AM 1:30 PM and 2:30 PM to 5 PM)",
            "technicalquerieshpsbys@gmail.com",
            ],
        },
        {
            heading: "Remarks",
            content: [
                "Cashless care at:",
            "Empanelled network hospital anywhere in the state of Assam",
            "Empanelled hospitals in the following cities: Kolkata, Delhi (NCR region), Chennai, Bengaluru, Mumbai (only cancer treatment)",
            ],
        },
        ],
    },
    {
        title: "Assam Arogya Nidhi (AAN)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "MoHFW, Government of Assam",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "Cancer (radiation and chemotherapy)",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "BPL families with monthly income of less then INR 10,000/-.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "A financial assistance program for general and specialized treatment of life threatening diseases or injuries caused by natural calamities and man-made disasters."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Financial assistance of INR 1,50,000/-"
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Voter ID card",
            "EPIC card (In case of minors the birth certificate in original)",
            "Income certificate",
            "other valid documents",
            "NFSA card",
            "A photograph of the patient attested by doctor",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 1.5 lakhs"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://hfw.assam.gov.in/schemes/assam-arogya-nidhi-aan"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "hlahealthassam@gmail.com"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "As on date, around 822 patients have been benefited out of this scheme",
            ],
        },
        ],
    },
],
 "Madhya Pradesh": [
    {
        title: "Sardar Vallabhbhai Patel Nishulk Aushadhi Vitran Yojana",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government-State",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Department of Health Services and Department of Medical Education",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All diseases are covered under the scheme",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "The person should have the domicile of Madhya Pradesh.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The scheme was started in 2012 in 1595 health centres across the state. As per the scheme, free medicines are distributed to people. The Health Department looks after proper implementation of the scheme in all district hospitals, civil hospitals, community centres, and primary health centres. In the case of unavailability of medicines or drugs, the hospital management has to purchase them and provide it free of cost to people. Under the scheme, a record of prescriptions by medical practitioners will be maintained and auditing will be done. Monitoring is done through computers and distribution centres are also accorded with ranks."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "The main objective of the scheme was to guarantee the availability of minimum essential drugs free of cost to all patients across all the 10,640 public health facilities of the state."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Enrollment in hospital with a proof of identity",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Limit less"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://mpaushadhi.mp.gov.in/IMCS/hissso/loginLogin.imcs",
            "http://www.nhmmp.gov.in/WebContent/MPTast/Abstracts_PPT_Posters_presented_in_conferences/The_Free_Drug_For_All_and_Free_Diagnostics_For_All_Scheme_an_i.pdf",
            ],
        },
        {
            heading: "Contact details",
            content: [
            "0755-2578911,4045264",
            "email: mpaushadhi@gmail.com",
            ],
        },
        {
            heading: "Remarks",
            content: [
            "47 formulations of Anti cancer drugs have been rate contracted to be available free in the Government Hospitals",
            ],
        },
        ],
    },
    {
        title: "State Illness Assistance Fund",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government-State",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Department of Health Services",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "20 major diseases requiring surgery and treatment and all types of cancers",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "The person should have the domicile of Madhya Pradesh and should belong to Below Poverty Line.",
            "The disease should be from the 20 listed diseases.",
            "The grant will be permissible for the recognized hospitals within the state and outside the state.",
            "For cancer cases the grant will be given for the JLN Cancer Hospital, Bhopal.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The applicant has to give application in prescribed from to the District Collector in the name of Director Public Health & FW.",
            "The Collector/Sub Divisional Magistrate will give certificate of Below Poverty Line and residential certificate and forward it to civil surgeon for certification of the disease.",
            "The estimate of the recognized institution (economy class) shall be attached for giving the grant.",
            "The application is forwarded to the secretary of State Illness Assistance Fund.",
            "The application is scrutinized and if found complete and fit within the ambit of SIAF, then the application is examined by a sub committee.",
            "The management constituted under the chairmanship of Honorable Minister, Public Health and Family Welfare gives the final sanction for the case.",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "From INR 25,000/- to maximum INR 2,00,000/- The SIF assistance amount cheque is provided directly to the hospital/institution where the approved case (patient) is referred."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "There is a standard form available at the following places:",
            "Office of the District Collector",
            "Office of District Chief Medical and Health Officer",
            "Office of the District Civil Surgeon District hospital",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "From INR 25,000/- to maximum INR 2,00,000/- The SIF assistance amount cheque is provided directly to the hospital/institution where the approved case (patient) is referred."
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://health.mp.gov.in/en/state-illness-assistance-fund"
            ],
        },
        {
            heading: "Contact details",
            content: [
            "https://health.mp.gov.in/en/contact-us"
            ],
        },
        {
            heading: "Remarks",
            content: [
                "Free Medical Assistance to the Domicile of Madhya Pradesh will be provided only once, to one member of a family living below poverty line",
            ],
        },
        ],
    },
    {
        title: "National Health Protection scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government-Center",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Department of Health Services",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All diseases are covered under the scheme",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Families who are found to belong to the criteria used as proxies for deprivation as per the Socio Economic and Caste Census (SECC).",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The components of the National Health Protection Scheme (NHPS) provides coverage for hospitalization expenses and transportation charges. India's NHPS all assess poverty through Multidimensional Poverty Measures (MPM) that formally target the household level."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Provides coverage up to INR 5 lakh per family per year for secondary and tertiary care hospitalization."
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Biometric NHP Card",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Upto INR 5 lakh per family per year for secondary and tertiary care hospitalization."
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://www.india.gov.in/spotlight/ayushman-bharat-national-health-protection-mission"
            ],
        },
        ],
    },
],
"Maharashtra": [
    {
        title: "Mahatma Jyotiba Phule Jeevandayeeni Yojana (also known as Mahatma Jyotirao Phule Jan Arogya Yojana)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government of Maharashtra",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "Medical and surgical oncology",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Beneficiaries are divided into 3 categories:",
            "Category A) Orange/Yellow/Annapurna/Antyodaya Anna Yojana (AAY) ration card holders issued by Civil Supplies Department, Government of Maharashtra for 36 districts of Maharashtra",
            "Category B) Farmers with white ration card & from 14 agriculturally distressed districts of Maharashtra (Aurangabad, Jalna, Beed, Parbhani, Hingoli, Latur, Nanded, Osmanabad, Amravati, Akola, Buldhana, Washim, Yavatmal, and Wardha)",
            "Category C)",
            "Children of government orphanages, students of government ashram shala, female inmates of government mahila ashram and senior citizens of government old age homes",
            "Journalists and their dependent family members approved by DGIPR",
            "Construction workers and their families who have live registration with Maharashtra Buildings and other Construction Worker's Welfare Board",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "A flagship health insurance scheme of Government of Maharashtra that provides end to end cashless services for identified diseases through a network of service providers from government and private sectors."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "The scheme provides coverage for meeting all expenses relating to hospitalization of beneficiary up to INR 1.5 lakhs per family per policy year. For renal transplant this limit has been enhanced up to INR 2.5 lakhs per family per policy year.",
            "The benefit is available to each and every member of the family on floater basis i.e. the total coverage of INR 1.5 lakhs or INR 2.5 lakhs as the case may be, can be availed by one individual or collectively by all members of the family in a policy year.",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Aadhaar card/aadhaar registration slip with photo of the beneficiary. Aadhaar card would be insisted upon as identification document and in absence of aadhaar card/number; any document which is accepted for issuance of aadhaar card will also be accepted.",
            "Pan card",
            "Voter ID",
            "Driving license",
            "School/College ID",
            "Passport",
            "Freedom fighter ID card",
            "Health card of RGJAY/MJPJAY",
            "Handicap certificate",
            "Nationalized bank passbook with photo",
            "Senior citizen card issued by the central or state government",
            "Defense ex-servicemen card issued by Sainik Board",
            "Marine fishery identity card (Issued by Ministry of Agriculture/Fisheries Department, Government of Maharashtra)",
            "Any photo ID proof issued by Government of Maharashtra/Government of India",
            "For the list of valid proof Id's, click on the link below:",
            "https://www.jeevandayee.gov.in/MJPJAY/RGJAYDocuments/IDPROOFLIST.pdf",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Upto INR 1.5 lakhs annual coverage (family floater)",
            "Upto INR 2.5 lakhs annual coverage for renal transplant (family floater)",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://www.jeevandayee.gov.in/MJPJAY/FrontServlet?requestType=CommonRH&actionVal=RightFrame&page=undefined%3E%3E%3Cb%3EMJPJAY%3C/b%3E&pageName=MJPJAY&mainMenu=About&subMenu=MJPJAY",
            ],
        },
        {
            heading: "Remarks",
            content: [
            "Total of 987 hospitals offering 972 procedures and 121 follow up packages with 30 special categories (including Medical and Surgical Oncology)are empanelled under this scheme.",
            "For the list of procedures or invetigations including 50 plus medical oncology and around 118 surgical oncology, click on the link below:",
            "https://www.jeevandayee.gov.in/MJPJAY/RGJAYDocuments/All%20Mandetory%20investigation%20list-1212.pdf",
            ],
        },
        {
            heading: "Contact details",
            content: [
            "155 388",
            "1800 233 22 00",
            ],
        },
        ],
    },
],
"Tamil Nadu": [
    {
        title: "Chief Minister's Comprehensive Health Insurance Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government - State",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Tamil Nadu Health Systems Project (TNHSP) and Chief Minister’s Comprehensive Health Insurance Scheme Project Office",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers and 3 modalities of treatment- radiatiotherapy, surgical oncology, and medical oncology",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Resident of Tamil Nadu with his/her name in the family card and annual income less than INR 1.2 lakh per annum.",
            "Srilankan refugees in the camps (without any income limit).",
            "Migrants from other states residing in the state for more than six months.",
            "Orphans residing in any registered/unregistered organization.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The Scheme provides financial coverage for certain diagnostic, treatments and followup procedures that require hospitalization and are associated with high cost of care.",
            "To be eligible, produce family card and Income certificate by the VAO/Revenue authorities along with the self declaration of the head of the concerned family."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "The scheme provides coverage up to INR 5 lakhs per family per year on a floater basis for the ailments and procedures covered under the scheme.",
            "Surgical oncology- 133 procedures",
            "Medical oncology- 750 procedures",
            "Radiation oncology- 23 procedures",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "For BPL Tamil Nadu resident- Family card and income certificate by the VAO/revenue authorities along with the self declaration of the head of the concerned family.",
            "For migrants- Identification from suitable aurthority regarding residence for more than 6 months in state and endorsement from labor department.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Max of INR 5 lakhs per family per annum",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://www.cmchistn.com/index.php",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "1800 425 3993 (Toll Free)",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "tnhealthinsurance@gmail.com",
            "cmchis@uiic.co.in",
            ],
        },
        
        ],
    },
    {
        title: "Health Minister's Cancer Patient Fund (HMCPF) under Rashtriya Arogya Nidhi (RAN)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Goverment- State + Centre",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "State and Central Government",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer types and 3 modalities of treatment, bone marrow transplantation, and PET Scan",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Patients from poor families (not belonging to Central govt./state govt./PSU employees, PMJAY beneficiary), who are suffering from cancer.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "For treatment of cancer at 27 RCCs only and not applicable for treatment/facilities which are available free of cost."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "One time financial assistance of up to INR 5 lakhs in emergency cases",
            "Individual cases, which require assistance of more than INR 5 lakhs or cases where funds are not available with RCC will be sent to the ministry for processing.",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Income certificate of the patient/parents/other major eaming members of the family, indicating income from all sources, duly certified by the Block or Mandal Development Officer/Tehsildar/SDM/Administrator/Special Officer of Municipal Boards/District Officer.",
            "A copy of the entire ration card along with its cover page, with details of all the family members, issued by thc Food and Civil Supplies Department of the StateAIT Govemment duly self attested.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Maximum of INR 15 lakhs",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://main.mohfw.gov.in/sites/default/files/RAN_Guideline_2019.pdf",
            "https://main.mohfw.gov.in/sites/default/files/2563214569875214.pdf",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "23061986",
            "23061731",
            ],
        },
        ],
    },
    {
        title: "Health Insurance Scheme for Pensioners (including spouse)/Family Pensioners (2014) (replaced the Tamil Nadu Government Pensioners' Health Fund Scheme, 1995)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government - State",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Finance (Pension) Department",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers and 3 modalities of treatment- radiatiotherapy, surgical oncology, and medical oncology",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Automatically applies to existing/future pensioners/family pensioners whose pension/family pension is paid out of the Consolidated Fund of Tamil Nadu and who draw their pension/family pension from the Pension Pay Office, Chennai/District Treasury/Sub-Treasury.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Financial coverage through cashless treatment at empanelled hospitals for certain treatments (including pre-existing illnesses) and for admissable emergency care at non-network hospitals."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Pensioner (including spouse)/family pensioner for a block of four years for the approved treatments for up to INR 4 lakhs. The annual premium of INR 3800/- paid by the government will be recovered from the pensioners/family pensioners at the rate of INR 350/- per month through deductions.",
            "The financial assistance shall be enhanced to INR 7.5 lakhs",
            "Specified treatments and surgeries as listed in the Annexure-I A of the following link:",
            "https://www.tn.gov.in/karuvoolam/pdfs/fin_e_222_2018.pdf",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Scheme is a compulsory registration for the eligible beneficiaries with exception to opt-out for certain beneficairies living out-side Tamil Nadu.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Maximum of INR 7.5 lakhs",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://www.tn.gov.in/karuvoolam/pdfs/fin_e_222_2018.pdf",
            "https://www.tn.gov.in/karuvoolam/nhis/nhis2018/fin_e_26_2019.pdf",
            ],
        },
        ],
    },
    {
        title: "Chief Minister's Public Relief Fund",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government - State",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Finance (CMPRF) Department",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "Ailments (including cancer)",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Poor and needy public (application based on need and availability of funds for the need under other schemes).",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "One time grants on case by case basis for individuals or communities to provide immediate relief to the people in distress. Provides financial assistance to the people affected by the major natural calamities, like ailments, flood, drought, fire accident, etc."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "One time grants on case by case basis.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "No specified capping. Max. grant varies from case to case.",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://ereceipt.tn.gov.in/cmprf/Cmprf",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "jscmprf@tn.gov.in",
            ],
        },
        ],
    },
    {
        title: "Prime Minister's National Relief Fund",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Government - Centre",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Prime Minister's Office",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "Treatment for certain ailments (including cancer)",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Poor and needy public (application based on need and availability of funds for the need under other schemes).",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "PMNRF is being utilized primarily to render immediate relief to families of those killed in natural calamities, like floods, cyclones, earthquakes, etc. and to the victims of the major accidents and riots. Assistance from PMNRF is also rendered to partially defray the expenses for medical treatment like heart surgeries, kidney transplantation, cancer treatment, acid attack, etc.",
            "All Central and State Government hospitals are on the panel of PMNRF. In addition to this, the following Private hospitals are also on the panel:-",
            "https://pmnrf.gov.in/en/about/private-hospital-lists",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "One time grants on case by case basis.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "No specified capping. Maximum grant varies from case to case.",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://pmnrf.gov.in/en",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "011-2301-3683",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "pmnrf@gov.in",
            ],
        },
        ],
    },
    {
        title: "Pradhan Mantri Jan Arogya Yojana-Chief Minister's Comprehensive Health Insurance Scheme (PMJAY-CMCHIS)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Goverment- State + Centre",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Tamil Nadu Health System Project (TNHSP)",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers and 3 modalities of treatment- radiatiotherapy, surgical oncology, and medical oncology",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "The inclusion of households is based on the deprivation and occupational criteria of the Socio-Economic Caste Census 2011 (SECC 2011) for rural and urban areas, respectively. This number also includes families that were covered in the RSBY but were not present in the SECC 2011 database.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The Scheme provides financial coverage for certain diagnostic, treatments and followup procedures that require hospitalization and are associated with high cost of care"
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "The scheme provides coverage up to INR 5 lakhs per family per year on a floater basis for the ailments and procedures covered under the scheme.",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Households meeting the criteria are automatically eligible for the scheme. Criteria mentioned in the link for rural and urban beneficiaries",
            "https://pmjay.gov.in/about/pmjay",
            "Additional BPL household as per the state criteria are covered under CMCHIS.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Maximum of INR 5 lakhs per family per annum",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://pmjay.gov.in/",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "1800 425 3993 (Toll Free)",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "tnhealthinsurance@gmail.com",
            "cmchis@uiic.co.in",
            ],
        },
        ],
    },
    {
        title: "Project Retinoblastoma",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Philanthropic foundation/trust/society",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Tiara Haemophilia and Cancer Foundation",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "Retinoblastoma",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Children from lower socio-economic groups",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Medical aid for children from lower socio-economic background whose parents cannot afford cost of care for cancer and hemophilia. Project has tie up with 9 hospitals in Chennai."
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Financial aid for chemotherapy, surgery, radiation, investigations for diagnosis, imaging procedures, central venous devices, and palliative care.",
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://thcf.in/",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "099620 25060",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "office@thcf.in",
            "https://tiarakids.in/cancer/",
            ],
        },
        ],
    },
    {
        title: "Cancer Support Therapy",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Philanthropic foundation/trust/society",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Can STOP (Cancer Support Therapy To Overcome Pain)",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "Pediatric cancers",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Children from lower socio-economic groups",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Umbrella activities to support pediatric cancer patients-ranging from awareness to counselling services",
            "Service extended to Patients of lower socio economic background in five",
            "government hospitals:",
            "Institute of Child Health",
            "Government Women’s Hospital",
            "Government General Hospital",
            "Government Royapettah Hospital",
            "Chennai & Arignar Government Cancer Hospital, Kancheepuram",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Nutrition support, sponsor-A-child (medical aid), drug bank, blood bank, can nest (free short stay) for poor children suffering from cancer.",
            ],
        },
        {
            heading: "Website link",
            content: [
            "http://www.canstop.org/index.php",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "044 26284256",
            "044 26144560",
            "0 9941007688",
            "044 26284257",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "canstop.smf@gmail.com",
            ],
        },
        ],
    },
    {
        title: "CCF Cancer Treatment Fund",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Philanthropic foundation/trust/society",
            ],
        },
        {
            heading: "Organization name",
            content: [
            "Coimbatore Cancer Foundation",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancer types (focus on common cancers and tobacco-related cancers)",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Patients from low-income family",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Umbrella activities to support poor cancer patients-ranging from awareness to counselling services.",
            "Diagnostic tests, investigations, chemotherapy, radiation therapy, surgery, and pharmaceutical costs are all included in the scheme.",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Screening (oral, breast, and cervical cancers), counselling, financial aid, awareness services.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 2 lakhs per patient",
            ],
        },
        {
            heading: "Website link",
            content: [
            "http://www.coimbatorecancerfoundation.com/",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "0422 4504646",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "office@thcf.in",
            "cbecancer@gmail.com",
            ],
        },
        ],
    },
],
 "Punjab": [
    {
        title: "Mukh Mantri Punjab Cancer Raahat Kosh Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State Government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Department of Health and Family Welfare, Government of Punjab",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "Financial assistance to all Punjab resident cancer patients,for the treatment to each cancer patient except:",
            "Government employees",
            "ESI employees and their dependents",
            "Those patients who have any kind of facility of medical reimbursement",
            "Any other persons who have opted for Health Insurance by Insurance companies",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "Financial assistance of INR 1.5 lakh of the total cost of treatment to all residents of Punjab in 9 Government and 9 Private Empanelled Hospitals.",
            "List of the empanelled hospital available at",
            "https://mmpcrk.gov.in/Empaneled%20Hospitals.pdf",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "Financial assistance of up to INR 1.50 Lakhs (One lakh fifty thousand) is provided"
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Report regarding confirmation of cancer and blood group of the patient",
            "Voter card, Driving License, Passport, Arms License, Kisan Credit Card with photo, Aadhar Card (optional), Photograph",
            "Along with the confirmation report, blood group of the patient is mandatory",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 1.50 Lakhs"
            ],
        },
        {
            heading: "Website link",
            content: [
            "http://mmpcrk.gov.in/index.php",
            "http://mmpcrk.gov.in/SOPs.pdf",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "Help Desk 9:00 AM to 5:00 PM on Working Days",
            "0172-5012356 & 3510293",
            "07123510293",
            "Email ID : cancercontrolcellpunjab@yahoo.com",
            ],
        },
        {
            heading: "Remarks",
            content: [
            "Web Application / Software has been developed for Mukh Mantri Punjab Cancer Raahat Kosh. In this software, all empanelled hospitals, Civil Surgeons, Deputy Commissioners and State Headquarter are connected through email and Patient through SMS",
            ],
        },
        ],
    },
    {
        title: "Punjab Government Employees & Pensioners Health Insurance Scheme",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "State Government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Punjab Government",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All types of cancers, including pre-existing diseases",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "All personnel of the Punjab Government, including All India Service officers, currently serving, newly recruited, retired, and retiring who are covered under the existing Punjab Medical Attendant Rules [CS(MA) Rules, 1940] - Health Insurance Scheme compulsory or on optional basis.",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "https://mdindiaonline.com/pes/pdf/PGEPHIS_Scheme.pdf",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "INR 3 lakhs per year per family",
            "If INR 3 lakhs is exhausted then the coverage of the family can be met through the buffer sum INR 25 crores available to all the beneficiary of the scheme",
            "In case INR 25 crores buffer is also exhausted then the over and above expense shall be met by the state government as per medical reimbursement policy",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Employee/pensioner has to submit the enrollment form before the enrollment deadline to the respective DDO",
            "Newly joined employee can submit enrollment form and is entitled to the benefits of the scheme from the date of joining",
            "Photo ID card will be issue by the insurer/TPA which can be used at the time of hospitalization",
            "Deadline for the enrollment/renewal into the scheme is 31st Dec of every year",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 3 lakhs"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://mdindiaonline.com/pes/PESPolInfo.aspx",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "1800-233-5557",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "authorisation_pgephis@mdindia.com",
            "customercare_pgephis@mdindia.com",
            ],
        },
        {
            heading: "Remarks",
            content: [
            "The employee/pensioner can avail the cashless benefit at the empanelled hopsital. The benefits include:",
            "All in patient incurred at the time of treatment",
            "All pre-exisiting diseases even before the policy began",
            "Covers 7 days -Pre Hospitalization & upto 30 days Post Hospitalization",
            "The list of day care procedures except OPD services mentioned in the pdf:",
            "https://highcourtchd.gov.in/sub_pages/left_menu/Downloads/forms/scheme.pdf",
            "Materity benefit for first 2 children arising from childbirth including Normal Delivery/Caesarean Section including miscarriage or abortion induced by accident or other medical emergency",
            ],
        },
        ],
    },
    {
        title: "Health Minister's Cancer Patient Fund (HMCPF) of Rashtriya Arogya Nidhi (RAN)",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Central government",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Ministry of H&FW, Government of India",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers",
            ],
        },
        {
            heading: "Scheme eligibility",
            content: [
            "The fund will provide financial assistance to patients, living below poverty line who are suffering from cancer",
            "Assistance is admissible for treatment in 27 Regional Cancer Centre(s) (RCC) only",
            "Central govt./state govt. /PSU employees are not eligible for financial assistance from HMCPF",
            "Grant from HMCPF would not be used where treatment/facilities for cancer treatment are available free of cost",
            ],
        },
        {
            heading: "Scheme details",
            content: [
            "The “Health Minister's Cancer Patient Fund (HMCPF) within the Rashtriya Arogya Nidhi (RAN)” was set up in 2009. In order to utilize the Health Minister's Cancer Patient Fund, the revolving fund as under RAN, has been established in 27 Regional Cancer Centres (RCCs). Such step would ensure and speed up financial assistance to needy patients and help fulfil the objective of HMCPF under RAN. The financial assistance to a cancer patient of up to INR 2 lakhs would be processed by the RCC concerned, on whose disposal the revolving fund has been placed. Individual cases, which require assistance of more than INR 2 lakhs is to be sent to the ministry for processing. Revolving funds have been created in all the 27 Regional Cancer Centres (RCCs) and funds upto INR 50 lakhs will be placed at their disposal. The revolving funds will be replenished on fulfilment of conditions regarding submission of utilization certificate and list of beneficiaries",
            ],
        },
        {
            heading: "Scheme coverage",
            content: [
            "INR 2 lakhs per treatment cycle"
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Citizenship documents, income certificate or declaration, etc.",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "INR 2 lakhs per treatment cycle"
            ],
        },
        {
            heading: "Website link",
            content: [
            "https://main.mohfw.gov.in/sites/default/files/2563214569875214.pdf",
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "PGIMER Chandigarh",
            ],
        },
        ],
    },
    {
        title: "Arogya Finance",
        sections: [
        {
            heading: "Category of funding scheme",
            content: [
            "Medical loan",
            ],
        },
        {
            heading: "Organisation name",
            content: [
                "Arogya Finance -Brand name of Ramtirth Leasing and Finance Company Pvt. Ltd. an NBFC registered with Reserve Bank of India",
            ],
        },
        {
            heading: "Type of cancers and therapies covered",
            content: [
            "All cancers",
            ],
        },
        {
            heading: "Documents required",
            content: [
            "Address proof",
            "ID proof",
            "Proof of ownership",
            "Proof of income",
            "But Arogya Finance works with whatever documents the patients are able to bring. There is a documentation charge of INR 500/- and one time 2% processing fee",
            ],
        },
        {
            heading: "Cap/Limit (if any)",
            content: [
            "Uncapped"
            ],
        },
        {
            heading: "Contact details of concered (Name / Phone Number)",
            content: [
            "Himanshu Taneja, 9911702813",
            ],
        },
        {
            heading: "Email-id for application",
            content: [
            "himanshu.taneja@arogyafinance.com",
            ],
        },
        ],
    },
],
};

export default function FundingSupportClient() {
  const params = useSearchParams();
  const state = params.get("state") || "Assam";
  const schemes = stateSchemes[state];
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleItem = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!schemes) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8">
              <div className=" text-4xl mb-4">⚠️</div>
              <h2 className="text-xl sm:text-2xl font-bold  mb-4">
                The details for <span className="uppercase">{state}</span> state
                shall be updated soon.
              </h2>
              <p className=" mb-4">
                In the meantime, please reach out to us at:
              </p>
              <a
                href="mailto:help@aarogyadhan.com"
                className="text-[#5271FF] text-xl sm:text-2xl font-bold hover:text-[#243460] transition-colors"
              >
                help@aarogyadhan.com
              </a>
              <p className=" mt-4">
                We will try our best to solve any related queries.
              </p>
            </div>
          </div>
        </div>
        <DhanFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
          <main className="flex-1">
            <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto">
              {/* Banner */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 sm:mb-10 lg:mb-12 gap-6 lg:gap-8">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#243460] leading-tight">
                    {state.toUpperCase()} STATE HEALTH
                    <br />
                    <span className="text-[#5271FF]">SCHEME</span>
                  </h1>
                  <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl">
                    Comprehensive health schemes and benefits available for
                    residents of {state}
                  </p>
                </div>
    
                <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
                  <Image
                    src="https://res.cloudinary.com/dorreici1/image/upload/v1752228655/pngtree-india-flag-in-map-pin-png-image_8523373_ozksk4.png"
                    alt="India Health Symbol"
                    height={600}
                    width={600}
                    className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl shadow-lg object-cover"
                  />
                </div>
              </div>
    
              {/* Schemes */}
              {schemes.map((scheme, schemeIndex) => (
                <div key={schemeIndex} className="mb-8 sm:mb-12 lg:mb-16">
                  {/* Scheme Title */}
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {scheme.title}
                    </h2>
                    <div className="w-20 h-1 bg-[#5271FF] rounded-full"></div>
                  </div>
    
                  {/* Accordion Container */}
                  <div className="space-y-3 sm:space-y-4">
                    {scheme.sections?.map((section, index) => {
                      const key = `${schemeIndex}-${index}`;
                      const isOpen = openIndexes.includes(key);
    
                      return (
                        <div
                          key={index}
                          className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-200"
                        >
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 hover:bg-gray-100 text-left transition-colors duration-200 focus:outline-none "
                            aria-expanded={isOpen}
                          >
                            <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                              {section.heading}
                            </span>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <Minus className="w-5 h-5 text-red-500 transition-transform duration-200" />
                              ) : (
                                <Plus className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                              )}
                            </div>
                          </button>
    
                          {isOpen && (
                            <div className="bg-white px-4 sm:px-6 py-4 sm:py-6 text-gray-700 space-y-4 animate-accordion-down">
                              {section.content.map((entry, idx) => {
                                if (typeof entry === "string") {
                                  return (
                                    <p
                                      key={idx}
                                      className="text-sm sm:text-base leading-relaxed w-full"
                                    >
                                      {entry
                                        .split(/(https?:\/\/[^\s]+)/g)
                                        .map((part, i) =>
                                          part.startsWith("http") ? (
                                            <a
                                              key={i}
                                              href={part}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[#5271FF] underline hover:text-[#243460] transition-colors pr-16"
                                            >
                                              {part}
                                            </a>
                                          ) : (
                                            <span key={i}>{part}</span>
                                          ),
                                        )}
                                    </p>
                                  );
                                }
    
                                if (
                                  typeof entry === "object" &&
                                  entry.type === "text"
                                ) {
                                  return (
                                    <h3
                                      key={idx}
                                      className="text-base sm:text-lg font-semibold text-gray-900 mt-4 mb-2"
                                    >
                                      {entry.text}
                                    </h3>
                                  );
                                }
    
                                if (entry.type === "list") {
                                  return (
                                    <ul
                                      key={idx}
                                      className="list-disc ml-6 space-y-2 text-sm sm:text-base"
                                    >
                                      {entry.items?.map((item, subIdx) => (
                                        <li key={subIdx}>
                                          {item
                                            .split(/(https?:\/\/[^\s]+)/g)
                                            .map((part, i) =>
                                              part.startsWith("http") ? (
                                                <a
                                                  key={i}
                                                  href={part}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-[#5271FF] underline hover:text-[#243460] transition-colors"
                                                >
                                                  {part}
                                                </a>
                                              ) : (
                                                <span key={i}>{part}</span>
                                              ),
                                            )}
                                        </li>
                                      ))}
                                    </ul>
                                  );
                                }
    
                                if (entry.type === "table") {
                                  return (
                                    <div
                                      key={idx}
                                      className="overflow-x-auto -mx-4 sm:-mx-6"
                                    >
                                      <div className="inline-block min-w-full align-middle">
                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                          <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                              <tr>
                                                {entry.headers?.map(
                                                  (header, thIdx) => (
                                                    <th
                                                      key={thIdx}
                                                      className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                      {header}
                                                    </th>
                                                  ),
                                                )}
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                              {entry.rows?.map((row, rowIdx) => (
                                                <tr
                                                  key={rowIdx}
                                                  className="hover:bg-gray-50"
                                                >
                                                  {row.map((cell, cellIdx) => (
                                                    <td
                                                      key={cellIdx}
                                                      className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                    >
                                                      {cell
                                                        .split(
                                                          /(https?:\/\/[^\s]+)/g,
                                                        )
                                                        .map((part, i) =>
                                                          part.startsWith(
                                                            "http",
                                                          ) ? (
                                                            <a
                                                              key={i}
                                                              href={part}
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                              className="text-[#5271FF] underline hover:text-[#243460] transition-colors"
                                                            >
                                                              {part}
                                                            </a>
                                                          ) : (
                                                            <span key={i}>
                                                              {part}
                                                            </span>
                                                          ),
                                                        )}
                                                    </td>
                                                  ))}
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
    
                                return null;
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          </main>
          <DhanFooter />
        </div>
  );
}