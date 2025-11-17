"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Minus, Plus } from "lucide-react";
import DhanFooter from "../components/dhan-footer";
const stateSchemes = {
  Assam: [
    {
      title: "Atal Amrit Abhiyan",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "All the BPL and APL (up to INR 5 lakhs per annum income) and resident of Assam state are eligible for the insurance scheme",
            "There are about 436 approved procedures which are reimbursed under the scheme",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Village level and district level kiosks carry out the enrollment process after verifying the documents of the applicant and provide smart card upon enrollment",
            "Location and schedule of the enrollment at village level in mobile kiosk will be carried out by the implementing agency",
            "Enrollment will be free for BPL families, and for families with annual income of INR 1.5 lakhs to 5 lakhs, enrollment fees of INR 100/- per member will be charged annually",
            "Where?",
            "In all the government hospitals and empanelled private hospitals",
            "Health coodinator (Arogya mitra) at every empanelled hospital will help beneficiaries",
          ],
        },
        {
          heading: "Documents",
          content: [
            "For enrollment into the insurance scheme, photo identity proof and voter's identity card are mandatory",
            "For children under 18 years of age birth certificate is mandatory",
            "For APL family (INR 1.5 lakhs to 5 lakhs per annum income), income certificate is required",
            "Biomteric details, like fingerprints, is mandatory for each member of the family",
          ],
        },
        {
          heading: "Cap (if any)",
          content: [
            "Cashless benefit of INR 2 lakhs per annum per member of the family",
            "Transportation allowance of INR 300/- per visit, subject to maximum of INR 3000 per annum",
            "For treatment out of the state, daily allowance of INR 1,000/-, subject to maximum INR 10,000/-",
          ],
        },
        {
          heading: "Remark",
          content: [
            "For treatment out of the state in an empanelled hospital in selected city, economy cheapest airfare will be provided to the patient and one attendent",
            "The link for manual application form is listed below:",
            "https://nhm.assam.gov.in/sites/default/files/swf_utility_folder/departments/nhm_lipl_in_oid_6/menu/schemes/Atal_Amrit_Abhiyan_Application_Format.pdf",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://atalamritabhiyan.assam.gov.in/information-services/atal-amrit-abhiyan",
          ],
        },
      ],
    },
  ],
  Sikkim: [
    {
      title: "Mukhya Mantri Jeevan Raksha Kosh Scheme",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "This scheme is meant for providing financial assistance to the general public other than the people under BPL, referred by state medical board for treatment outside the state",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Referred by state medical board for treatment outside the state",
            "Where?",
            "The scheme provides financial assistance for getting treatment outside state not in Sikkim.",
            "The Hospitals empanelled by Health Department are as under:",
            "https://sikkim.gov.in/DepartmentsMenu/health-family-welfare-department/States%20Initiatives%20and%20other%20wings/mukhya-mantri-jeewan-raksha-kosh",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Beneficiary is to provide referral certificate from state medical board of STNM hospital and attested copies of Sikkim certificate/certificate of identification from the authority to avail facility under the scheme",
          ],
        },
        {
          heading: "Cap (if any)",
          content: ["INR 20,000/- up to INR 2, 00,000/-"],
        },
        {
          heading: "Reference",
          content: [
            "https://sikkim.gov.in/DepartmentsMenu/health-family-welfare-department/States%20Initiatives%20and%20other%20wings/mukhya-mantri-jeewan-raksha-kosh#:~:text=Implemented%20in%202009%20for%20treatment,assistance%20under%20the%20MMJRK%20Scheme.",
          ],
        },
      ],
    },
  ],
  "West Bengal": [
    {
      title:
        "West Bengal Health For All Employees and Pensioners Cashless Medical Treatment Scheme, 2014",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "State Government employees, pensioners including family pensioners, All India Service (AIS) officers, AIS pensioners including family pensioners, and their eligible family members",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "The beneficiary will be required to produce enrolment certificate before the approved Health Care Organisation (HCO) for undergoing cashless medical treatment (website of Finance Department may be consulted for up to date approved list of such HCOs)",
            "Where?",
            "Government hospitals, hospitals managed by local bodies, like municipalities, state-aided hospitals, selected speciality hospitals outside the state, and private hospitals in the state and in National Capital Region (NCR)",
            "For list of empanelled hospitals click on the link below:",
            "https://wbhealthscheme.gov.in/Home/Display_hco_list.aspx",
          ],
        },
        {
          heading: "Documents",
          content: ["Enrollment certificate"],
        },
        {
          heading: "Cap",
          content: ["INR 1 lakh"],
        },
        {
          heading: "Remark",
          content: [
            "Apply online for enrollment in the scheme (if not applied already)",
            "http://wbfin.nic.in",
            "Retired AIS officers who rendered their services in WB will have to pay INR 40,000/- as a one-time payment for the enrollment.",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://wbxpress.com/cashless-treatment-state-govt-employees-pensioners",
          ],
        },
        {
          heading: "Helpline",
          content: ["033-22544123", "033-22544034 (11 am to 4 pm)"],
        },
        {
          heading: "Mail ID for queries",
          content: ["support.wbmedicalcell@nic.in"],
        },
      ],
    },
    {
      title: "West Bengal Health Scheme, 2008",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "State Government employees, pensioners including family pensioners, All India Service (AIS) officers, AIS pensioners including family pensioners, and their eligible family members",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Receive treatment in an empanelled hospital/ Government hospital, i.e. recognized hospitals under the Health Scheme, show health scheme ID card, inform your office within 3 days of commencement of treatment, claim for reimbursement within 3 months of discharge",
            "Take permission of the West Bengal Health Scheme Authority before:-",
            "Human Organ Transplantation",
            "Cochlear Implant Surgery",
            "Implantation of Dual Chamber Pacemaker",
            "Implantation of more than one Drug Eluting Stents",
            "Implantation of more than two Stents",
            "Implantation of AICD/CRT with AICD",
            "Implantation of neuro implants, viz., Deep Brain Stimulator Implants, Intra- Thecal Pumps, Spinal Chord Stimulators",
            "Digital Hearing Aid",
            "Before treatment in a speciality hospital outside the state",
            "Where?",
            "Government hospitals, hospitals managed by local bodies, like municipalities, state-aided hospitals, selected speciality hospitals outside the state, and private hospitals in the state and in National Capital Region (NCR)",
            "For list of empanelled hospitals click on the link below",
            "https://wbhealthscheme.gov.in/Home/Display_hco_list.aspx",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Health scheme identity card",
            "Temporary family permit if ID card is not issued",
            "All original bills verified by hospitals, institutions and laboratory",
            "All original vouchers, cash memos and money receipt",
            "Detailed list of all medicines, laboratory tests, and investigation procedures, including the medicine purchased from outside along with the certificate from the hospitals' authorized person",
            "Forms for the medical treatment of government employees and their families:",
            "O.P.D. treatment- Form D 1",
            "Indoor treatment and related O.P.D. treatment- Form D 2",
            "Medical treatment done in non-empanelled hospital/nursing home - Form D 3",
            "Form for the medical treatment of government pensioners and their families",
            "O.P.D. treatment- Form IV 1",
            "Indoor treatment and related O.P.D. treatment- Form IV 2",
            "Medical treatment done in non-empanelled hospital/nursing home- Form IV 3",
          ],
        },
        {
          heading: "Cap",
          content: [
            "For indoor patient: INR 50,000/- and for OPD patient: INR 5,000/-",
          ],
        },
        {
          heading: "Remark",
          content: [
            "Eligible person would be allowed to claim reimbursement of medical expenses both from insurance company as well as the West Bengal Health Scheme, 2008",
          ],
        },
        {
          heading: "Reference",
          content: ["https://wbhealthscheme.gov.in/"],
        },
      ],
    },
    {
      title: "Chief Minister's Relief Fund (Medical Assistance)",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Assistance from Chief Minister's Relief Fund is given to:",
            "Permanent residents of the State of West Bengal",
            "Distressed patients who are undergone treatment in the Govt./Non Govt. Hospitals/Institutions and also are unable to bear the cost of treatment",
            "Patients who are not eligible to get benefit of Employees State Insurance Scheme/any other insurance scheme or get reimbursement from employer/organization",
            "Patients can avail the assistance only once for the same case in one financial year",
            "Patients whose annual family income does not exceed INR 1,20,000/-",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "People who seek financial assistance from Chief Minister’s Relief Fund may send their signed application on a plain paper along with all the related documents (in case of LTI should be attested by Govt. Group-A Officer) to: The Assistant Secretary, Chief Minister's Office, 'Nabanna' 325, Sarat Chatterjee Road, Howrah-711102.",
            "Where?",
            "Government hospitals, Non government Hospitals, Institutions",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Following are the required documents for financial assistance from Chief Minister’s Relief Fund for medical treatment:",
            "All papers relating to the probable or actual expenditure for the treatment, including quotation and the tentative date of operation certificate from the concerned authority, if the patient is admitted. The expenditure incurred prior to the date of receipt of application in CMO is not admissible",
            "Monthly family income certificate from anyone mentioned within the bracket on their official letterhead (DM/SDO/BDO/Group-A govt. officer not below the rank of Jt. B.D.O./Executive officer in case of municipality/Deputy Commissioner of Corporation)",
            "Certificate regarding availability or non-availability of financial assistance/reimbursement from the employer. Pay certificate from the employer showing medical allowance",
            "Recommendation from an elected people's representative (MP/MLA) to the Hon'ble Chief Minister, Govt. of West Bengal",
            "In case of kidney transplation, one is required to submit No Objection Certificate (in case of non-blood related donor) from Health Department, Govt. of West Bengal, Salt Lake, Kolkata, or an affidavit (in case of blood related Donor) from the First Class Judicial Magistrate (original/attested)",
            "Contact details with Mobile No.",
            "Photo copies of all the documents are required to be attested by Group-A govt. officer. Group-A are class-I public servants",
          ],
        },
        {
          heading: "Cap",
          content: ["Treatment is partially funded (Exact cap not mentioned)"],
        },
        {
          heading: "Remark",
          content: [
            "The financial assistance sanctioned is a one-time grant only. Generally the sanctioned amount is directly forwarded to the concerned hospital/institute as per their advice",
          ],
        },
        {
          heading: "Reference",
          content: ["http://wbcmo.gov.in/donation.aspx"],
        },
        {
          heading: "Helpline",
          content: ["(033) 2253 5278"],
        },
      ],
    },
  ],
  Gujarat: [
    {
      title: `Mukhyamantri Amrutam "MA" Yojana`,
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Families with an annual income below INR 4 lakhs",
            "Senior citizens of the families with an annual income below INR 6 lakhs",
            "All urban & rural ASHAs (Accredited Social Health Activist)",
            "Accredited Reporters",
            "U-win card holders",
            "Class 3 & 4 employees of the state government with fix pay",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "In the hospital, there will be a counter for Mukhyamantri Amrutum (MA Vatsalya) Yojana to guide the beneficiary. The beneficiary will get cashless medical treatment at the empanelled hospital.",
            "Where?",
            "The scheme provides benefits to around 5,000 empanelled private hospitals, government hospitals, and stand-alone dialysis centres, out of which approximately 200 network hospitals are dedicated towards cancer treatment.",
            "For list of empannelled hospitals click on the following link:",
            "http://www.magujarat.com/DistrictwiseHospitalEmpanelment.html",
          ],
        },
        {
          heading: "Documents",
          content: [
            "The beneficiary needs to carry only MA card when they go to the hospital where his/her fingerprints will be matched.",
          ],
        },
        {
          heading: "Cap",
          content: [
            "INR 5 lakhs per family per annum (family floater)",
            "INR 300/- as transportation charge for hospital visit",
          ],
        },
        {
          heading: "Remark",
          content: [
            "MA Yojana covers cardiovascular diseases, neurological diseases, cancer, kidney diseases and around 1763 defined procedures covered under PMJAY packages along with follow-up.",
            `For getting "MA Vatsalya" card a person can enroll him/herself at the kiosk established at the taluka and city civic center.`,
            "Documents needed for enrollment include:",
            "Residential proof (Ration Card)",
            "Identity proof (Voter card, PAN card, Aadhar Card or Driving License)",
            "BPL certificate",
            "Income certificate",
            "Income certificate has to be availed from District Collector, District Development Officer, Deputy Collector/Assistant Collector, Province Officer, Deputy District Development Officer, Taluka Mamlatdar, Taluka Development Officer, Deputy Mamlatdar.",
            "Also there is no limits to enrol family members under MA Yojana. Only the requisite is that all those family members cover in one ration card. For more information on enrollment process, please visit",
            "http://www.magujarat.com/MACardCaseScenario.html",
            `For getting "MA Vatsalya" card a person can enroll him/herself at the kiosk established at the Taluka and city civic center`,
          ],
        },
        {
          heading: "Reference",
          content: ["www.magujarat.com"],
        },
        {
          heading: "Helpline",
          content: ["1800-233-1022"],
        },
        {
          heading: "Mail ID for queries",
          content: ["nhpmgujarat@gmail.com", "mayojanagujarat@gmail.com"],
        },
      ],
    },
    {
      title: "School Health-Rastriya Bal Swasthya Karyakram (SH-RBSK)",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Newborns (0-6 weeks) born at public health facilities and home",
            "Preschool children (6 weeks to 6 years) at rural areas and urban slums",
            "School children (6 years to 18 years) enrolled in government and government aided schools",
            "Students enrolled in classes 1 to 12 in all schools (government, grant in aids and private)",
            "Non-school going children up to age of 18",
            "Children/Juvenile home, Madrassa children",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "An ASHA worker visits home to screen the newborn till 6 weeks",
            "Anganwadi center based screening twice a year for 6 weeks to 6 years old patients",
            "Govt and govt-aided school based screening once a year by the mobile health teams",
            "All these patients will be referred to district hospitals and from there to Apex hospitals, if required. Clear instructions and address of the special facility to be visited in the district will be provided",
            "Where?",
            "At home by ASHA worker, anganwadi, government and government-aided school",
            "M.P. Shah Cancer Hospital, Ahmedabad",
          ],
        },
        {
          heading: "Documents",
          content: ["Age proof and school ID card (If in school)"],
        },
        {
          heading: "Cap",
          content: [
            "For indoor patient: INR 50,000/- and for OPD patient: INR 5,000/-",
          ],
        },
        {
          heading: "Remark",
          content: [
            `Patients will not charged for any drug available in the hospital pharmacy, but the patient has to purchase the drug from outside if not available in the hospital pharmcy. 26 Functional District Early Intervention Centers (DEIC) are operational across the state for solving childhood and adolescence problems and enhancing their capabilities.992 Mobile Health teams are functional accross Gujarat`,
            "The scheme aims is to screen and detect total of 37 conditions with medical checkup based on 4D’s: Defects at Birth, Diseases, Deficiencies and Disabilities",
            "Children with critical conditions such as heart disease, kidney disease, and cancer are referred to Super Specialty Hospital for free diagnosis, treatment, and care, regardless of economic background. Throughout the year, children aged 0 to 18 are given free services.",
            "RBSK provides the following Health Services:",
            "Immediate primary care",
            "Health & Referral Card",
            "Spectacles for free",
            "Referral services for secondary and tertiary care",
            "Super-Specialty treatment for heart, kidney and cancer disease including renal transplant, liver transplant, cochlear implant and clubfoot",
            "A three-part referral card is to be provided to parents/caregivers/students with clear instructions and address of the specifed facility to be visited in the District. Preliminary observations should also be recorded in the referral card by the Medical Officer of the Block level Health Team",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://nhm.gujarat.gov.in/images/pdf/resource-material.pdf",
            "http://shp.guj.nic.in/Downloads/Guideline%20for%20Health%20Worker.pdf",
            "https://gujhealth.gujarat.gov.in/school-health-programme.htm",
            "https://nhm.gujarat.gov.in/rbsk.htm",
          ],
        },
        {
          heading: "Helpline",
          content: ["079-2325 3324", "079-2325 3323"],
        },
      ],
    },
  ],
  Kerala: [
    {
      title: `Cancer Suraksha Scheme`,
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Cancer patients up to the age of 18 years in the BPL/APL groups",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Patients can avail this across any government facilities after submitting the required documents",
            "Where?",
            "Registered patients would be provided treatment free of cost at the designated hospitals 9 government facilities, including 3 autonomous public sector tertiary cancer care hospitals",
          ],
        },
        {
          heading: "Documents",
          content: [
            "The eligible people include the BPL card holders, RSBY card holders, and person with a certificate from the secretary of Panchayat, Municipality, and/or Municipal Corporation",
          ],
        },
        {
          heading: "Cap",
          content: [
            "The ceiling of expenditure per child would initially be INR 50,000/-",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://socialsecuritymission.gov.in/scheme_info.php?id=MQ==",
          ],
        },
        {
          heading: "Helpline",
          content: ["1800 120 1001"],
        },
        {
          heading: "Mail ID for queries",
          content: ["socialsecuritymission@gmail.com"],
        },
      ],
    },
    {
      title: "Karunya Arogya Suraksha Padhiti (KASP)",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Candidates must be a permanent resident of the state of Kerala",
            "Only the families belonging to the poor, BPL and APL whose family annual income does not exceed INR 3 lakhs",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "KASP-PMJAY provides cashless access to health care services for the beneficiary at the point of service, that is, the hospital. It covers up to 3 days of pre-hospitalization and 15 days post-hospitalization expenses, such as diagnostics and medicines",
            "Where?",
            "All government cancer care hospitals and 3 government autonomous tertiary care facilities",
            "Every pre-existing condition is covered right away",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Passport-size photo",
            "Aadhaar card or Voter ID card",
            "Income Certificate",
            "BPL Card",
            "Documents with residential details",
            "A copy of your ration card",
            "KASP e-card is to be generated by enrolling in KASP PMJAY Program",
          ],
        },
        {
          heading: "Cap",
          content: [
            "The benefits of INR 5 lakhs are on a family floater basis, which means that it can be used by one or all members of the family.",
          ],
        },
        {
          heading: "Remark",
          content: [
            "For cancer care, patients can avail KASP only from the government facilities",
            "The scheme’s advantages are transferable throughout the nation; a recipient may visit any public or private hospital in India that has been accredited to receive cashless care",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://sha.kerala.gov.in/karunya-arogya-suraksha-padhathi/",
          ],
        },
        {
          heading: "Helpline",
          content: ["0471 4063121, 1056"],
        },
        {
          heading: "Mail ID for queries",
          content: ["statehealthagencykerala@gmail.com"],
        },
      ],
    },
    {
      title: "Additional Patient Assistance Funds",
      sections: [],
    },
    {
      title: "Karunya Benevolent Fund",
      sections: [
        {
          heading: "Details",
          content: [
            "The scheme provides financial support to people suffering from cancer, heart and kidney ailments, and hemophilia along with palliative care. Both public sector and private sector hospitals are part of this program. This is merged with PMJAY to evolve into Karunya Arogya Suraksha Padithi.",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 2 lakhs"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Sukrutham",
      sections: [
        {
          heading: "Details",
          content: [
            "This is an anti-cancer treatment scheme for patients diagnosed as suffering from cancer either histologically or radiologically. The eligible people include the BPL card holders, RSBY card holders, and person with a certificate from the secretary of Panchayat, Municipality, and Municipal Corporation.",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 3 lakhs"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Vayomithram",
      sections: [
        {
          heading: "Details",
          content: [
            "The Vayomithram project mainly provides free medicines through mobile clinics, palliative care, counseling service, and help desk to the old age. The project was implemented as a joint initiative to LSGD in the area. The main objective of the scheme is to provide free health care to the old age people.",
          ],
        },
        {
          heading: "Capping",
          content: ["Free Medicine to patients above the age of 65 years"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Cancer Pension Scheme",
      sections: [
        {
          heading: "Details",
          content: [
            "It is run on the basis of contributions in the form of money or medicines from individuals or groups. NGOs also take up active role in the functioning of drug banks. First-line and second-line chemotherapy drugs, antibiotics, disposables, and supportive medicines are issued free of cost. Individuals/groups shall make contribution by cash or medicine.",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 1000/- per month"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Society for Medical Assistance of Poor",
      sections: [
        {
          heading: "Details",
          content: [
            "SMAP is a joint venture of the central and state government to provide financial assistance to the poor families, not exceeding an annual income INR 3 lakhs, for the treatment of chronic diseases. Families covered under RSBY-CHIS are not eligible for the benefits from this scheme.",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 50000/-"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Rashtriya Arogya Nidhi",
      sections: [
        {
          heading: "Details",
          content: [
            "This scheme provides financial aid, not exceeding INR 2 lakhs, for specific investigations and treatments related to cancer to poor patients. The grant is released as one time grant to the medical superintendent of the hospital.",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 2 lakhs"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Chief Minister’s Distress Relief fund",
      sections: [
        {
          heading: "Details",
          content: [
            "This scheme provides financial assistance to people affected by natural calamities and to the needy individuals for their treatment of major diseases like cancer, cardiac surgery, kidney transplant, brain tumor, liver and multi organ failure, etc.",
          ],
        },
        {
          heading: "Capping",
          content: ["-"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "CHIS PLUS",
      sections: [
        {
          heading: "Details",
          content: [
            "Production of the health card is a must. If the patient belongs to BPL category, he or she is eligible for a maximum of INR 70000/- cashless treatment or for whatever amount is left in the credit. Patients who are not eligible for reimbursement only can avail this scheme.",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 70000/-"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Comprehensive Health Care Programme for Scheduled Tribes",
      sections: [
        {
          heading: "Details",
          content: [
            "The patient should bring a copy of tribal certificate from village officer / tribal officer",
          ],
        },
        {
          heading: "Capping",
          content: [
            "APL patient INR 10000/- per day and BPL patient INR 50000/- per day",
          ],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Ashwasakiranam",
      sections: [
        {
          heading: "Details",
          content: [
            "All bed-ridden patients who need a full-time caregiver",
            "Mentally challenged (Autism, Cerebral Palsy, Mental retardation, Mental illness)",
            "100 % blind, bed-ridden cancer patients, old-aged bed-ridden",
            "Brittle bone disease",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 525/- per month"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Government schemes"],
        },
      ],
    },
    {
      title: "Susan Daniel Cancer Relief Fund, USA",
      sections: [
        {
          heading: "Details",
          content: [
            "It is benefitted to 100 patients per year ($100 each) for which RCC sends the list of patients.",
          ],
        },
        {
          heading: "Capping",
          content: ["$ 100 each"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Non government schemes"],
        },
      ],
    },
    {
      title: "Indian Cancer Society",
      sections: [
        {
          heading: "Details",
          content: [
            "In collaboration with HDFC Asset Management Co. Ltd this scheme provides funds for the treatment of curable cancers in low income group patients",
            "Doctors identify the patients",
            "Patients have to report with the following documents:",
            "copy of ration card",
            "aadhaar card",
            "income certificate from Tahsildar",
            "a photograph of the patient",
            "a photo in CD",
            "Financial assistance will cover cost of all aspects of treatment, including tests, nutrition, surgery, radiation, chemotherapy, and prosthesis",
            "Not eligible for pay ward facility",
          ],
        },
        {
          heading: "Capping",
          content: ["INR 4 lakhs"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Non government schemes"],
        },
      ],
    },
    {
      title: "A Free Medicine Bank",
      sections: [
        {
          heading: "Details",
          content: [
            "It is run on the basis of contributions in the form of money or medicines from individuals or groups. NGOs also take up active role in the functioning of drug banks. First-line and second-line chemotherapy drugs, antibiotics, disposables, and supportive medicines are issued free of cost. Individuals/groups shall make contribution by cash or medicine.",
          ],
        },
        {
          heading: "Capping",
          content: ["-"],
        },
        {
          heading: "Type Govt/Non Govt",
          content: ["Non government schemes"],
        },
      ],
    },
  ],
  "Madhya Pradesh": [
    {
      title: `Deen Dayal Antyodaya Upchar Yojana`,
      sections: [
        {
          heading: "Eligibility",
          content: [
            "All BPL families irrespective of the number of members in the family",
            "All members of primitive tribal groups irrespective of their economic status",
            "Families holding Mukhyamantri Mazdoor Suraksha Card and Nirman Shramik Card",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "At the community level - Village organization and cluster level organization",
            "At the mission level - District and block office",
            "Where?",
            "All the government hospitals that provide hospitalization",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Shall be an Indian citizen",
            "Shall fall under BPL list and has Family Health card (All families which are registered in the BPL list issued by the Panchayat/urban local bodies are eligible to get the family health card)",
            "Aadhaar card",
            "Identity Card",
            "Residence proof",
            "Voter Id card",
            "Mobile number",
            "Passport size photograph",
          ],
        },
        {
          heading: "Cap (if any)",
          content: [
            "INR 20,000/- per family per annum",
            "In case of serious illness the limit is INR 30,000/-",
          ],
        },
        {
          heading: "Remark",
          content: [
            "It covers only medicine and investigation of the hospitalized patients only",
            `Physician fees and bed charges are paid by the patient`,
          ],
        },
        {
          heading: "Reference",
          content: [
            "http://www.cmhelpline.mp.gov.in/Schmedetail.aspx?Schemeid=833",
          ],
        },
      ],
    },
    {
      title: "State Illness Assistance Fund",
      sections: [
        {
          heading: "Eligibility",
          content: ["All the BPL families and domicile of Madhya Pradesh"],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "The applicant has to give application in precribed format to the district collector",
            "The form is attached below:",
            "https://health.mp.gov.in/sites/default/files/siaf.pdf",
            "Where?",
            "List of hospitals in the state",
            "https://health.mp.gov.in/sites/default/files/2019-03/SIAF-Approved-hosp-2019_0.pdf",
            "List of hospitals outside the state",
            "https://health.mp.gov.in/sites/default/files/sif-out-state-2016.pdf",
          ],
        },
        {
          heading: "Documents",
          content: [
            "BPL card",
            "Proof of domicile of MP",
            "Cost of treatment estimate should also be attached with the form",
          ],
        },
        {
          heading: "Cap (if any)",
          content: ["Minimum INR 25000/- and maximum INR 2 lakhs"],
        },
        {
          heading: "Remark",
          content: [
            "The benefit of the scheme can be availed only once to one member of the BPL family",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://health.mp.gov.in/en/state-illness-assistance-fund",
          ],
        },
      ],
    },
  ],
  Maharashtra: [
    {
      title: "Mahatma Jyotiba Phule Jeevandayeeni Yojana",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Beneficiaries are divided into 3 categories:",
            "Category A) Orange/Yellow/Annapurna/Antyodaya Anna Yojana (AAY) ration card holders issued by Civil Supplies Department, Government of Maharashtra",
            "Category B) Farmers with white ration card & from 14 agriculturally distressed districts of Maharashtra",
            "Category C)",
            "Students of Government Ashram Shala, Children of Government Orphanages, Senior citizens of Government old age homes & Female inmates of Government Mahila Ashram",
            "Journalists & their dependent family members approved by DGIPR",
            "Construction workers and their families having live registration with Maharashtra Building & other Construction worker Welfare Board",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Arogyamitra placed in the general/woman/district/network hospital will help the beneficiary",
            "Beneficiary gets a referral card from the general hospital or health camps based on the diagnosis",
            "Beneficiary needs to produce the required documents",
            "The network hospital extends cashless treatment and surgery to the beneficiary",
            "Where?",
            "Total of 987 hospitals offering 972 procedures and 121 follow up packages with 30 special categories (including Medical and Surgical Oncology)are empanelled under this scheme.",
            "For the list of procedures or invetigations including 50 plus medical oncology and around 118 surgical oncology, click on the link below:",
            "https://www.jeevandayee.gov.in/MJPJAY/RGJAYDocuments/All%20Mandetory%20investigation%20list-1212.pdf",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Yellow, Orange, Antyodaya, and Annapurna ration card and any Photo ID proof",
            "White ration card with 7/12 extract bearing the name of the beneficiary/head of the family or a certificate from the nearest Revenue Officer indicating that the beneficiary is a farmer along with valid photo ID proof of the beneficiary",
            "Any identity card/health card or any other identification mechanism as per the State Health Assurance Society (SHAS)",
            "For the list of valid proof Id's, click on the link below:",
            "https://www.jeevandayee.gov.in/MJPJAY/RGJAYDocuments/IDPROOFLIST.pdf",
          ],
        },
        {
          heading: "Cap",
          content: [
            "Upto INR 1.5 lakhs annual coverage (family floater)",
            "Upto INR 2.5 lakhs annual coverage for renal transplant (family floater)",
          ],
        },
        {
          heading: "Remark",
          content: [
            `For getting "Mahatma Jyotiba Phule Jeevandayeeni Health Card " please open the following file:`,
            "https://www.jeevandayee.gov.in/MJPJAY/FrontServlet?requestType=CommonRH&actionVal=RightFrame&page=undefined%3E%3E%3Cb%3EHealth%20Card%20Circular%20and%20GR%3C/b%3E&pageName=Health_Card_Circular_and_GR&mainMenu=Health_Card&subMenu=Health_Card_Circular_and_GR",
            "For the list of other documents required to get health card, open the PDF file below:",
            "https://www.jeevandayee.gov.in/MJPJAY/RGJAY.jsp",
          ],
        },
        {
          heading: "Reference",
          content: ["https://www.jeevandayee.gov.in/#"],
        },
        {
          heading: "Helpline",
          content: ["1800-233-2200", "155388"],
        },
      ],
    },

    {
      title: "Chief Minister's Relief Fund (CMRF)",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Maharashtra resident with yearly income less than INR 1 lakh",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Apply online with the scan copy of all the documents needed (Click below link):",
            "https://cmrf.maharashtra.gov.in/CMRFCitizen/pdf/medical%20form.pdf",
            "Where?",
            "At any government and private hospital listed in the online application form",
            "For list of empanelled hospitals, click here:",
            "https://cmrf.maharashtra.gov.in/CMRFCitizen/pdf/CMRFHospitalsList.pdf",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Medical expenses estimate certificate",
            "Copy of Maharashtra ration card/resident certificate and aadhar number",
            "Income certificate certified by the Tehsildar",
            "MLA/MPs recommendation letter",
            "Registered mobile number",
            "Below mentioned Hospital Payment details should be provided:",
            "Hospital's bank account number",
            "Bank name and branch name",
            "Hospital name as per the bank's records",
            "IFSC code of the Bank",
            "Hospital e-mail",
          ],
        },
        {
          heading: "Cap",
          content: [
            "For an estimated cost of treatment up to:",
            "INR 20,000/- amount of disbursement is INR 10,000/-",
            "INR 20,000/-INR49,999/- disbursement is INR 15,000/-",
            "INR 50,000/-INR 99,999/- disbursement is INR 20,000/-",
            "INR 1,00,000/-INR 2,99,999/- disbursement is INR 30,000/-",
            "INR 3,00,000/-INR 4,99,999/- disbursement is INR 40,000/-",
            "INR 5,00,000/- and above disbursement is INR 50,000/-",
          ],
        },
        {
          heading: "Remark",
          content: [
            "For private hospital medical expenses, estimate shall be above INR 1 lakh",
            "As of now, over 100 cases of cancer has been enlisted in the disease report under this scheme:",
            "https://cmrf.maharashtra.gov.in/CMRFCitizen/diseasettlamntaction.action",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://cmrf.maharashtra.gov.in/CMRFCitizen/disbaction.action#C3",
            "https://cmrf.maharashtra.gov.in/CMRFCitizen/mainindexaction",
          ],
        },
      ],
    },

    {
      title: "Health Minister's Cancer Patient Fund",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Patients will be provided financial assistance for their treatment at government hospitals with super specialty facilities. Those undergoing treatment in private hospitals will not be eligible for the financial assistance under the scheme",
            "The financial assistance to eligible patients will be in the form of 'one-time grant'",
            "Government servants and their families will not be eligible under this scheme",
            "There will be no reimbursement of the expenditure already incurred",
            "Families covered under Ayusman Bharat - Pradhan Mantri Jan Arogya Yojana (PMJAY) will not be eligible for financial assistance under RAN and HMCPF components",
            "More info on the same can be found in the following link:",
            "https://main.mohfw.gov.in/sites/default/files/RAN_Guideline_2019.pdf",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Applicants need to fill the form attached in Annexure IV of the following pdf link:",
            "https://main.mohfw.gov.in/sites/default/files/RAN_Guideline_2019.pdf",
            "This form is also available offline.",
            "Patient must complete the Application form in the prescribed manner and get it signed/stamped by the treating doctor, Head of Department, and Medical Superintendent from the Government hospital where the patient is undergoing treatment",
            `After completing all documentation, the applicant/patient should submit the application form, along with the necessary documents, to the following -
Section Officer, Grants Section,
Ministry of Health & Family Welfare,
Room No. 541- A wing, Nirman Bhavan,
New Delhi-110011`,
            "Where?",
            "Out of 27 Regional Cancer Centres, 2 of the following are the empaneled centres in Maharashtra:",
            "R.S.T. Hospital & Research Centre, Nagaur, Maharashtra(TCCC)",
            "Tata Memorial Hospital Mumbai",
          ],
        },
        {
          heading: "Documents",
          content: [
            "To avail financial assistance under RAN, the patient is required to submit :",
            "Application form in prescribed proforma duly signed by the treating doctor and countersigned by the medical superintendent of the government hospital/institute.",
            "Copy of the income certificate",
            "Copy of the ration card",
            "Revolving funds have been set up in 13 central government hospitals/institutes and funds up to INR 50 lakhs (INR 90 lakhs in case of AIIMS, New Delhi) are placed at their disposal for providing treatment up to INR 2 lakhs in each case",
            "Cases involving treatment beyond INR 2 lakhs are referred to Ministry of Health and Family Welfare, Government of India, for providing funds",
          ],
        },
        {
          heading: "Cap",
          content: [
            "Powers are delegated to the Medical Superintendent/Director of the hospitals with revolving funds for providing treatment of up to INR 5 lakhs for eligible patients in each case",
            "More hospitals shall be added in the list of hospitals with revolving fund as and when such hospitals are identified by the Technical Committee",
            "Cases involving treatment beyond INR 5 lakhs in hospitals with revolving fund and all the cases for financial assistance from hospitals that do not have revolving fund will be referred to the Department of Health and Family Welfare, Government of lndia, for approval",
            "Funds shall be released to hospitals without revolving fund in respect of cases approved by the Department of Health and Family Welfare along with the sanction letter",
            "No separate funds will however be released to hospitals with revolving funds in respect of cases received in and approved by Departrment of Health and Family Welfare, involving treatment beyond 5 lakh and such expenditure will be met out of the revolving funds already assigned to that hospital",
            "Maximum financial assistance admissible under the Scheme will be INR 15 lakhs",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://main.mohfw.gov.in/sites/default/files/RAN_Guideline_2019.pdf",
          ],
        },
        {
          heading: "Helpline",
          content: ["23063481 and 23061731"],
        },
      ],
    },
    {
      title: "NGOs",
      section: [],
    },
    {
      title: "Indian Cancer Society - Cancer Cure Fund",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Family income should not exceed INR 4 lakhs per year",
            "Patient should be treated at ICS empanelled hospital only",
            "Patients should be registered under general category",
            "Projected survival rate- 50% for adult patients and 70% for pediatric patients",
            "Only for Indian citizens",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Process Flow:",
            "https://www.indiancancersociety.org/what-do-we-do/cancer-cure.aspx",
            "Where?",
            "Out of 17 empanelled hospitals, 2 are located in Maharashtra, namely:",
            "Tata Memorial Hospital, Mumbai",
            "BKL Walawalkar Hospital, Ratnagiri",
            "For the list of network hospitals click on the below link:",
            "https://www.indiancancersociety.org/what-do-we-do/cancer-cure.aspx",
          ],
        },
        {
          heading: "Cap",
          content: [
            "Minimum sanction INR 50,000/- & maximum sanction INR 5 lakhs.",
            "Upto INR 5 lakhs per patient and for Bone Marrow Transplant upto INR 8 lakhs",
          ],
        },
        {
          heading: "Remark",
          content: [
            "Covers following:",
            "Surgery",
            "Chemotherapy",
            "Radiation Therapy",
            "Prosthesis",
            "Supportive Care (Investigation charges including all the tests)",
            "Provides cahless support for 18 days",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://www.indiancancersociety.org/what-do-we-do/cancer-cure.aspx",
          ],
        },
      ],
    },

    {
      title: "Arun Kurkure Initiation and Treatment Fund (AKITF)",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Only for Indian citizens",
            "No discrimination on account of age, sex, or religion",
            "The patient must be registered as a general ward patient",
            "Family income not exceeding INR 4 lakhs per annum",
            "Initial treatment will be applicable only for cancer diagnosed patients",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Process Flow:",
            "https://www.indiancancersociety.org/what-do-we-do/cancer-cure.aspx",
            "Where?",
            "Total 12 hospitals are empnelled under this project, of which following 2 are situated in Maharashtra:",
            "BKL Walawalkar Hospital (BKL), Ratnagiri",
            "NH SRCC Children's Hospital (SRCC), Mumbai",
            "For the list of network hospitals click on the below link:",
            "https://www.indiancancersociety.org/what-do-we-do/cancer-cure.aspx",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Aadhar card of the patient (if pediatric patient, then Aadhar card of the one of the parents)",
            "Income proof that patient’s family income is not exceeding INR 4 lakhs per annum",
            "Registration page confirming patient's belonging to general category of the empanelled hospital",
            "Prescription of the treating doctor for initial diagnosis",
            "Cost certificate for the initial treatment from the treating doctor",
            "Photo of the patient",
          ],
        },
        {
          heading: "Cap",
          content: [
            "Maximum of INR 25,000/- per patient is sanctioned for the initial diagnosis and the initial treatment",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://www.indiancancersociety.org/what-do-we-do/cancer-cure.aspx",
          ],
        },
        {
          heading: "Helpline",
          content: [
            "Ann Rawat, Director - Cancer Cure",
            "Tel : +91-22-2412 1682",
          ],
        },
      ],
    },
  ],
  Punjab: [
    {
      title:
        "Punjab Government Employees and Pensioners Health Insurance Scheme (PGEPHIS)",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "All the serving and retired Punjab governement employees, including All India Services employees",
            "All dependent member (parents and children) are covered under the scheme, including new borns from the date of birth",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Employee/pensioner has to submit the enrollment form before the enrollment deadline to the respective DDO. The employement form can be downloaded here:",
            "https://punjabpolice.gov.in/News.aspx?Newsid=172&NewsTitle=Cashless%20%20Health%20Insurance%20Scheme%20for%20Punjab%20Government%20Employees%20",
            "Newly joined employee can submit enrollment form and is entitled to the benefits of the scheme from the date of joining.",
            "Photo ID card will be issue by the insurer/TPA which can be used at the time of hospitalization",
            "Deadline for the enrollment/renewal into the scheme is 31st Dec of every year",
            "Where?",
            "The employee/pensioner can avail the cashless benefit at the empanelled hopsital",
            "For list of empanelled hospital click on the link below",
            "http://mdindiaonline.com/pes/PEsproviderlist.aspx",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Copy of Photo I.D. Card",
            "Original Hospital bill with bill breakup details, Pharmacy bills with prescriptions",
            "Original reports with Laboratory Bills, and prescription for investigations",
            "Original Radiological Investigation reports with images",
            "Original or attested Discharge summary of the hospital with Date and Time of admission & discharge mentioned in it",
            "Claim form signed by the patient or the claimant",
            "Death certificate in death cases",
            "For the medicines purchased, the bills in original and prescription by the treating doctor/ hospital",
            "FIR or MLC report in accident, if the case has been registered with Local police station",
            "Bar codes, Batch Number and Invoices for the stents, implants, catheters etc",
          ],
        },
        {
          heading: "Cap (if any)",
          content: [
            "INR 3,00,000/- per year per family",
            "If INR 3,00,000/- is exhausted then the coverage of the family can be met through the buffer sum INR 25 crores available to all the beneficiary of the scheme",
            "In case INR 25 crores buffer is also exhausted then the over and above expense shall be met by the state government as per medical reimbursement policy",
          ],
        },
        {
          heading: "Remark",
          content: [
            `The employee/pensioner can avail the cashless benefit at the empanelled hopsital. The benefits include:`,
            "All in patient incurred at the time of treatment",
            "All pre-exisiting diseases even before the policy began",
            "Covers 7 days -Pre Hospitalization & upto 30 days Post Hospitalization",
            "The list of day care procedures except OPD services mentioned in the pdf:",
            "https://highcourtchd.gov.in/sub_pages/left_menu/Downloads/forms/scheme.pdf",
            "Materity benefit for first 2 children arising from childbirth including Normal Delivery/Caesarean Section including miscarriage or abortion induced by accident or other medical emergency",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://highcourtchd.gov.in/sub_pages/left_menu/Downloads/forms/scheme.pdf",
            "http://www.mdindiaonline.com/pes/pesmain.aspx",
          ],
        },
        {
          heading: "Helpline",
          content: ["104", "1800-233-5557"],
        },
        {
          heading: "Mail ID for queries",
          content: [
            "authorisation_pgephis@mdindia.com",
            "customercare_pgephis@mdindia.com",
          ],
        },
      ],
    },

    {
      title: "Bhagat Puran Singh Sehat Bima Yojna",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Blue card holder (farmers) families are eligible for the scheme",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "The beneficiary can avail cashless treatment at any of the empanelled government or private hospital.",
            "Where?",
            "About 214 private hospitals are empanelled. The list can be found on the link below:",
            "https://phsc.punjab.gov.in/sites/default/files/2019-08/19201532050209PrivateHospitalBPSSBY.pdf",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Smart card will be issued by the insurer/TPA which need to be produce at the time of hospitalization",
          ],
        },
        {
          heading: "Cap (if any)",
          content: [
            "INR 50,000/- per year per family",
            "INR 100/- transport allowance for hospitalization will be paid in cash at the time of discharge",
            "Additional top up cover of INR 5 lakh for accidental death and total permanent disability",
          ],
        },
        {
          heading: "Remark",
          content: [
            "https://phsc.punjab.gov.in/sites/default/files/2019-08/212015121432840PROCEEDINGS21.12.2015.pdf",
            "https://phsc.punjab.gov.in/en/Bhagat-Puran-Singh-Sehat-Bima-Yojna",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://phsc.punjab.gov.in/sites/default/files/2019-08/212015121432840PROCEEDINGS21.12.2015.pdf",
          ],
        },
        {
          heading: "Helpline",
          content: ["1800-233-5758"],
        },
        {
          heading: "Mail ID for queries",
          content: ["NA"],
        },
      ],
    },

    {
      title: "Mukh Mantri Punjab Cancer Raahat Kosh Scheme",
      sections: [
        {
          heading: "Eligibility",
          content: ["All cancer patients of the Punjab State"],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Fill and submit the application form to the district civil surgeon with the following documents:",
            "2 passport size photographs",
            "Residence proof",
            "Copy of lab reports",
            `Copy of details of previous treatment`,
            "Self declaration",
            "Concerned hospital should fill the estimated amount for further treatment",
            "For more information about the process and document, please click on the link below",
            "https://mmpcrk.gov.in/SOPs.pdf",
            "Where?",
            "The list of 9 government and 10 private empanelled hospitals are given in the link below:",
            "https://mmpcrk.gov.in/Empaneled%20Hospitals.pdf",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Web Application / Software has been developed for Mukh Mantri Punjab Cancer Raahat Kosh. Documents are to be filled online on the empanelled hospital website.",
            "https://mmpcrk.gov.in/SOPs.pdf",
          ],
        },
        {
          heading: "Cap (if any)",
          content: ["INR 1.50 Lakhs"],
        },
        {
          heading: "Remark",
          content: [
            "Exclusion include Government employees, ESI employees and their dependents, those patients who have any kind of facility of medical reimbursement or any other persons who have opted for Health Insurance by Insurance companies.",
          ],
        },
        {
          heading: "Reference",
          content: ["https://mmpcrk.gov.in/", "https://mmpcrk.gov.in/SOPs.pdf"],
        },
        {
          heading: "Helpline",
          content: ["0172-5012356"],
        },
        {
          heading: "Mail ID for queries",
          content: ["cancercontrolcellpunjab@yahoo.com"],
        },
      ],
    },
  ],
  "Tamil Nadu": [
    {
      title: "Amma Master Health Check-up",
      sections: [
        {
          heading: "Eligibility",
          content: ["First Come First Serve Basis"],
        },
        {
          heading: "Availability",
          content: [
            { type: "text", text: "How?" },
            "Candidate needs to pay to get checkup done. The amount is minimal and varies as per the scheme -",
            {
              type: "list",
              items: [
                "Amma Gold Scheme: INR 1000/-",
                "Amma Diamond Scheme: INR 2000/-",
                "Amma Platinum Scheme: INR 3000/-",
              ],
            },
            { type: "text", text: "Where?" },
            "Apply online",
          ],
        },
        {
          heading: "Documents",
          content: ["Any ID"],
        },
        {
          heading: "Cap (if any)",
          content: ["NA"],
        },
        {
          heading: "Remark",
          content: [
            "Payment Mode Cash Only The Scheme includes all medical check-ups which will be done at a nominal rate. Tests include cholesterol, liver function test, X-Ray, USG-abdomen, Echo-cardiogram and HbA1C.",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://web.archive.org/web/20210115134223/http://mmcmhc.in/",
          ],
        },
        {
          heading: "Helpline",
          content: ["044 - 2530 5000"],
        },
      ],
    },

    {
      title: "MRMBS scheme: Dr Muthulakshmi Reddy Meternity Benefit Scheme",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "All poor pregnant women",
            "Pregnant mother of and above 19 years of age",
            "Mothers delivered at Private Medical College approved under Dr.MRMBS Scheme after providing free delivery services including caesarean deliveries.",
            "Srilankan refugees- pregnant women are eligible",
            "The pregnant women who are members of Farmers Social Security Scheme",
            "Maternity assistance is provided for only two deliveries. However HOB (higher order birth) mothers are eligible for first and fifth instalments and also for two nutrition kits",
            "Migrant mothers in brick kilns, quarries, road works, construction sites and other infrastructure development projects are eligible for 1st and 5th instalments and nutrition kits only",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Taking treatment at government health facilities",
            "The Pregnant mother should register her pregnancy before 12 weeks with the VHN / UHN or she should have pre – registered her pregnancy before 12 weeks.",
            "Where?",
            "All PCH/BPHC/GH/DHQ/med college",
            "All VHN/UHN and PHC/UPHC",
          ],
        },
        {
          heading: "Documents",
          content: ["Aadhar card and ration card"],
        },
        {
          heading: "Cap (if any)",
          content: ["INR 18000/- in 5 installments"],
        },
        {
          heading: "Remark",
          content: [
            "Nutrition kit worth INR 2000/- includes:",
            {
              type: "table",
              headers: ["Quantity", "Item"],
              rows: [
                ["2", "Pregnant Mother’s Health Mix Powder (500 gms)"],
                ["3", "IFA Syrup (Iron Syrup 200 ml)"],
                ["2", "Deseeded Date Fruit (500 gms)"],
                ["1", "Food Grade Plastic Cup"],
                ["1", "Plastic Basket with Two handles"],
                ["1", "Albendazole De-worming Tablet"],
                ["1", "Aavin Ghee 500 ml (Non-tendered Product)"],
                ["1", "Cotton Towel"],
              ],
            },
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://picme.tn.gov.in/picme_public/mrmbs.pdf",
            "https://krishnagiri.nic.in/scheme/dr-muthulakshmi-maternity-benefit-scheme/",
          ],
        },
        {
          heading: "Helpline",
          content: ["NA"],
        },
      ],
    },

    {
      title: "Janani Suraksha Yojana",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Pregnant women irrespective of the age of mother & number of children for giving birth in a government or accredited private health facility.",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Filling form online or offline by ANM/ASHA/AWW or any link worker atleast 20-24 weeks before the expected date of delivery.",
            "Where?",
            "Low Performing State (LPS)- All pregnant women delivering in Government health centres like Sub-centre, PHC/CHC/ FRU / general wards of District and state Hospitals or accredited private institutions",
            "High Performing State (HPS)- BPL pregnant women, aged 19 years and above",
            "LPS & HPS- All SC and ST women delivering in a government health centre like Sub-centre, PHC/CHC/ FRU / general ward of District and state Hospitals or accredited private institutions",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Aadhar card",
            "Delivery certificate",
            "JSY card",
            "Mobile number",
            "Address proof",
            "BPL Ration Card",
            "Passport-size photo",
            "Bank details, etc.",
          ],
        },
        {
          heading: "Cap (if any)",
          content: [
            "Mother's package for LPS:",
            "Rural areas is INR 1400/-",
            "Urban areas is INR 1000/-",
            "Mother's package for HPS:",
            "Rural areas is INR 700/-",
            "Urban areas is INR 600/-",
            "ASHA’s package for rural areas is INR 400/- (both LPS and HPS)",
            "ASHA’s package for urban areas is INR 400/- (both LPS and HPS)",
          ],
        },
        {
          heading: "Remark",
          content: [
            "ASHA package of INR 600/- in rural areas include INR 300/- for ANC component and INR 300/- for facilitating institutional delivery",
            "ASHA package of INR 400/- in urban areas include INR 200/- for ANC component and INR 200/- for facilitating institutional delivery",
          ],
        },
        {
          heading: "Reference",
          content: [
            "https://nhm.gov.in/index1.php?lang=1&level=3&lid=309&sublinkid=841",
            "https://nhm.gov.in/WriteReadData/l892s/97827133331523438951.pdf",
            "https://www.ilo.org/dyn/travail/docs/683/JananiSurakshaYojanaGuidelines/MinistryofHealthandFamilyWelfare.pdf",
          ],
        },
        {
          heading: "Helpline",
          content: ["NA"],
        },
      ],
    },
    {
      title:
        "CMCHIS: Chief Ministers Comprehensive Health Insurance Scheme/ABPMJAY",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Family whose annual income is less than INR 1.2 lakhs per annum",
            "Family includes the eligible member and the members of his/her family as detailed below:",
            "Legal Spouse of the eligible person",
            "Children of the eligible person",
            "Defendant parent of the eligible person",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Apply and get the insurance scheme for the family",
            "To be eligible, produce family card and Income certificate by the VAO/Revenue authorities along with the self declaration of the head of the concerned family",
            "Avail the enrollment form using the following link:",
            "http://cmchistn.com/entrollement/EnrolmentForm2022.pdf",
            "Where?",
            "Total 1090 procedures, 8 follow up procedures and 52 diagnostic procedures are covered under CMCHIS in 800 Government 900 Private empanelled hospitals.",
            "To get the list of empanelled hospitals, click below:",
            "https://cmchistn.com/covid_empanlled_hospital.php",
            "To get the list of procedures, click on the following link:",
            "https://www.cmchistn.com/prate.php",
          ],
        },
        {
          heading: "Documents",
          content: [
            "Along with the application form, the family head/member should carry :-",
            "Original Ration Card plus photocopy",
            "Aadhar of all members to be included under the card",
            "Original income certificate",
          ],
        },
        {
          heading: "Cap (if any)",
          content: [
            "The state will cover INR 5 lakhs per family per year for all eligible secondary and tertiary care hospitalization through CMCHIS in association with PMJAY.",
          ],
        },
        {
          heading: "Remark",
          content: [
            "State will release the state share of actuals of the claim, up to INR 5 lakhs, and additional claims for certain ailments will be decided as per the policy as higher end claims.",
          ],
        },
        {
          heading: "Reference",
          content: ["https://www.cmchistn.com/contact.php"],
        },
        {
          heading: "Helpline",
          content: ["18004253993"],
        },
      ],
    },
    {
      title: "Amma Arokiya Thittam",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "Men and women aged 30 years & aboveMen and women aged 30 years & above",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "Annual basic health check-up in which 25 parameters will be checked.",
            "Where?",
            "PHCs, 3 Government Hospitals and Mannargudi UPHC every week on Thursdays and Fridays",
          ],
        },
        {
          heading: "Documents",
          content: ["NA"],
        },
        {
          heading: "Cap (if any)",
          content: ["NA"],
        },
        {
          heading: "Remark",
          content: ["NA"],
        },
        {
          heading: "Reference",
          content: ["https://tiruvarur.nic.in/departments/ddhs/"],
        },
        {
          heading: "Helpline",
          content: ["NA"],
        },
      ],
    },
    {
      title: "New health insurance scheme for employees",
      sections: [
        {
          heading: "Eligibility",
          content: [
            "All the govt employees. The following members of the family of the employee shall be covered under the scheme",
            "Legal spouse of the employee",
            "Children of the employee - till they get employed or married or attain the age of 25 years whichever is earlier and dependent on the employee",
            "The parents of the employee, in the case of unmarried employee until the employee gets married",
          ],
        },
        {
          heading: "Availability",
          content: [
            "How?",
            "By producing the identity card issued by the insurance company or by production of the certificate as in annexure III (link to which is given below) issued by the Pay Drawing Officer which will be valid upto issue of identity card by the insurance company as the case may be.",
            "https://www.tn.gov.in/dtp/gopdf/8_94.pdf",
            "Where?",
            "Insurance Scheme can get admitted in any one of the hospitals covered under the scheme as per list of hospitals notified by the Star Health and Allied Insurance Company through their department with documents of the treatment.",
          ],
        },
        {
          heading: "Documents",
          content: ["Employee ID, aadhaar card, and medical bills"],
        },
        {
          heading: "Cap (if any)",
          content: [
            "Monthly INR 10/- as subscription, and claim of INR 1 lakh or 75% of the expense which ever is less",
          ],
        },
        {
          heading: "Remark",
          content: [
            "Refer to the annexure 1V of the following link for the list of diseases, surgeries and treatments covered under the scheme.",
            "https://www.tn.gov.in/dtp/gopdf/8_94.pdf",
          ],
        },
        {
          heading: "Reference",
          content: ["https://www.tn.gov.in/scheme/data_view/6787"],
        },
        {
          heading: "Helpline",
          content: ["NA"],
        },
      ],
    },
  ],
};

export default function StateSupportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StateSupportContent />
    </Suspense>
  );
}

function StateSupportContent() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const state = params.get("state") || "Assam";
  const schemes = stateSchemes[state];
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleItem = (key) => {
    setOpenIndexes((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
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
                                      )
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
                                          )
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
                                              )
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
                                                      /(https?:\/\/[^\s]+)/g
                                                    )
                                                    .map((part, i) =>
                                                      part.startsWith(
                                                        "http"
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
                                                      )
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
