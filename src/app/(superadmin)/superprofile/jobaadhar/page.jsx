"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployerList = () => {
  const [employers, setEmployers] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  const fetchEmployers = async () => {
    try {
      const res = await fetch("/api/jobaadhar/superadmin/employer");
      const data = await res.json();
      if (data.success) setEmployers(data.data);
    } catch (error) {
      toast.error("Failed to fetch employers");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch("/api/jobaadhar/superadmin/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId: id, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Employer ${status}`);
        fetchEmployers();
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employers</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.map((emp) => (
            <tr key={emp.id}>
              <td className="border px-2 py-1">{emp.user.fullName}</td>
              <td className="border px-2 py-1">{emp.user.email}</td>
              <td className="border px-2 py-1">{emp.user.phone}</td>
              <td className="border px-2 py-1">{emp.status}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                    <Link href={`/superprofile/jobaadhar/${emp.id}`}>
                        View
                    </Link>
                </button>
                {emp.status !== "approved" && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => updateStatus(emp.id, "approved")}
                  >
                    Approve
                  </button>
                )}
                {emp.status !== "rejected" && (
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => updateStatus(emp.id, "rejected")}
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployer && (
        <div className="mt-6 border p-4 rounded shadow-md bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Employer Details</h2>
          <p><strong>Name:</strong> {selectedEmployer.user.fullName}</p>
          <p><strong>Email:</strong> {selectedEmployer.user.email}</p>
          <p><strong>Phone:</strong> {selectedEmployer.user.phone}</p>
          <p><strong>Status:</strong> {selectedEmployer.status}</p>
          {selectedEmployer.company && <p><strong>Company:</strong> {selectedEmployer.company.name}</p>}
          <p><strong>Documents:</strong></p>
          <ul className="ml-4 list-disc">
            {selectedEmployer.documents.map((doc, i) => (
              <li key={i}>{doc.type} - {doc.verified ? "Verified" : "Not Verified"}</li>
            ))}
          </ul>
          <button
            className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
            onClick={() => setSelectedEmployer(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployerList;
