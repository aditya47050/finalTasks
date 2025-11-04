"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeadingClientMain from "@/app/components/heading";
import HospitalSpecialityForm from "./add-speciality-hospital";
import AssignDoctorDialog from "./assign-doctor-dialog";
import {
  Activity,
  Brain,
  Heart,
  Stethoscope,
  Users,
  Search,
  Plus,
  UserPlus,
  Baby,
  Eye,
  Smile,
  Bone,
  Dna,
  Shield,
  Leaf,
  Thermometer,
} from "lucide-react";
import { BsLungs } from "react-icons/bs";

export default function HospitalSpecialtiesList({
  specialties = [],
  hospitalId,
  alldoctors = [],
  allSpecialties = [],
  expertsdoctors = [],
}) {
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("grid");
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh after assignment
  const handleDoctorAssign = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
  };

  const getSpecialtyIcon = (specialtyName) => {
    const name = specialtyName.toLowerCase();
  
    if (name.includes("cardio") || name.includes("cardiac") || name.includes("heart"))
      return <Heart className="h-5 w-5 text-red-500" />;
  
    if (name.includes("neuro") || name.includes("brain") || name.includes("nerv"))
      return <Brain className="h-5 w-5 text-purple-500" />;
  
    if (name.includes("general") || name.includes("physician") || name.includes("doctor"))
      return <Stethoscope className="h-5 w-5 text-blue-500" />;
  
    if (name.includes("pediatric") || name.includes("child"))
      return <Baby className="h-5 w-5 text-yellow-500" />;
  
    if (name.includes("ophthalm") || name.includes("eye"))
      return <Eye className="h-5 w-5 text-green-500" />;
  
    if (name.includes("dermatology") || name.includes("skin"))
      return <Smile className="h-5 w-5 text-orange-500" />;
  
    if (name.includes("orthopedic") || name.includes("bone") || name.includes("joint"))
      return <Bone className="h-5 w-5 text-gray-500" />;
  
    if (name.includes("pulmonology") || name.includes("lung") || name.includes("chest"))
      return <BsLungs className="h-5 w-5 text-blue-400" />;
  
    if (name.includes("oncology") || name.includes("cancer"))
      return <Dna className="h-5 w-5 text-pink-500" />;
  
    if (name.includes("rheumatology") || name.includes("arthritis"))
      return <Shield className="h-5 w-5 text-indigo-500" />;
  
    if (name.includes("ayurvedic"))
      return <Leaf className="h-5 w-5 text-green-600" />;
  
    if (name.includes("homeopathy"))
      return <Thermometer className="h-5 w-5 text-teal-500" />;
  
    return <Activity className="h-5 w-5 text-emerald-500" />;
  };

  // Filter specialties by search term
  useEffect(() => {
    let filtered = specialties;

    if (searchTerm) {
      filtered = filtered.filter((specialty) =>
        specialty.speciality.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSpecialties(filtered);
  }, [searchTerm, specialties, refreshKey]);

  return (
    <div className="mx-auto p-4 md:p-8 space-y-6">
      <HeadingClientMain
        main="Hospital Specialties"
        sub="Manage medical specialties and associated doctors"
      />

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Tabs
            defaultValue="grid"
            className="w-[180px]"
            onValueChange={setView}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>

          <HospitalSpecialityForm
            hospitalId={hospitalId}
            availableSpecialties={allSpecialties}
            expertsdoctors={expertsdoctors}
          >
            <Button className="gap-1 border px-3 py-1 rounded-[10px] bg-blue-600 text-white hover:bg-blue-600 hover:text-white">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Specialty</span>
            </Button>
          </HospitalSpecialityForm>
        </div>
      </div>

      {/* Specialties Display */}
      {filteredSpecialties.length > 0 ? (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 rounded-[10px] lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredSpecialties.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getSpecialtyIcon(item.speciality.title)}
                        <CardTitle className="text-lg">
                          {item.speciality.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {item.doctorCount}{" "}
                        {item.doctorCount === 1 ? "Doctor" : "Doctors"}
                      </span>
                    </div>
                    
                    {/* Assigned Doctors List */}
                    {item.assignedDoctors && item.assignedDoctors.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Assigned Doctors:
                        </p>
                        <div className="space-y-1">
                          {item.assignedDoctors.slice(0, 3).map(doctor => (
                            <div key={doctor.id} className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>
                                Dr. {doctor.firstName} {doctor.lastName}
                              </span>
                            </div>
                          ))}
                          {item.assignedDoctors.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{item.assignedDoctors.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between">
                    <AssignDoctorDialog
                      specialty={item}
                      hospitalId={hospitalId}
                      alldoctors={alldoctors}
                      onDoctorAssign={handleDoctorAssign}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1 border px-3 py-1 rounded-[10px] bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
                      >
                        <UserPlus className="h-4 w-4" />
                        Assign Doctor
                      </Button>
                    </AssignDoctorDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2 rounded-[10px]">
              {filteredSpecialties.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="mr-4">
                      {getSpecialtyIcon(item.speciality.title)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.speciality.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.doctorCount}{" "}
                        {item.doctorCount === 1 ? "Doctor" : "Doctors"} assigned
                      </p>
                      
                      {/* Assigned Doctors for List View */}
                      {item.assignedDoctors && item.assignedDoctors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.assignedDoctors.map(doctor => (
                            <Badge key={doctor.id} variant="secondary" className="text-xs">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                   
                    <AssignDoctorDialog
                      specialty={item}
                      hospitalId={hospitalId}
                      alldoctors={alldoctors}
                      onDoctorAssign={handleDoctorAssign}
                    >
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="gap-1 border px-3 py-1 rounded-[10px] bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Assign Doctor</span>
                      </Button>
                    </AssignDoctorDialog>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-xl bg-muted/20">
          <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No specialties found</h3>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm
              ? `No results found for "${searchTerm}". Try a different search term.`
              : "Add your first specialty to get started."}
          </p>
          <HospitalSpecialityForm
            hospitalId={hospitalId}
            availableSpecialties={allSpecialties}
            expertsdoctors={expertsdoctors}
          >
            <Button className="gap-1 border px-3 py-1 rounded-[10px] bg-blue-600 text-white hover:bg-blue-600 hover:text-white">
              <Plus className="h-4 w-4" />
              Add Your First Specialty
            </Button>
          </HospitalSpecialityForm>
        </div>
      )}
    </div>
  );
}