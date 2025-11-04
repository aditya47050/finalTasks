import React from "react";

const AdvantagesForPharmaAndSurgical = () => {
  return (
    <>
      <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6">
        <div className="justify-center text-center mb-2">
          <h1 className="lg:text-[25px] text-[20px]  text-[#5271FF] font-poppins font-extrabold">
            <span className="shadow-inherit">
              Advantages for Pharma Manufacturers
            </span>
          </h1>
        </div>
        <div>
          <div className="mx-auto container lg:text-[16px] text-[12px]  text-justify bg-white p-8 font-poppins rounded-xl shadow-lg max-w-6xl border border-gray-200">
            <p>
              <span className="font-bold">1. TRACK SALES:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">Track the sale of medicines effectively.</li>
            </ul>

            <p>
              <span className="font-bold">2. DEMAND ANALYSIS:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">
                Track demand for particular medicines in certain demographics.
              </li>
            </ul>

            <p>
              <span className="font-bold">3. R&D SUPPORT:</span>
            </p>
            <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
              <li className="ml-4">Helpful for R&D of new drugs.</li>
            </ul>
          </div>
        </div>

        <div className="mt-3">
          <div className="justify-center text-center mb-3">
            <h1 className="lg:text-[25px] text-[20px]  text-[#5271FF] font-poppins font-extrabold">
              <span className="shadow-inherit">
                Advantages for Surgical Suppliers
              </span>
            </h1>
          </div>
          <div>
            <div className="mx-auto container lg:text-[16px] text-[12px]  text-justify bg-white p-8 font-poppins rounded-xl shadow-lg max-w-6xl border border-gray-200">
              <p>
                <span className="font-bold">1. ORDER TRACKING:</span>
              </p>
              <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
                <li className="ml-4">Track your orders efficiently.</li>
              </ul>

              <p>
                <span className="font-bold">2. ONLINE ORDERS:</span>
              </p>
              <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
                <li className="ml-4">
                  Get online orders from doctors and hospitals.
                </li>
              </ul>

              <p>
                <span className="font-bold">3. SUPPLY CHAIN MANAGEMENT:</span>
              </p>
              <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
                <li className="ml-4">
                  Streamline the supply chain for better efficiency.
                </li>
              </ul>

              <p>
                <span className="font-bold">4. DISCOUNT PROMOTION:</span>
              </p>
              <ul className="list-disc pl-6 border-l-4 border-gray-300 mb-6 ">
                <li className="ml-4">Promote discount offers effectively.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvantagesForPharmaAndSurgical;
