export function applyHospitalFilters(hospitals, filters) {
    return hospitals.filter((hospital) => {
      const createdAtDate = hospital.createdAt ? new Date(hospital.createdAt) : null
      const updatedAtDate = hospital.updatedAt ? new Date(hospital.updatedAt) : null
  
      const createdAtFromDate = filters.createdAtFrom ? new Date(filters.createdAtFrom) : null
      const createdAtToDate = filters.createdAtTo ? new Date(filters.createdAtTo) : null
      const updatedAtFromDate = filters.updatedAtFrom ? new Date(filters.updatedAtFrom) : null
      const updatedAtToDate = filters.updatedAtTo ? new Date(filters.updatedAtTo) : null
  
      return (
        // Basic filters
        (!filters.email || 
          (hospital.email && hospital.email.toLowerCase().includes(filters.email.toLowerCase()))) &&
        (!filters.mobile || hospital.mobile?.includes(filters.mobile)) &&
        (!filters.pincode || hospital.pincode === filters.pincode) &&
        (!filters.role || filters.role === "all" || hospital.role === filters.role) &&
        
        // Date filters
        (!createdAtFromDate || (createdAtDate && createdAtDate >= createdAtFromDate)) &&
        (!createdAtToDate || (createdAtDate && createdAtDate <= createdAtToDate)) &&
        (!updatedAtFromDate || (updatedAtDate && updatedAtDate >= updatedAtFromDate)) &&
        (!updatedAtToDate || (updatedAtDate && updatedAtDate <= updatedAtToDate)) &&
        
        // Hospital info filters
        (!filters.regname || 
          (hospital.hspInfo?.regname && 
           hospital.hspInfo.regname.toLowerCase().includes(filters.regname.toLowerCase()))) &&
        
        // Service filters
        (filters.onlineconsultation === "all" || filters.onlineconsultation === "" ||
          hospital.hspInfo?.onlineconsultation === (filters.onlineconsultation === "true")) &&
        (filters.homehealthcare === "all" || filters.homehealthcare === "" ||
          hospital.hspInfo?.homehealthcare === (filters.homehealthcare === "true")) &&
        (filters.pharmacy === "all" || filters.pharmacy === "" ||
          hospital.hspInfo?.pharmacy === (filters.pharmacy === "true")) &&
        (filters.pathology === "all" || filters.pathology === "" ||
          hospital.hspInfo?.pathology === (filters.pathology === "true")) &&
        (filters.diagnosticservices === "all" || filters.diagnosticservices === "" ||
          hospital.hspInfo?.diagnosticservices === (filters.diagnosticservices === "true")) &&
        (filters.cashlessservices === "all" || filters.cashlessservices === "" ||
          hospital.hspInfo?.cashlessservices === (filters.cashlessservices === "true")) &&
        (filters.governmentschemes === "all" || filters.governmentschemes === "" ||
          hospital.hspInfo?.governmentschemes === (filters.governmentschemes === "true")) &&
        (filters.inhousecanteen === "all" || filters.inhousecanteen === "" ||
          hospital.hspInfo?.inhousecanteen === (filters.inhousecanteen === "true")) &&
        
        // Quality filters
        (filters.nabhnablapproved === "all" || filters.nabhnablapproved === "" ||
          hospital.hspdetails?.nabhnablapproved === (filters.nabhnablapproved === "true")) &&
        (filters.isoapproved === "all" || filters.isoapproved === "" ||
          hospital.hspdetails?.isoapproved === (filters.isoapproved === "true")) &&
        
        // Location filters
        (!filters.city || 
          (hospital.hspcontact?.city && 
           hospital.hspcontact.city.toLowerCase().includes(filters.city.toLowerCase()))) &&
        (filters.state === "all" || filters.state === "" ||
          (hospital.hspcontact?.state && 
           hospital.hspcontact.state.toLowerCase().includes(filters.state.toLowerCase()))) &&
        (filters.dist === "all" || filters.dist === "" ||
          (hospital.hspcontact?.dist && 
           hospital.hspcontact.dist.toLowerCase().includes(filters.dist.toLowerCase()))) &&
        (filters.taluka === "all" || filters.taluka === "" ||
          (hospital.hspcontact?.taluka && 
           hospital.hspcontact.taluka.toLowerCase().includes(filters.taluka.toLowerCase()))) &&
        
        // Speciality filter
        (filters.speciality === "all" || filters.speciality === "" ||
          hospital.HospitalSpeciality?.some(spec => 
            spec.speciality?.title && 
            spec.speciality.title.toLowerCase().includes(filters.speciality.toLowerCase()))) &&
        
        // Doctor filters
        (!filters.doctorFirstName || 
          hospital.HospitalDoctor?.some(doc => 
            doc.doctor?.firstName && 
            doc.doctor.firstName.toLowerCase().includes(filters.doctorFirstName.toLowerCase()))) &&
        (!filters.doctorLastName || 
          hospital.HospitalDoctor?.some(doc => 
            doc.doctor?.lastName && 
            doc.doctor.lastName.toLowerCase().includes(filters.doctorLastName.toLowerCase()))) &&
        
        // Ambulance filters
        (!filters.ambulanceCategory || 
          hospital.HospitalAmbulance?.some(amb => 
            amb.ambulance?.category && 
            amb.ambulance.category.toLowerCase().includes(filters.ambulanceCategory.toLowerCase()))) &&
        
        // Banking filters
        (!filters.bankName || 
          (hospital.hspdetails?.bankname && 
           hospital.hspdetails.bankname.toLowerCase().includes(filters.bankName.toLowerCase()))) &&
        
        // Bed category filter
        (filters.bedCategory === "all" || filters.bedCategory === "" ||
          hospital.BedCategory?.some(category => 
            category.name && 
            category.name.toLowerCase().includes(filters.bedCategory.toLowerCase())))
      )
    })
  }
  
  export function processFilteredData(filteredHospitals, originalProcessedData) {
    // Recalculate all analytics based on filtered data
    const totalHospitals = filteredHospitals.length
    
    // Geographic data
    const stateDistribution = {}
    const cityDistribution = {}
    
    filteredHospitals.forEach((hospital) => {
      const state = hospital.hspcontact?.state || "Unknown"
      const city = hospital.hspcontact?.city || "Unknown"
      
      stateDistribution[state] = (stateDistribution[state] || 0) + 1
      cityDistribution[`${city}, ${state}`] = (cityDistribution[`${city}, ${state}`] || 0) + 1
    })
    
    const stateChartData = Object.entries(stateDistribution)
      .map(([state, count]) => ({
        state,
        count,
        percentage: totalHospitals > 0 ? ((count / totalHospitals) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.count - a.count)
    
    const cityChartData = Object.entries(cityDistribution)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)
    
    // Service adoption data
    const services = [
      { key: "onlineconsultation", label: "Online Consultation" },
      { key: "homehealthcare", label: "Home Healthcare" },
      { key: "pharmacy", label: "Pharmacy" },
      { key: "pathology", label: "Pathology" },
      { key: "diagnosticservices", label: "Diagnostic Services" },
      { key: "cashlessservices", label: "Cashless Services" },
      { key: "governmentschemes", label: "Government Schemes" },
      { key: "inhousecanteen", label: "In-house Canteen" },
    ]
    
    const serviceAdoptionData = services
      .map((service) => {
        const count = filteredHospitals.filter(
          (hospital) => hospital.hspInfo?.[service.key] === "true" || hospital.hspInfo?.[service.key] === true
        ).length
        
        return {
          service: service.label,
          count,
          adoption: totalHospitals > 0 ? ((count / totalHospitals) * 100).toFixed(1) : "0",
          hospitals: count,
        }
      })
      .filter((item) => item.count > 0)
    
    // Hospital role data
    const roleDistribution = {}
    filteredHospitals.forEach((hospital) => {
      const role = hospital.role || "Unknown"
      roleDistribution[role] = (roleDistribution[role] || 0) + 1
    })
    
    const hospitalRoleData = Object.entries(roleDistribution).map(([role, count]) => ({
      role,
      count,
      percentage: totalHospitals > 0 ? ((count / totalHospitals) * 100).toFixed(1) : "0",
    }))
    
    // Certification data
    const nabhnablApproved = filteredHospitals.filter(
      (h) => h.hspdetails?.nabhnablapproved === "true" || h.hspdetails?.nabhnablapproved === true
    ).length
    const isoApproved = filteredHospitals.filter(
      (h) => h.hspdetails?.isoapproved === "true" || h.hspdetails?.isoapproved === true
    ).length
    
    // Calculate totals
    const totalBeds = filteredHospitals.reduce((sum, h) => sum + Number.parseInt(h.hspInfo?.totalnoofbed || "0"), 0)
    const totalDoctors = filteredHospitals.reduce((sum, h) => sum + Number.parseInt(h.hspInfo?.totaldoctor || "0"), 0)
    const totalAmbulances = filteredHospitals.reduce((sum, h) => sum + Number.parseInt(h.hspInfo?.totalambulance || "0"), 0)
    
    return {
      ...originalProcessedData,
      totalHospitals,
      totalBeds,
      totalDoctors,
      totalAmbulances,
      hospitals: filteredHospitals,
      stateChartData,
      cityChartData,
      serviceAdoptionData,
      hospitalRoleData,
      certificationData: {
        nabhnablApproved,
        isoApproved,
      },
    }
  }
  