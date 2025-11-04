"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function SubAdminList({ subadmins, esevaId }) {
  const [list, setList] = useState(subadmins)

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">SubAdmin List</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Eseva</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length > 0 ? (
            list.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.name || "-"}</TableCell>
                <TableCell>{sub.email}</TableCell>
                <TableCell>{sub.mobile || "-"}</TableCell>
                <TableCell>{sub.eseva?.name || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sub.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : sub.status === "REJECTED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {sub.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No SubAdmins found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Approval / Rejection Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="SubAdmin Approval"
        className="bg-white p-6 rounded-xl mt-16 justify-center items-center shadow-lg max-w-xl h-[500px] overflow-y-auto mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {currentAction === "approve" ? "Approve SubAdmin" : "Reject SubAdmin"}
        </h2>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={5}
          placeholder={
            currentAction === "approve"
              ? "Enter approval remarks (optional)"
              : "Please specify the reason for rejection"
          }
        ></textarea>

        {currentAction === "reject" && (
          <div className="mb-4 max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-2">Select Issues:</h3>
            <div className="grid grid-cols-1 gap-2">
              {issues.map((issue) => (
                <label key={issue} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedIssues.includes(issue)}
                    onChange={() => toggleIssue(issue)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{issue}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitRemark}
            className={`${
              currentAction === "approve" ? "bg-green-500" : "bg-red-500"
            } text-white px-4 py-2 rounded`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : currentAction === "approve"
              ? "Confirm Approval"
              : "Confirm Rejection"}
          </button>
        </div>
      </Modal>
    </div>
  )
}
