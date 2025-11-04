import React from "react";

const ReturnsPage = () => {
  return (
    <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6 font-poppins">
      {/* Returns Header */}
      <div className="justify-center text-center mb-2">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
          <span className="shadow-inherit">RETURNS POLICY</span>
        </h1>
      </div>

      {/* Returns Details */}
      <div className="mx-auto lg:text-[16px] text-[12px] container text-justify bg-white p-8 rounded-xl shadow-lg max-w-6xl border border-gray-200">
        <ul className="mb-4 space-y-4">
          <li>
            <span className="font-bold">1. Eligibility for Returns:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              Products can be returned within 15 days of delivery if they are unused, unopened, and in original packaging.
            </p>
          </li>
          <li>
            <span className="font-bold">2. Return Process:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              Contact our support team to initiate a return. You will receive instructions on how to ship the product back.
            </p>
          </li>
          <li>
            <span className="font-bold">3. Refunds:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              Once the returned product is received and inspected, refunds will be processed to the original payment method within 5-7 business days.
            </p>
          </li>
          <li>
            <span className="font-bold">4. Damaged or Incorrect Items:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              If you receive a damaged or incorrect item, contact support immediately. We will replace it at no extra cost.
            </p>
          </li>
          <li>
            <span className="font-bold">5. Non-returnable Items:</span>
            <p className="pl-6 border-l-4 border-gray-300 mt-1">
              Certain items like personal care products and opened consumables cannot be returned.
            </p>
          </li>
        </ul>
        <p>
          For more details, visit our <span className="font-bold italic underline">Help Center</span>.
        </p>
      </div>
    </div>
  );
};

export default ReturnsPage;
