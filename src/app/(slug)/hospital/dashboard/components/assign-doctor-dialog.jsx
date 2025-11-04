"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, X } from "lucide-react";
import { toast } from "react-toastify"; // Add this import

export default function AssignDoctorDialog({
  specialty,
  hospitalId,
  alldoctors = [],
  onDoctorAssign,
  children
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [filterBySpecialty, setFilterBySpecialty] = useState(true);

  // Debug info when dialog opens
  useEffect(() => {
    if (open) {
      console.log("=== ASSIGN DOCTOR DIALOG DEBUG ===");
      console.log("Specialty:", specialty.speciality.title);
      console.log("Specialty ID:", specialty.specialityId);
      console.log("All doctors count:", alldoctors.length);
      console.log("All doctors:", alldoctors);
    }
  }, [open, specialty, alldoctors]);

  // Filter doctors - with option to show all or only matching specialty
  const filteredDoctors = alldoctors.filter(doctor => {
    // If filter by specialty is enabled, check if doctor has this specialty
    if (filterBySpecialty) {
      const hasSpecialty = doctor.specialities?.some(
        s => s.specialityId === specialty.specialityId
      );
      if (!hasSpecialty) return false;
    }

    // Apply search filter
    const matchesSearch = 
      !searchTerm ||
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialities?.some(s => 
        s.speciality?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  // Check if doctor is already assigned to this specialty
  const isDoctorAssigned = (doctorId) => {
    return specialty.assignedDoctors?.some(doc => doc.id === doctorId);
  };

  // Check if doctor has the current specialty
  const hasCurrentSpecialty = (doctor) => {
    return doctor.specialities?.some(s => s.specialityId === specialty.specialityId);
  };

  const handleAssignDoctor = async (doctorId) => {
    setAssigning(true);
    try {
      const response = await fetch('/api/hospital/assign-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalId,
          doctorId,
          hospitalSpecialityId: specialty.id
        }),
      });

      if (response.ok) {
        toast.success("Doctor assigned successfully!");
        await onDoctorAssign();
        setOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to assign doctor");
        console.error('Failed to assign doctor:', errorData);
      }
    } catch (error) {
      toast.error("Error assigning doctor");
      console.error('Error assigning doctor:', error);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    setAssigning(true);
    try {
      const response = await fetch('/api/hospital/remove-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalId,
          doctorId,
          hospitalSpecialityId: specialty.id
        }),
      });

      if (response.ok) {
        toast.success("Doctor removed from specialty!");
        await onDoctorAssign();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to remove doctor");
        console.error('Failed to remove doctor:', errorData);
      }
    } catch (error) {
      toast.error("Error removing doctor");
      console.error('Error removing doctor:', error);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Assign Doctors - {specialty.speciality.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterBySpecialty(!filterBySpecialty)}
            >
              {filterBySpecialty ? 'Show All' : 'Filter by Specialty'}
            </Button>
          </div>

          {/* Debug Info */}
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <div>Total doctors: {alldoctors.length}</div>
            <div>Filtered doctors: {filteredDoctors.length}</div>
            <div>Currently assigned: {specialty.assignedDoctors?.length || 0}</div>
          </div>

          {/* Currently Assigned Doctors */}
          {specialty.assignedDoctors?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Currently Assigned</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {specialty.assignedDoctors.map(doctor => (
                  <div key={doctor.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</p>
                      <p className="text-sm text-muted-foreground">{doctor.education}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDoctor(doctor.id)}
                      disabled={assigning}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Doctors */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              Available Doctors ({filteredDoctors.length})
              {!filterBySpecialty && ' - Showing all hospital doctors'}
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredDoctors.map(doctor => (
                <div key={doctor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </p>
                      {isDoctorAssigned(doctor.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Assigned
                        </Badge>
                      )}
                      {!hasCurrentSpecialty(doctor) && (
                        <Badge variant="outline" className="text-xs bg-yellow-50">
                          Different Specialty
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {doctor.education}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.specialities?.map(spec => (
                        <Badge 
                          key={spec.id} 
                          variant="outline" 
                          className={`text-xs ${
                            spec.specialityId === specialty.specialityId 
                              ? 'bg-blue-100 border-blue-300' 
                              : ''
                          }`}
                        >
                          {spec.speciality.title}
                          {spec.specialityId === specialty.specialityId && ' ✓'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {!isDoctorAssigned(doctor.id) ? (
                    <Button
                      size="sm"
                      onClick={() => handleAssignDoctor(doctor.id)}
                      disabled={assigning}
                      className="gap-1 border px-3 py-1 rounded-[10px] bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
                    >
                      <UserPlus className="h-4 w-4" />
                      Assign
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDoctor(doctor.id)}
                      disabled={assigning}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {filteredDoctors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-8 w-8 mx-auto mb-2" />
                  <p>No doctors found</p>
                  {filterBySpecialty && (
                    <p className="text-xs mt-1">
                      Try clicking "Show All" to see all hospital doctors
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}