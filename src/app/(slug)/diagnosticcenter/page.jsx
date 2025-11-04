import React from "react";
import Sidebar from "./components/Sidebar";

const Diagnosticcenterpage = () => {
  const doctordetails = [];
  const doctorcategoryname = {
    title: "Diagnostic Center",
    id: "123456789",
  };

  return (
    <div>
      <Sidebar
        doctordetails={doctordetails}
        specilitytype={doctorcategoryname}
      />
    </div>
  );
};

export default Diagnosticcenterpage;
