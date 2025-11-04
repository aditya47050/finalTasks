// components/ABHAFlow/UserDetails.jsx
import { useState, useEffect } from 'react';

export default function UserDetails({
  userData,
  onUpdateMobile,
  onUpdateEmail,
  onCreateABHA,
  onBack,
  onComplete // Add this prop
}) {
  const [activeTab, setActiveTab] = useState('parsed');
  const [parsedData, setParsedData] = useState({});

  useEffect(() => {
    console.log('📥 UserData received in UserDetails:', userData);

    // Parse the user data to extract relevant information from the actual API response structure
    if (userData) {
      const data = {
        // Extract from the actual API response structure
        abhaNumber: userData.ABHAProfile?.ABHANumber ||
          userData.abhaNumber,

        fullName: `${userData.ABHAProfile?.firstName || ''} ${userData.ABHAProfile?.middleName || ''} ${userData.ABHAProfile?.lastName || ''}`.trim(),

        firstName: userData.ABHAProfile?.firstName,
        lastName: userData.ABHAProfile?.lastName,

        mobile: userData.ABHAProfile?.mobile,
        email: userData.ABHAProfile?.email,
        gender: userData.ABHAProfile?.gender,
        dateOfBirth: userData.ABHAProfile?.dob,

        address: userData.ABHAProfile?.address,
        districtName: userData.ABHAProfile?.districtName,
        stateName: userData.ABHAProfile?.stateName,
        pinCode: userData.ABHAProfile?.pinCode,

        mobileVerified: userData.ABHAProfile?.mobileVerified,
        abhaStatus: userData.ABHAProfile?.abhaStatus,
        preferredAddress: userData.ABHAProfile?.preferredAddress,
        phrAddress: userData.ABHAProfile?.phrAddress || [],

        txnId: userData.txnId,
        isNew: userData.isNew,
        message: userData.message,

        // Raw data for display
        rawData: userData
      };

      setParsedData(data);
      console.log('📊 Parsed user data:', data);
    }
  }, [userData]);

  const hasMobile = !!parsedData.mobile;
  const hasEmail = !!parsedData.email;
  const hasABHANumber = !!parsedData.abhaNumber;
  const hasExistingABHAAddress = !!parsedData.preferredAddress || (parsedData.phrAddress?.length > 0);



  // Handle patient integration
  // In UserDetails component, update the handlePatientIntegration function
  // In UserDetails component, update the handlePatientIntegration function
  const handlePatientIntegration = async () => {
    console.log('🚀 Proceeding to patient integration with data:', parsedData);

    // Prepare the data to pass to patient integration
    const patientData = {
      email: parsedData.email,
      mobile: parsedData.mobile,
      abhaCardNumber: parsedData.abhaNumber,       // updated field name
      presentAddress: parsedData.address,          // updated field name
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      gender: parsedData.gender,
      dateOfBirth: parsedData.dateOfBirth ? new Date(parsedData.dateOfBirth) : null, // ensure Date type
      state: parsedData.stateName,
      district: parsedData.districtName,
      pincode: parsedData.pinCode,
    };


    // Check if we have required data
    if (!patientData.email) {
      alert('Email is required to create patient profile. Please add your email first.');
      return;
    }

    try {
      // Step 1: Check if patient already exists
      console.log('🔍 Checking if patient already exists...');
      const checkResponse = await fetch('/api/abha/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: patientData.email,
          mobile: patientData.mobile
        }),
      });

      // Check if response is OK and has content
      if (!checkResponse.ok) {
        const errorText = await checkResponse.text();
        console.error('❌ Check API error:', errorText);
        throw new Error(`Server error: ${checkResponse.status}`);
      }

      const checkData = await checkResponse.json();
      console.log('✅ Patient check response:', checkData);

      if (!checkData.success) {
        throw new Error(checkData.error || 'Failed to check patient');
      }

      if (checkData.exists && checkData.patients.length > 0) {
        // Patient already exists
        const existingPatient = checkData.patients[0];
        alert(`Patient with email ${existingPatient.email} already exists. Please login instead.`);
        return;
      }

      // Step 2: If no existing patient, proceed to create with password
      console.log('✅ No existing patient found, proceeding to create new profile...');

      // Call the onComplete callback with the patient data
      if (onComplete) {
        onComplete(patientData);
      } else {
        console.error('❌ onComplete prop is not defined');
      }

    } catch (err) {
      console.error('❌ Patient integration failed:', err);
      alert(`Failed to check patient: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Details</h1>
              <p className="text-gray-600">Verify and complete your profile</p>
            </div>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>

          {/* Status Message */}
          {parsedData.message && (
            <div className={`p-4 rounded-lg mb-6 ${parsedData.message.includes('already exist')
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
              <div className="flex items-center">
                {parsedData.message.includes('already exist') ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="font-medium">{parsedData.message}</span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('parsed')}
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'parsed'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'raw'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Raw Response
            </button>
          </div>

          {activeTab === 'parsed' && (
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4">Account Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700">ABHA Number</label>
                    <p className={`text-lg font-semibold ${hasABHANumber ? 'text-green-600' : 'text-yellow-600'}`}>
                      {hasABHANumber ? parsedData.abhaNumber : 'Not Generated'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Status</label>
                    <p className={`text-lg font-semibold ${parsedData.abhaStatus === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                      {parsedData.abhaStatus || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">Mobile Verified</label>
                    <p className={`text-lg font-semibold ${parsedData.mobileVerified ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                      {parsedData.mobileVerified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700">New Account</label>
                    <p className={`text-lg font-semibold ${parsedData.isNew ? 'text-green-600' : 'text-blue-600'
                      }`}>
                      {parsedData.isNew ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900 mt-1 font-medium">
                      {parsedData.fullName || 'Not available'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="text-gray-900 mt-1 capitalize">
                      {parsedData.gender || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="text-gray-900 mt-1">
                      {parsedData.dateOfBirth || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="text-gray-900 mt-1 text-sm font-mono">
                      {parsedData.txnId || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {/* Mobile */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                      <div className="flex items-center mt-1">
                        <p className={`${hasMobile ? 'text-green-600 font-medium' : 'text-yellow-600'}`}>
                          {hasMobile ? parsedData.mobile : 'Not available'}
                        </p>
                        {parsedData.mobileVerified && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {!hasMobile && (
                      <button
                        onClick={onUpdateMobile}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ml-4"
                      >
                        Add Mobile
                      </button>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <p className={`mt-1 ${hasEmail ? 'text-green-600 font-medium' : 'text-yellow-600'}`}>
                        {hasEmail ? parsedData.email : 'Not available'}
                      </p>
                    </div>
                    {!hasEmail && (
                      <button
                        onClick={onUpdateEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ml-4"
                      >
                        Add Email
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {(parsedData.address || parsedData.stateName || parsedData.districtName) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parsedData.address && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="text-gray-900 mt-1">{parsedData.address}</p>
                      </div>
                    )}
                    {parsedData.districtName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <p className="text-gray-900 mt-1">{parsedData.districtName}</p>
                      </div>
                    )}
                    {parsedData.stateName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <p className="text-gray-900 mt-1">{parsedData.stateName}</p>
                      </div>
                    )}
                    {parsedData.pinCode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                        <p className="text-gray-900 mt-1">{parsedData.pinCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ABHA Address Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-4">ABHA Address</h3>

                {hasExistingABHAAddress ? (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-purple-700 mb-2">Preferred ABHA Address</label>
                      <p className="text-purple-900 font-semibold text-lg">
                        {parsedData.preferredAddress || parsedData.phrAddress[0]}
                      </p>
                    </div>

                    {parsedData.phrAddress?.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-purple-700 mb-2">All ABHA Addresses</label>
                        <div className="space-y-2">
                          {parsedData.phrAddress.map((address, index) => (
                            <div key={index} className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 ${address === parsedData.preferredAddress ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className={`${address === parsedData.preferredAddress ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                                {address}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        ✅ You already have ABHA addresses. You can proceed to patient integration.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-purple-700 mb-4">
                      Create your ABHA address to access digital health records and services.
                    </p>
                      <div className="text-center">
                        <button
                          onClick={onCreateABHA}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
                        >
                          Create ABHA Address
                        </button>
                        <p className="text-sm text-purple-600 mt-2">
                          You can create or manage multiple ABHA addresses anytime.
                        </p>
                      </div>
                    =

                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={onBack}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Back to OTP
                </button>

                {(hasExistingABHAAddress || hasABHANumber) && onComplete ? (
                  <button
                    onClick={handlePatientIntegration}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                  >
                    Proceed to Patient Integration
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw JSON Response</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-96">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}