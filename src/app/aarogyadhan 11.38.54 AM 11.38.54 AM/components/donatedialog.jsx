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
import { UploadButton } from "@uploadthing/react";
import { Heart, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { loadRazorpayScript } from "@/lib/utils/loadrazorpay";

const DonateDialog = ({ campaignId }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    donorName: "",
    donorEmail: "",
    donorMobile: "",
    amount: "",
    wantsTaxBenefit: false,
    panNumber: "",
    aadharNumber: "",
    panCardImage: null,
    aadharCardImage: null,
  });

  const [loading, setLoading] = useState(false);

  const handleFileUploadComplete = (field, res) => {
    if (res?.[0]?.url) {
      setForm((prev) => ({ ...prev, [field]: res[0].url }));
      toast.success(
        `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} uploaded successfully`
      );
    }
  };

  const verifyPayment = async (response, donationId) => {
    try {
      const res = await fetch("/api/aarogyadhan/donation/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...response, donationId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Donation verified and successful!");
        setOpen(false);
        // Reset form
        setForm({
          donorName: "",
          donorEmail: "",
          donorMobile: "",
          amount: "",
          wantsTaxBenefit: false,
          panNumber: "",
          aadharNumber: "",
          panCardImage: null,
          aadharCardImage: null,
        });
      } else {
        toast.error("❌ Payment verification failed.");
      }
    } catch (err) {
      toast.error("Server error during payment verification.");
      console.error("Verification error:", err);
    }
  };

  const handleSubmit = async () => {
    if (
      !form.donorName ||
      !form.donorEmail ||
      !form.donorMobile ||
      !form.amount
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.wantsTaxBenefit && (!form.panNumber || !form.aadharNumber)) {
      toast.error("Please provide PAN and Aadhar details for tax benefits");
      return;
    }

    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/aarogyadhan/donation/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, campaignId }),
      });

      const data = await res.json();
      console.log("create-order →", data);

      if (!data.success) {
        toast.error("Failed to create Razorpay order.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.razorpayKey,
        amount: Number(form.amount) * 100,
        currency: "INR",
        name: "Livo Foundation",
        description: "Donation for Medical Help",
        order_id: data.orderId,
        prefill: {
          name: form.donorName,
          email: form.donorEmail,
          contact: form.donorMobile,
        },
        handler: (resp) => {
          console.log("Payment success!", resp);
          verifyPayment(resp, data.donationId);
        },
        theme: { color: "#5271FF" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("PAYMENT FAILED:", response.error);
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      });

      console.log("open Razorpay →", options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5271FF] hover:bg-[#4460e6] text-white font-bold md:text-[11px] text-[9px] xl:text-[13px] md:py-2 md:px-4 px-2 py-1  rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
          <Heart className="w-4 h-4 mr-1" />
          Donate Fund
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold text-[#5271FF] flex items-center justify-center">
            <Heart className="w-6 h-6 mr-2 text-red-500" />
            Make a Donation
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Your contribution can make a real difference in {"someone's"} life
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Amount Selection */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Quick Select Amount
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() =>
                    setForm({ ...form, amount: amount.toString() })
                  }
                  className={`transition-all duration-200 ${
                    form.amount === amount.toString()
                      ? "bg-[#5271FF] text-white border-[#5271FF] shadow-md"
                      : "hover:bg-blue-50 hover:border-[#5271FF]"
                  }`}
                >
                  ₹{amount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <Label
              htmlFor="amount"
              className="text-sm font-semibold text-gray-700"
            >
              Custom Amount (₹) *
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="mt-2 text-lg font-semibold"
              min="1"
            />
          </div>

          {/* Donor Information */}
          <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
            <h4 className="font-semibold text-gray-800 text-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-[#5271FF]" />
              Donor Information
            </h4>

            <div>
              <Label
                htmlFor="donorName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name *
              </Label>
              <Input
                id="donorName"
                value={form.donorName}
                onChange={(e) =>
                  setForm({ ...form, donorName: e.target.value })
                }
                className="mt-1"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="donorEmail"
                className="text-sm font-medium text-gray-700"
              >
                Email Address *
              </Label>
              <Input
                id="donorEmail"
                type="email"
                value={form.donorEmail}
                onChange={(e) =>
                  setForm({ ...form, donorEmail: e.target.value })
                }
                className="mt-1"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="donorMobile"
                className="text-sm font-medium text-gray-700"
              >
                Mobile Number *
              </Label>
              <Input
                id="donorMobile"
                type="tel"
                value={form.donorMobile}
                onChange={(e) =>
                  setForm({ ...form, donorMobile: e.target.value })
                }
                className="mt-1"
                placeholder="Enter your mobile number"
                required
              />
            </div>
          </div>

          {/* Tax Benefit Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <Checkbox
                id="taxBenefit"
                checked={form.wantsTaxBenefit}
                onCheckedChange={(checked) =>
                  setForm({ ...form, wantsTaxBenefit: checked })
                }
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label
                htmlFor="taxBenefit"
                className="text-sm font-semibold text-gray-800 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />I want
                tax benefits under Section 80G
              </Label>
            </div>

            {form.wantsTaxBenefit && (
              <div className="space-y-4 bg-white p-4 rounded-xl border">
                <div>
                  <Label
                    htmlFor="panNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    PAN Number *
                  </Label>
                  <Input
                    id="panNumber"
                    value={form.panNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        panNumber: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="ABCDE1234F"
                    className="mt-1"
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-2">
                    PAN Card Image *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#5271FF] transition-colors">
                    <UploadButton
                      endpoint="fileUploader"
                      onClientUploadComplete={(res) =>
                        handleFileUploadComplete("panCardImage", res)
                      }
                      appearance={{
                        button:
                          "w-full bg-[#5271FF] hover:bg-[#4460e6] text-white py-2 px-4 rounded font-medium flex justify-center items-center",
                        allowedContent: "text-xs text-gray-500 mt-2",
                      }}
                    />
                    {form.panCardImage && (
                      <div className="mt-2 text-green-600 text-sm flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        PAN Card uploaded successfully
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="aadharNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Aadhar Number *
                  </Label>
                  <Input
                    id="aadharNumber"
                    value={form.aadharNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        aadharNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="1234 5678 9012"
                    className="mt-1"
                    maxLength={12}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 block mb-2">
                    Aadhar Card Image *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#5271FF] transition-colors">
                    <UploadButton
                      endpoint="fileUploader"
                      onClientUploadComplete={(res) =>
                        handleFileUploadComplete("aadharCardImage", res)
                      }
                      appearance={{
                        button:
                          "w-full bg-[#5271FF] hover:bg-[#4460e6] text-white py-2 px-4 rounded font-medium flex justify-center items-center",
                        allowedContent: "text-xs text-gray-500 mt-2",
                      }}
                    />
                    {form.aadharCardImage && (
                      <div className="mt-2 text-green-600 text-sm flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aadhar Card uploaded successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment ₹
                {form.amount ? Number(form.amount).toLocaleString() : "0"}
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your donation is secure and encrypted. You will receive a
              receipt via email.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              💝 Thank you for making a difference in {"someone's"} life!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonateDialog;
