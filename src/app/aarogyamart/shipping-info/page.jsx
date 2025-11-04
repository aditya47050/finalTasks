import React from "react";

const ShippingInfoPage = () => {
  return (
    <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6 font-poppins">
      {/* Shipping Information Header */}
      <div className="justify-center text-center mb-2">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
          <span className="shadow-inherit">SHIPPING INFORMATION</span>
        </h1>
      </div>

      {/* Shipping Details */}
      <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
        <ul className="mb-4 space-y-4">
          <li>
            <span className="font-bold">1. Order Processing:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              Orders are processed within 1-2 business days. Once processed, you will receive a confirmation email with tracking details.
            </p>
          </li>
          <li>
            <span className="font-bold">2. Shipping Methods:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              We offer standard and express shipping options. Delivery time varies based on location and chosen shipping method.
            </p>
          </li>
          <li>
            <span className="font-bold">3. Shipping Charges:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              Shipping charges are calculated during checkout and may vary depending on weight, location, and shipping method.
            </p>
          </li>
          <li>
            <span className="font-bold">4. Tracking Orders:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              Once your order is shipped, you will receive a tracking number to monitor the delivery status.
            </p>
          </li>
          <li>
            <span className="font-bold">5. International Shipping:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              International shipping may take longer and customs charges may apply depending on the destination country.
            </p>
          </li>
        </ul>
        <p>
          For more shipping details, visit our <span className="font-bold italic underline">Customer Support Page</span>.
        </p>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
