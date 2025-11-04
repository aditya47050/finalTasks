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

const HspPolicyAgree = () => {
  const TermsAndCondition = [
    {
      no: "A",
      title:
        "HSP’s wishes to avail the services of Aarogya Aadhar, subject to the terms and conditions set out hereinafter, which includes inter alias, warranties provided by the Parties, obligations, intellectual property rights, confidentiality, responsibilities of the Parties and grounds for termination of Parties contract.",
      submenu: [
        {
          title:
            "1.	Kindly read all the terms of this MOU carefully before availing services from Aarogya Aadhar. If you do not agree with any of the term of this MOU, you may not avail the services provided / furnished by the Aarogya Aadhar as well as you shall not sign this MOU in that case.",
        },
        {
          title:
            "2.	By availing Aarogya Aadhar’s services and by signing this MOU, you shall be contracting with Aarogya Aadhar and you signify your acceptance to this entire MOU from the Effective Date (the date on which on which the HSP / authorized person of HSP signs digitally or otherwise this MOU) and also create legally binding arrangements to abide by the same. This MOU shall thereon have full force of a contract and shall bind both HSP and Aarogya Aadhar.",
        },
      ],
    },
    {
      no: "B",
      title:
        "The terms mentioned in this MOU are subject to modifications and Aarogya Aadhar reserves every right to modify or change the MOU terms at any time by posting changes with intimation to HSP. However, you shall, at all times, be responsible for regularly reviewing the MOU terms and note the changes made. Aarogya Aadhar will notify about the changes and HSP has to confirm within 30 days. Your continued usage of the services provided by Aarogya Aadhar after any change is intimated to you, constitute your acceptance of the amended MOU terms. HSP also has right to move out of the Aarogya Aadhar platform after proper intimation and settlement of pending bills.",
    },

    {
      no: "C",
      title: "The HSP hereby Assures, Acknowledges and Agrees that -",
      submenu: [
        {
          title:
            "1. The HSP represents, warrants and assures that, HSP is engaged into the business of including but not limited to healthcare etc. and HSP is furnishing the services to patients as described in the services catalog of the Aarogya Aadhar Platform.",
        },
        {
          title:
            "2. The HSP represents, warrants and assures that, the HSP is working and furnishing Healthcare services under the name and style of brand this name.",
        },
        {
          title:
            "3. The HSP represents, warrants and assures that, HSP has obtained all the necessary permissions, licenses from the concern authorities to carry on the aforementioned business as well as to furnish all the aforementioned services. The HSP also represents, warrants and assures that HSP is fully in compliance with the applicable laws of the country.",
        },
        {
          title:
            "4. HSP holds, at all times during providing their services to patients / prospective patients all permissions from concerned authorities, licenses and / or necessary licenses under all applicable laws, statutes and regulations for it to carry out its business. HSP shall furnish clear photocopies of all the necessary licenses, certificates, letters and permissions to the Aarogya Aadhar.",
        },
        {
          title:
            "5. HSP & Aarogya Aadhar will be transparent on final charges to the patients coming through Aarogya Aadhar platform. HSP will share final charges to Aarogya Aadhar. Any breach of this can lead to the penalty to HSP.",
        },
        {
          title:
            "6. The HSP warrants and assures the Aarogya Aadhar that, all the information, documents, material, along with this MOU and other relevant content provided by the HSP to the Aarogya Aadhar are true, correct, accurate and bona-fide.",
        },
        {
          title:
            "7. HSP is the sole author of, owns or otherwise controls all content provided to Aarogya Aadhar or has been granted the right to use such content / information from the rights holder and does not violate or infringe the rights of any third party or applicable laws.",
        },
        {
          title:
            "8. HSP has full power and capacity to enter in to and perform its obligations under this MOU and has taken all necessary corporate and other actions to authorize the execution and performance thereof, mere availing the Services provided by the Aarogya Aadhar will constitute valid and binding obligations on and against it, in accordance with its terms.",
        },
        {
          title:
            "9. HSP hereby grants to Aarogya Aadhar a non-exclusive, non-transferable, worldwide, royalty free right to use, copy, publish and display the HSP trademarks, logos, name related information solely in connection with the promotion and marketing of the collaboration between HSP and Aarogya Aadhar.",
        },
      ],
    },
    {
      no: "D",
      title: "Terms & Conditions for Services provided by Aarogya Aadhar -",
      submenu: [
        {
          title:
            "1. Aarogya Aadhar is operating an online marketplace and only assumes a role of facilitator between HSP and Patient/Prospective patients...",
        },
        {
          title:
            "2. Aarogya Aadhar merely showcases, displays, presents, shows the services and facilities provided by the HSP to the patients or prospective patients with due permission...",
        },
        {
          title:
            "3. Aarogya Aadhar shall be entitled to display stipulated services (as per details provided and verified by HSP) on best effort basis...",
        },
        {
          title:
            "4. Aarogya Aadhar does not assure a complete sustainability of its services and shall not be held responsible or liable...",
        },
        {
          title:
            "5. Aarogya Aadhar is only providing a platform for communication and it is agreed that the contract or transactions for services shall be strictly bipartite...",
        },
        {
          title:
            "6. Aarogya Aadhar does not have any control or does not determine or advice or in any way involve itself in the offering or acceptance of such commercial / contractual terms...",
        },
        {
          title:
            "7. Aarogya Aadhar neither make any representation or warranty as to specifics (such as quality, value, stability, etc.) of the products or services...",
        },
        {
          title:
            "8. Aarogya Aadhar does not make any representation or warranty as to the services, facilities, other assistance of any of the HSP...",
        },
        {
          title:
            "9. Aarogya Aadhar is not responsible for any non-performance or breach of the any contract entered into by HSP and patients / prospective patients...",
        },
        {
          title:
            "10. HSP shall be solely responsible to reimburse or refund and/or absolve the charges of the services for which patients / prospective patients are unsatisfied...",
        },
        {
          title:
            "11. Please note that there could be risks in dealing with underage persons or people acting under false pretense...",
        },
        {
          title:
            "12.	If a HSP (Healthcare Service Provider) is not providing proper healthcare services to a patient and is hiding or misrepresenting information from patient & on the Aarogya Aadhar Portal, it could face legal and financial penalties. The consequences may include:",
          insubtitle: [
            {
              title:
                "a)	Fines & Penalties – The HSP may be subject to fines as per the Clinical Establishments Act, Consumer Protection Act, or other healthcare regulations.",
            },
            {
              title:
                "b)	License Suspension or Cancellation – Authorities may revoke or suspend the HSP’s license if serious violations are found.",
            },
            {
              title:
                "c)	Legal Action – The patient or their family can file a case under the Consumer Protection Act, 2019 for deficiency in service.",
            },

            {
              title:
                "d)	Blacklisting – The HSP may be blacklisted from Aarogya Aadhar Portal, Government Authority, Government schemes.",
            },
            {
              title:
                "e)	Compensation to the Patient – The HSP may be ordered to pay compensation for negligence or misinformation.",
            },
            {
              title:
                "f)	Criminal Liability – If the concealment of information leads to serious harm or death, the HSP could face criminal charges under IPC sections related to medical negligence and fraud.",
            },
            {
              title: "•	What You Can Do:",
              ininsubtitle: [
                {
                  title:
                    "1.	File a Complaint: Submit a complaint to the State Health Authority, Aarogya Aadhar Portal, or Consumer Forum.",
                },
                {
                  title:
                    "2.	Legal Action: Approach the Consumer Court or Medical Council of India (MCI).",
                },
                {
                  title:
                    "3.	Media & RTI: Raise awareness through media or RTI applications.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      no: "E",
      title: "HSP represents, warrants and covenants that:",
      submenu: [
        {
          title:
            "1. HSP shall at all times offer their services, products, facilities that are best qualities and best for human beings, comply with all safety measures...",
        },
        {
          title:
            "2. HSP shall at all times comply with all relevant laws, bye-laws, rules, regulations, orders, notifications...",
        },
        {
          title:
            "3. HSP shall settle any pricing dispute, Cancellation, refunds of patients...",
        },
        {
          title:
            "4. HSP understands that, Aarogya Aadhar shall not be liable, under any event, for any comments or feedback given by any of the Patients...",
        },
        {
          title:
            "5. It shall adhere to and comply with the payment schedules, policies, norms of services and timelines...",
        },
        {
          title:
            "6. It shall process and execute the appointments promptly, correctly and within the stipulated service level timelines...",
        },
        {
          title:
            "7. Notwithstanding these terms and conditions of Service, Aarogya Aadhar reserves the right to temporarily discontinue Services...",
        },
      ],
    },
    {
      no: "F",
      title:
        "This contract is valid for the duration of 1 year from the date of signing of this agreement by HSP...",
    },
    {
      no: "G",
      title:
        "Patients (new or existing patient of the HSP) routed through Aarogya Aadhar application or counselled by Aarogya Aadhar will be considered as Aarogya Aadhar patients only.",
    },
    {
      no: "H",
      title:
        "Either Party can terminate this contract providing 30 days’ prior written notice to the other Party...",
    },
    {
      no: "I",
      title:
        "Notwithstanding anything contained herein, the responsibility and liability in relation to aforementioned claims or declarations shall solely rest with the HSP...",
    },
    {
      no: "J",
      title:
        "HSP gives minimum 10% discount to Aarogya Aadhar patients on the every final bill amount received by HSP for patient.",
    },
    {
      no: "K",
      title:
        "HSP gives minimum 20% discount to Aarogya Aadhar patients on the Lab & Diagnostic test on final bill amount received by HSP for patient.",
    },
  ];
  return (
    <Dialog>
      <DialogTrigger>
        Please Agree -{" "}
        <span className="text-blue-600 underline font-semibold ml-0">
          HSP Policy Documents by Aarogya Aadhar
        </span>
      </DialogTrigger>
      <DialogContent className="bg-white h-[400px] max-w-4xl overflow-auto font-poppins ">
        <DialogHeader></DialogHeader>
        <DialogDescription>
          <div className="mx-auto container text-justify p-6 font-poppins max-w-6xl ">
            <div className="max-w-3xl mx-auto rounded-xl p-2">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                HSP Policy Documents by Aarogya Aadhar
              </h2>

              <p className="text-gray-700 text-lg">
                This <strong>Memorandum of Understanding (MOU)</strong> is
                issued in favor of:
              </p>

              {/* Company Details Section */}
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border">
                <h3 className="text-xl font-semibold text-gray-800">
                  Livo AarogyaAadhar Private Limited
                </h3>
                <p className="text-gray-600 mt-2">
                  <strong>CIN:</strong> U86201PN2023PTC219864
                </p>
                <p className="text-gray-600">
                  <strong>Registered Address:</strong> 18, Yashwant Nagar, Range
                  Hill Road, Front of Bank of Baroda, Pune, Maharashtra, India -
                  411007.
                </p>
              </div>

              {/* Description */}
              <p className="mt-6 text-gray-700">
                Here, in, after referred to as <strong>“Aarogya Aadhar”</strong>{" "}
                in pursuance of our final discussions, negotiations, and intent
                to avail valuable services/ assistance being provided by Aarogya
                Aadhar.
              </p>

              {/* Parties Section */}
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border">
                <p className="text-gray-800">
                  <strong>HSP & Aarogya Aadhar</strong> shall be individually
                  referred to as
                  <strong> “Party”</strong> and collectively as{" "}
                  <strong>“Parties”</strong>.
                </p>
              </div>

              {/* Definitions */}
              <p className="mt-6 text-gray-700">
                The term <strong>“you”</strong>, <strong>“your”</strong> shall
                refer to
                <strong> HSP</strong>. The terms <strong>“we”</strong>,{" "}
                <strong>“us”</strong>, and <strong>“our”</strong> shall refer to{" "}
                <strong>Aarogya Aadhar</strong>.
              </p>
            </div>

            {TermsAndCondition.map((term, index) => (
              <div key={index} className="mb-8 mt-6">
                <h2 className="lg:text-[14px] text-[12px] text-gray-800 mb-4">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${term.no}. ${term.title}`,
                    }}
                  />
                </h2>
                {term.submenu &&
                  term.submenu.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      className="pl-6 border-l-4 border-gray-300 mb-6"
                    >
                      <h3 className="lg:text-[14px] text-[12px] text-gray-800 mb-3">
                        <span dangerouslySetInnerHTML={{ __html: sub.title }} />
                      </h3>
                      {sub.insubtitle &&
                        sub.insubtitle.map((inSub, inSubIndex) => (
                          <div
                            key={inSubIndex}
                            className="pl-6 border-l-4 border-gray-300 mb-4"
                          >
                            <h4 className="lg:text-[12px] text-[10px] font-medium text-gray-800 mb-2">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: inSub.title,
                                }}
                              />
                            </h4>
                            {inSub.ininsubtitle &&
                              inSub.ininsubtitle.map(
                                (inInSub, inInSubIndex) => (
                                  <div
                                    key={inInSubIndex}
                                    className="pl-6 border-l-4 border-gray-200 mb-4"
                                  >
                                    <p className="lg:text-[12px] text-[10px] text-gray-800 leading-relaxed mb-2">
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: inInSub.title,
                                        }}
                                      />
                                    </p>
                                    {inInSub.inininsubtitle &&
                                      inInSub.inininsubtitle.map(
                                        (inInInSub, inInInSubIndex) => (
                                          <div
                                            key={inInInSubIndex}
                                            className="pl-6 border-l-4 border-gray-200 mb-4"
                                          >
                                            <p className="lg:text-[16px] text-[12px] text-gray-800 leading-relaxed mb-2">
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: inInInSub.title,
                                                }}
                                              />
                                            </p>
                                            {inInInSub.ininininsubtitle &&
                                              inInInSub.ininininsubtitle.map(
                                                (
                                                  inInInInSub,
                                                  inInInInSubIndex
                                                ) => (
                                                  <div
                                                    key={inInInInSubIndex}
                                                    className="pl-6 border-l-4 border-gray-200 mb-4"
                                                  >
                                                    <p className="lg:text-[12px] text-[10px] text-gray-800 leading-relaxed mb-2">
                                                      <span
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            inInInInSub.title,
                                                        }}
                                                      />
                                                    </p>
                                                    {inInInInSub.ininininininsubtitle &&
                                                      inInInInSub.ininininininsubtitle.map(
                                                        (
                                                          inInInInInSub,
                                                          inInInInInSubIndex
                                                        ) => (
                                                          <div
                                                            key={
                                                              inInInInInSubIndex
                                                            }
                                                            className="pl-6 border-l-4 border-gray-200"
                                                          >
                                                            <p className="lg:text-[12px] text-[10px] text-gray-800 leading-relaxed mb-2">
                                                              <span
                                                                dangerouslySetInnerHTML={{
                                                                  __html:
                                                                    inInInInInSub.title,
                                                                }}
                                                              />
                                                            </p>
                                                          </div>
                                                        )
                                                      )}
                                                  </div>
                                                )
                                              )}
                                          </div>
                                        )
                                      )}
                                  </div>
                                )
                              )}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default HspPolicyAgree;
