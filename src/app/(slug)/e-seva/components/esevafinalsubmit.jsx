// PatientActionsCell.jsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TermsAndConditionOnSubmission from "@/app/components/termsandcondition";
import ProfileUploadPage from "@/app/patient/dashboard/components/profile-upload";
import PatientPreViewWithTicking from "@/app/patient/dashboard/components/patientpreviewwithticking";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";
import { toast } from "react-toastify";
import PatientPreViewBeforeSubmit from "@/app/patient/dashboard/components/patientpreviewbeforesubmit";
import { useRouter } from "next/navigation";

const PatientActionsCell = ({ user ,esevaId, subAdminId }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (e) => setIsAgreed(e.target.checked);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!user.passportPhoto) {
      toast.error("Please upload a profile photo first.");
      setIsLoading(false);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/patient/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: user.id ,    esevaId,
          subAdminId, }),
      });

      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aarogya Aadhar",
        description: "Health Card Registration",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch("/api/patient/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              patientId: user.id,
              amount: order.amount,
              esevaId,
              subAdminId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            toast.success("Payment successful. Submitting form...");
            await submitPatientForm(user);
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.mobile,
        },
        theme: { color: "#243460" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed.");
    } finally {
      setIsLoading(false);
    }
  };
  const submitPatientForm = async () => {
    setIsLoading(true);
    const formPayload = new FormData();

    try {
      const res = await fetch(`/api/patient/${user.id}`, {
        method: "PUT",
        body: formPayload,
      });

      const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to submit form");
    }

    toast(data.message || "Application submitted successfully!");
    router.push("/e-seva/dashboard/view-patients");
  } catch (err) {
    toast(err.message || "Form submission failed.");
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    if (user.passportPhoto) {
      // Do something like trigger a re-render or state update
      console.log("Passport photo uploaded.");
    }
  }, [user.passportPhoto]);

  return (
    <div className="flex flex-wrap gap-3">
      {/* Upload Photo Dialog */}
      {!user.passportPhoto && (
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl transition duration-200 shadow-sm">
              Upload Photo
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white h-[400px] overflow-auto">
            <ProfileUploadPage userdata={user} onClose={() => {}} />
          </DialogContent>
        </Dialog>
      )}

      {/* Preview & Submit Dialog */}
      {!user?.healthcard[0]?.cardNo ? (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button className="text-sm font-medium text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition duration-200 shadow-sm">
              Preview & Submit
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white max-h-[90vh] overflow-y-auto mb-40">
            <PatientPreViewWithTicking formdata={user} />

            {/* Terms & Conditions */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={handleCheckboxChange}
                className="w-4 h-4 accent-blue-600"
              />
              <TermsAndConditionOnSubmission />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-4 mb-8">
              {user.passportPhoto ? (
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-300 transition duration-200"
                  onClick={handleSubmit}
                  disabled={!isAgreed || isLoading}
                >
                  {isLoading
                    ? "Submitting..."
                    : user?.healthcard?.approvalStatus === "APPROVED"
                    ? "Already Submitted"
                    : "Proceed to Payment and Final Submit"}
                </button>
              ) : (
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-blue-300 transition duration-200"
                  disabled
                >
                  Please Upload Photo First and Come Back
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-sm  font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-xl transition duration-200 shadow-sm">
              Submitted Successfully – Get Acknowledgment
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white max-h-[90vh] overflow-y-auto mb-40">
            <PatientPreViewBeforeSubmit FormData={user} userdata={user} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientActionsCell;
