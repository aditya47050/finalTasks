export const parseRemarks = (remarks) => {
  if (!remarks) return {};

  const rejectedFields = {};
  const lines = remarks.split(/[\n,]+/).map(line => line.trim()).filter(Boolean);

  // Map keywords to patient object fields (add all relevant fields)
  const fieldMappings = {
    firstName: ['firstname', 'first name'],
    middleName: ['middlename', 'middle name'],
    lastName: ['lastname', 'last name'],
    dateOfBirth: ['dateofbirth', 'dob', 'date of birth'],
    gender: ['gender'],
    maritalStatus: ['maritalstatus', 'marital status'],
    religion: ['religion'],
    alternateMobile: ['alternatemobile', 'alternate mobile'],
    presentAddress: ['presentaddress', 'present address', 'address'],
    city: ['city'],
    state: ['state'],
    district: ['district'],
    taluka: ['taluka', 'subdistrict'],
    bloodgroup: ['bloodgroup', 'blood group'],
    passportPhoto: ['passportphoto', 'passport photo'],
    aadharCardNumber: ['aadharcardnumber', 'aadhar card number', 'aadhar', 'adhar'],
    aadharCardFront: ['aadharcardfront', 'aadhar card front'],
    aadharCardBack: ['aadharcardback', 'aadhar card back'],
    abhacard: ['abhacard', 'abha card'],
    abhaCardNumber: ['abhacardnumber', 'abha card number'],
    abhaCardFront: ['abhacardfront', 'abha card front'],
    healthInsurance: ['healthinsurance', 'health insurance'],
    healthInsuranceNumber: ['healthinsurancenumber', 'health insurance number'],
    healthInsuranceDocument: ['healthinsurancedocument', 'health insurance document'],
    ayushmancard: ['ayushmancard', 'ayushman card'],
    ayushmanCard: ['ayushmanCard', 'ayushman card'],
    ayushmanCardFront: ['ayushmanCardFront', 'ayushman card front'],
    rationCardNumber: ['rationcardnumber', 'ration card number'],
    rationCardFront: ['rationcardfront', 'ration card front'],
    rationCardBack: ['rationcardback', 'ration card back'],
    organDonation: ['organdonation', 'organ donation'],
    bankName: ['bankname', 'bank name'],
    accountNumber: ['accountnumber', 'account number'],
    ifscCode: ['ifsccode', 'ifsc code'],
    accountType: ['accounttype', 'account type'],
    cancelledCheque: ['cancelledcheque', 'cancelled cheque'],
    micrCode: ['micrcode', 'micr code'],
    income: ['income'],
    incomeCertificateimg: ['incomecertificateimg', 'income certificate img'],
    incomeCertificateNo: ['incomecertificateno', 'income certificate no'],
    panCard: ['pancard', 'pan card'],
    contactPersonName: ['contactpersonname', 'contact person name'],
    contactPersonRelation: ['contactpersonrelation', 'contact person relation'],
    contactManaadharFront: ['contactmanaadharfront', 'contact manaadhar front'],
    contactmanaadharBack: ['contactmanaadharback', 'contact manaadhar back'],
    contactmanaadharNumber: ['contactmanaadharnumber', 'contact manaadhar number'],
    isCompanyRegistered: ['iscompanyregistered', 'is company registered'],
    companyRegistrationNo: ['companyregistrationno', 'company registration no'],
    employeeIdCard: ['employeeidcard', 'employee id card'],
    // Add more mappings as needed
  };

  lines.forEach(line => {
    const normalized = line.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    Object.entries(fieldMappings).forEach(([field, keywords]) => {
      keywords.forEach(keyword => {
        const normKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        if (
          normalized.includes(normKeyword) ||
          normalized.includes(`incorrect ${normKeyword}`)
        ) {
          rejectedFields[field] = true;
        }
      });
    });
  });

  return rejectedFields;
};