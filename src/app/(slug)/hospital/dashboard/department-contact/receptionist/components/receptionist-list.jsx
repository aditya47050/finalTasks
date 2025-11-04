 "use client";
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function ReceptionistList({ hospitalId }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!hospitalId) return;
    const load = async () => {
      const res = await fetch(`/api/hospital/${hospitalId}/receptionists`);
      const json = await res.json();
      setData(json?.receptionists || []);
    };
    load();
  }, [hospitalId]);

  const filtered = data.filter((r) => {
    const q = filter.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.mobile?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3 ">
      <Input className="w-[20vw]" placeholder="Search by name, email, mobile" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.mobile}</TableCell>
                <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No receptionists found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


