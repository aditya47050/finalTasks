// FormatDate.js
import React from "react";

const FormatDate = ({ dateString }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return <span>{dateString ? formatDate(dateString) : "01/01/1996"}</span>;
};

export default FormatDate;
