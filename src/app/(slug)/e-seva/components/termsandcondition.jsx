import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

const TermsAndConditionOnSubmission = () => {
  return (
    <Dialog>
      <DialogTrigger>
        Please Agree to our{" "}
        <span className="text-blue-600 underline font-semibold ml-0">
          Terms and Conditions
        </span>
      </DialogTrigger>
      <DialogContent className="bg-white h-[400px] overflow-auto font-poppins ">
        <DialogHeader>
          <DialogTitle>Patient Data Protection and Usage Policy</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mb-2">
            <strong>1. Purpose</strong>
          </p>
          <p className="mb-2">
            This policy sets out rules and obligations regarding the collection, storage, access, and usage of patient data. It ensures compliance with applicable laws of India, including the Information Technology Act, 2000 (IT Act), the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP Act).
          </p>

          <p className="mb-2">
            <strong>2. Scope</strong>
          </p>
          <p className="mb-2">
            This policy applies to all employees, contractors, vendors, consultants, and third parties who may have access to patient data.
          </p>

          <p className="mb-2">
            <strong>3. Patient Data Definition</strong>
          </p>
          <p className="mb-2">
            “Patient Data” includes but is not limited to:
          </p>
          <ul className="mb-2">
            <li>Name, age, gender, contact details</li>
            <li>Medical history, diagnosis, treatment records</li>
            <li>Lab reports, prescriptions, imaging data</li>
            <li>Aadhaar number, insurance details, or any government-issued ID linked to health services</li>
          </ul>
          <p>This is classified as Sensitive Personal Data under Indian law.</p>

          <p className="mb-2">
            <strong>4. Rules for Use of Patient Data</strong>
          </p>
          <ol className="mb-2">
            <li>Patient Data shall only be used for the purpose for which it is collected (treatment, billing, or government compliance).</li>
            <li>Any unauthorized sharing, selling, or disclosure of patient data is strictly prohibited.</li>
            <li>Access to data shall be strictly role-based and limited to authorized personnel only.</li>
            <li>Data must not be stored on personal devices without prior written approval.</li>
            <li>Data shall not be transferred outside India without compliance with the DPDP Act and other government regulations.</li>
          </ol>

          <p className="mb-2">
            <strong>5. Confidentiality Obligations</strong>
          </p>
          <ul className="mb-2">
            <li>All users accessing patient data must sign a Confidentiality and Non-Disclosure Agreement (NDA).</li>
            <li>Passwords, access codes, or system credentials must not be shared.</li>
            <li>Data access will be monitored and logged.</li>
          </ul>

          <p className="mb-2">
            <strong>6. Internal Disciplinary Procedures for Misuse</strong>
          </p>
          <p>If any employee, contractor, or vendor is found misusing patient data, the following internal actions may be taken, depending on severity and intent:</p>
          <p><strong>For Employees:</strong></p>
          <ul className="mb-2">
            <li>Verbal or written warning for minor first-time violations.</li>
            <li>Salary deduction or internal fine (as decided by management).</li>
            <li>Suspension from duties pending investigation.</li>
            <li>Termination of employment with immediate effect in case of serious breaches.</li>
            <li>Filing of criminal complaint with police authorities under IT Act/DPDP Act for severe misuse.</li>
          </ul>
          <p><strong>For Vendors / Contractors / Third Parties:</strong></p>
          <ul className="mb-2">
            <li>Written warning and requirement of corrective measures.</li>
            <li>Imposition of contractual fines/penalties as per agreement.</li>
            <li>Suspension of services until compliance is ensured.</li>
            <li>Blacklisting from future contracts and engagements.</li>
            <li>Legal action for damages and breach of contract.</li>
          </ul>
          <p><strong>For Consultants / Interns / Temporary Staff:</strong></p>
          <ul className="mb-2">
            <li>Termination of engagement with immediate effect.</li>
            <li>Reporting to respective institutions/organizations in case of academic or internship violations.</li>
            <li>Legal consequences for severe breaches.</li>
          </ul>

          <p className="mb-2">
            <strong>7. Legal Penalties under Indian Law</strong>
          </p>
          <p>In addition to internal disciplinary actions, offenders may also face:</p>
          <ul className="mb-2">
            <li>Civil liability: Compensation to affected patients as per IT Act and DPDP Act.</li>
            <li>Criminal liability: Section 72A of the IT Act prescribes up to 3 years’ imprisonment and/or fine up to ₹5,00,000.</li>
            <li>DPDP Act, 2023 penalties: Financial penalties up to ₹250 crore for serious violations.</li>
          </ul>

          <p className="mb-2">
            <strong>8. Reporting Breach</strong>
          </p>
          <p>Any suspected misuse or breach of patient data must be reported immediately to the Data Protection Officer (DPO).</p>

          <p className="mb-2">
            <strong>9. Review & Compliance</strong>
          </p>
          <p>This policy will be reviewed periodically and updated as per changes in government regulations. All staff and vendors must undergo regular training on data privacy and protection.</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionOnSubmission;