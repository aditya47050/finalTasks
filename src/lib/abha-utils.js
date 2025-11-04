// Utility functions for ABHA flow
export const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^\d{12}$/;
    return aadhaarRegex.test(aadhaar);
  };
  
  export const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };
  
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return '';
    return aadhaar.replace(/(\d{4})\d{4}(\d{4})/, '$1****$2');
  };
  
  export const maskMobile = (mobile) => {
    if (!mobile) return '';
    return mobile.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  };
  
  export const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    const maskedLocal = local.length > 3 
      ? local.substring(0, 3) + '*'.repeat(local.length - 3)
      : local;
    return `${maskedLocal}@${domain}`;
  };
  
  export const formatABHANumber = (abhaNumber) => {
    if (!abhaNumber) return '';
    // Format: XX-XXXX-XXXX-XXXX
    return abhaNumber.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');
  };
  
  export const parseError = (error) => {
    if (typeof error === 'string') return error;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
  };