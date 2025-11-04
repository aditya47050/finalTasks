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
          <DialogTitle>Personal Information & Medical Data Consent</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mb-2">
            <strong>Introduction</strong>
          </p>
          <p className="mb-2">
            Thank you for choosing to Aaogya Aadhar provides us with your
            personal data & medical data. This document is intended to outline
            the terms under which your information will be collected, used, and
            protected. By signing or agreeing to this form, you acknowledge and
            agree to the conditions set forth below.
          </p>

          <p className="mb-2">
            <strong>1. Purpose of Data Collection</strong>
          </p>
          <p className="mb-2">The information you provide will be used to:</p>
          <ul className="mb-2">
            <li>Access and manage your health condition(s)</li>
            <li>
              Provide personalized recommendations, services, or treatment
              options
            </li>
            <li>
              Conduct medical research or analysis (if applicable and with
              de-identification of data)
            </li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>

          <p className="mb-2">
            <strong>2. Types of Data Collected</strong>
          </p>
          <p className="mb-2">
            The medical data that may be collected includes, but is not limited
            to:
          </p>
          <ul className="mb-2">
            <li>
              Personal identification information (e.g., Aadhar, PAN, KYC, name,
              date of birth, gender, all types of Government authorised
              documents for medical financial help during emergency*)
            </li>
            <li>
              Medical history (e.g., past diagnoses, treatments, medications,
              health insurance)
            </li>
            <li>
              Test results (e.g., lab work, imaging reports, health medical
              records)
            </li>
            <li>Symptoms, Medications, or Treatment plans</li>
            <li>Contact information (e.g., phone numbers, email address)</li>
          </ul>

          <p className="mb-2">
            <strong>3. Use of Data</strong>
          </p>
          <p className="mb-2">
            Your medical data will be used for the following purposes:
          </p>
          <ul className="mb-2">
            <li>Diagnosis and Treatment decisions</li>
            <li>Improving healthcare services and patient care in India</li>
            <li>
              Research and educational purposes (with de-identified data unless
              otherwise specified)
            </li>
            <li>
              Compliance with applicable laws, regulations, and medical
              standards
            </li>
          </ul>

          <p className="mb-2">
            <strong>4. Data Sharing and Disclosure</strong>
          </p>
          <p className="mb-2">Your medical data statics may be shared with:</p>
          <ul className="mb-2">
            <li>
              Healthcare providers involved in your care (e.g., patients doctors, nurses,
              specialists, research companies, government, HSP’s)
            </li>
            <li>
              Third-party vendors or partners who assist with the management of
              medical records (with appropriate safeguards)
            </li>
            <li>
              Research institutions or organizations (only in anonymised form,
              if applicable)
            </li>
            <li>
              Regulatory authorities or government bodies as required by law
            </li>
          </ul>

          <p className="mb-2">
            <strong>5. Data Protection</strong>
          </p>
          <p className="mb-2">
            We are committed to safeguarding your personal and medical
            information. We will employ technical, administrative, and physical
            safeguards to protect your data from unauthorized access, use, or
            disclosure.
          </p>

          <p className="mb-2">
            <strong>6. Voluntary Participation and Withdrawal</strong>
          </p>
          <p className="mb-2">
            Your participation is entirely voluntary. You may choose not to
            provide certain medical information, but please understand that this
            may affect the quality of care or services you receive. You have the
            right to withdraw consent at any time by contacting us. Withdrawal
            will not affect the legality of any data processing carried out
            prior to your withdrawal.
          </p>

          <p className="mb-2">
            <strong>7. Duration of Data Retention</strong>
          </p>
          <p className="mb-2">
            Your medical data will be retained for the duration necessary to
            fulfill the purposes outlined in this form and in compliance with
            applicable laws and regulations.
          </p>

          <p className="mb-2">
            <strong>8. Rights and Access to Data</strong>
          </p>
          <p className="mb-2">You have the right to:</p>
          <ul className="mb-2">
            <li>
              Access your medical data upon request (e.g., you, patients doctors, nurses,
              specialists, research companies, government, HSP’s)
            </li>
            <li>Request corrections to any inaccuracies in your data</li>
            <li>
              Request the deletion of your data, subject to legal and medical
              constraints
            </li>
            <li>
              Ask questions or voice concerns regarding how your data is used
            </li>
          </ul>

          <p className="mb-2">
            <strong>9. Consent</strong>
          </p>
          <p className="mb-2">
            By digital acceptance terms & conditions and signing this form or
            providing your data, you consent to the collection, use, and sharing
            of your medical data as outlined in this document.
          </p>
          <p className="mb-2">
         For more details <Link href="/terms-and-conditions" className="underline text-blue-700 ">Terms and Conditions</Link> and  <Link href="/privacy" className="underline text-blue-700 ">Privacy Policy</Link>
          </p>
          <p className="mb-2">
            <strong>Signatures</strong>
          </p>
          <p className="mb-2">
            I, understand and agree to the terms and conditions outlined in this
            Personal & Medical Data Consent Form. I acknowledge that I have had
            the opportunity to ask questions and that my consent is voluntary.
          </p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionOnSubmission;
