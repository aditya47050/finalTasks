import React from "react";

const page = () => {
  return (
    <div className="mx-auto container px-4 pb-2 lg:px-20 mt-6">
      <div className="justify-center text-center mb-2">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-poppins font-extrabold">
          <span className="shadow-inherit">Benefits to Chemist</span>
        </h1>
      </div>
      <div className="mx-auto lg:text-[16px] text-[12px]  container text-justify bg-white p-8 font-poppins rounded-xl shadow-lg max-w-6xl border border-gray-200">
        <ul className="list-decimal ">
          <li>
            Reminders sent to chemists if medicines are not delivered to
            patients on time.
          </li>
          <li>Prescription will be available on the application.</li>
          <li>
            Online data collection relating to delivery of medicines and bills
            payments.
          </li>
          <li>Stock inventory information available on the application.</li>
          <li>
            Data storage of all types of medicines ease of managing business
            with stockiest.
          </li>
          <li>Revenue generation by increasing membership.</li>
          <li>Able to expand his business with less time.</li>
          <li>Retain long-term loyal customers.</li>
          <li>Track orders placed or not delivered by the delivery boy.</li>
        </ul>
      </div>

      <div className="justify-center text-center mb-4 mt-4">
        <h1 className="lg:text-[25px] text-[20px] text-[#5271FF] font-poppins font-extrabold">
          <span className="shadow-inherit">Benefits for Stockiest</span>
        </h1>
      </div>
      <div className="mx-auto container lg:text-[16px] text-[12px]  text-justify bg-white p-8 font-poppins rounded-xl shadow-lg max-w-6xl border border-gray-200">
        <ul className="list-decimal ">
          <li>Easy to manage orders from retailers.</li>
          <li>Order delivery report can be saved and maintained online.</li>
          <li>Online inventory management.</li>
          <li>Smooth communication with chemist and manufacturers.</li>
          <li>
            Opportunity to increase business by connecting with various
            chemists.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default page;
