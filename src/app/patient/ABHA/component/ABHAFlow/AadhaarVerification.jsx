import { useState } from 'react';

export default function AadhaarVerification({ onSuccess, onBack }) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setApiResponse(null);
    
    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }
  
    setIsLoading(true);

    try {
      console.log('🚀 ========== STARTING ABHA ENROLLMENT ==========');
      console.log('📋 Aadhaar number (first 4, last 4):', 
        aadhaarNumber.substring(0, 4) + '...' + aadhaarNumber.substring(8));

      // Step 1: Create session
      console.log('🔑 STEP 1: Creating session...');
      setApiResponse({ step: 1, message: 'Creating session...' });
      
      const sessionResponse = await fetch('/api/abha/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Session Response Status:', sessionResponse.status);
      console.log('📡 Session Response OK:', sessionResponse.ok);

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        console.error('❌ Session Error Response:', errorText);
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Session creation failed with status ${sessionResponse.status}`);
      }

      const sessionData = await sessionResponse.json();
      console.log('✅ Session Data:', sessionData);
      
      if (!sessionData.success) {
        throw new Error(sessionData.message || 'Failed to create session');
      }

      console.log('✅ Session created successfully');
      const accessToken = sessionData.accessToken;
      console.log('🔑 Access Token (last 10 chars):', accessToken.slice(-10));
      setApiResponse({ step: 1, message: '✅ Session created successfully', status: 'success' });

      // Step 2: Get encryption certificate
      console.log('📜 STEP 2: Fetching encryption certificate...');
      setApiResponse({ step: 2, message: 'Fetching encryption certificate...' });
      
      const certUrl = `/api/abha/certificate?accessToken=${encodeURIComponent(accessToken)}`;
      console.log('📡 Certificate URL:', certUrl);
      
      const certResponse = await fetch(certUrl);
      
      console.log('📡 Certificate Response Status:', certResponse.status);
      console.log('📡 Certificate Response OK:', certResponse.ok);

      if (!certResponse.ok) {
        const errorText = await certResponse.text();
        console.error('❌ Certificate Error Response:', errorText);
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Certificate fetch failed with status ${certResponse.status}`);
      }

      const certData = await certResponse.json();
      console.log('✅ Certificate Data:', { 
        success: certData.success,
        publicKeyLength: certData.publicKey?.length 
      });

      if (!certData.success) {
        throw new Error(certData.message || 'Failed to get encryption certificate');
      }

      console.log('✅ Certificate fetched');
      setApiResponse({ step: 2, message: '✅ Encryption certificate fetched', status: 'success' });

      // Step 3: Encrypt Aadhaar number
      console.log('🔒 STEP 3: Encrypting Aadhaar number...');
      setApiResponse({ step: 3, message: 'Encrypting Aadhaar number...' });
      
      const encryptResponse = await fetch('/api/abha/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: aadhaarNumber,
          publicKey: certData.publicKey
        }),
      });

      console.log('📡 Encrypt Response Status:', encryptResponse.status);
      console.log('📡 Encrypt Response OK:', encryptResponse.ok);

      if (!encryptResponse.ok) {
        const errorText = await encryptResponse.text();
        console.error('❌ Encrypt Error Response:', errorText);
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Encryption failed with status ${encryptResponse.status}`);
      }

      const encryptResult = await encryptResponse.json();
      console.log('✅ Encrypt Result:', {
        success: encryptResult.success,
        encryptedDataLength: encryptResult.encryptedData?.length
      });

      if (!encryptResult.success) {
        throw new Error(encryptResult.message || 'Failed to encrypt Aadhaar number');
      }

      const encryptedAadhaar = encryptResult.encryptedData;
      console.log('✅ Aadhaar encrypted successfully');
      console.log('🔐 Encrypted Aadhaar (first 50 chars):', encryptedAadhaar.substring(0, 50) + '...');
      setApiResponse({ step: 3, message: '✅ Aadhaar number encrypted', status: 'success' });

      // Step 4: Request Aadhaar OTP for enrollment
      console.log('📱 STEP 4: Requesting enrollment OTP via API route...');
      setApiResponse({ step: 4, message: 'Requesting OTP from Aadhaar...' });
      
      const otpPayload = {
        accessToken,
        encryptedAadhaar
      };
      console.log('📦 OTP Request Payload to API route:', {
        accessToken: accessToken.slice(-10),
        encryptedAadhaarLength: encryptedAadhaar.length
      });

      const otpResponse = await fetch('/api/abha/enrollment/aadhar-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpPayload),
      });

      console.log('📡 OTP Response Status:', otpResponse.status);
      console.log('📡 OTP Response OK:', otpResponse.ok);

      // Check if response is HTML (404 page)
      const contentType = otpResponse.headers.get('content-type');
      console.log('📄 Response Content-Type:', contentType);

      const responseText = await otpResponse.text();
      console.log('📄 Response Text (first 500 chars):', responseText.substring(0, 500));

      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ ERROR: Received non-JSON response (likely HTML 404 page)');
        console.error('📄 Full response:', responseText);
        throw new Error('API endpoint returned HTML instead of JSON. The route /api/abha/enrollment/aadhaar-otp may not exist.');
      }

      let otpData;
      try {
        otpData = JSON.parse(responseText);
        console.log('✅ OTP Response Data:', otpData);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('📄 Response that failed to parse:', responseText);
        throw new Error('Failed to parse API response as JSON');
      }

      if (!otpData.success) {
        console.error('❌ OTP Request Failed:', otpData);
        setApiResponse({ 
          step: 4, 
          message: '❌ OTP request failed', 
          status: 'error',
          details: otpData 
        });
        throw new Error(otpData.message || 'Failed to request OTP via Aadhaar');
      }

      console.log('✅ Enrollment OTP requested successfully:', {
        txnId: otpData.txnId,
        message: otpData.message
      });

      setApiResponse({ 
        step: 4, 
        message: '✅ OTP sent successfully!', 
        status: 'success',
        details: {
          txnId: otpData.txnId,
          message: otpData.message
        }
      });

      // Success - move to OTP verification
      console.log('🎉 ========== ABHA ENROLLMENT SUCCESSFUL ==========');
      
      // Small delay to show success message
      setTimeout(() => {
        onSuccess({
          txnId: otpData.txnId,
          accessToken,
          aadhaarNumber: aadhaarNumber,
          encryptedAadhaar
        });
      }, 1500);

    } catch (err) {
      console.error('❌ ========== ABHA ENROLLMENT FAILED ==========');
      console.error('❌ Error details:', err.message);
      
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarNumber(value);
    setError('');
    setApiResponse(null);
  };

  const getStepStatus = (step) => {
    if (!apiResponse) return 'pending';
    if (apiResponse.step < step) return 'pending';
    if (apiResponse.step === step) return apiResponse.status || 'processing';
    return 'completed';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'processing':
        return '⏳';
      default:
        return '⏸️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create ABHA with Aadhaar</h1>
          <p className="text-gray-600">Enter your Aadhaar number to create your ABHA account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar Number
            </label>
            <input
              type="text"
              id="aadhaar"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="Enter 12-digit Aadhaar number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              maxLength={12}
              pattern="\d{12}"
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              OTP will be sent to your registered mobile number
            </p>
          </div>

          {/* API Response Display */}
          {apiResponse && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fade-in">
              <h3 className="text-sm font-medium text-gray-700 mb-3">API Response Progress:</h3>
              
              <div className="space-y-2">
                {/* Step 1: Session Creation */}
                <div className={`flex items-center text-sm ${
                  getStepStatus(1) === 'error' ? 'text-red-600' : 
                  getStepStatus(1) === 'success' ? 'text-green-600' :
                  getStepStatus(1) === 'processing' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  <span className="w-6">{getStatusIcon(getStepStatus(1))}</span>
                  <span>1. Session Creation</span>
                  {apiResponse.step === 1 && apiResponse.message && (
                    <span className="ml-2 text-xs">- {apiResponse.message}</span>
                  )}
                </div>

                {/* Step 2: Certificate Fetch */}
                <div className={`flex items-center text-sm ${
                  getStepStatus(2) === 'error' ? 'text-red-600' : 
                  getStepStatus(2) === 'success' ? 'text-green-600' :
                  getStepStatus(2) === 'processing' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  <span className="w-6">{getStatusIcon(getStepStatus(2))}</span>
                  <span>2. Certificate Fetch</span>
                  {apiResponse.step === 2 && apiResponse.message && (
                    <span className="ml-2 text-xs">- {apiResponse.message}</span>
                  )}
                </div>

                {/* Step 3: Encryption */}
                <div className={`flex items-center text-sm ${
                  getStepStatus(3) === 'error' ? 'text-red-600' : 
                  getStepStatus(3) === 'success' ? 'text-green-600' :
                  getStepStatus(3) === 'processing' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  <span className="w-6">{getStatusIcon(getStepStatus(3))}</span>
                  <span>3. Aadhaar Encryption</span>
                  {apiResponse.step === 3 && apiResponse.message && (
                    <span className="ml-2 text-xs">- {apiResponse.message}</span>
                  )}
                </div>

                {/* Step 4: OTP Request */}
                <div className={`flex items-center text-sm ${
                  getStepStatus(4) === 'error' ? 'text-red-600' : 
                  getStepStatus(4) === 'success' ? 'text-green-600' :
                  getStepStatus(4) === 'processing' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  <span className="w-6">{getStatusIcon(getStepStatus(4))}</span>
                  <span>4. OTP Request</span>
                  {apiResponse.step === 4 && apiResponse.message && (
                    <span className="ml-2 text-xs">- {apiResponse.message}</span>
                  )}
                </div>
              </div>

              {/* Detailed API Response */}
              {apiResponse.details && (
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Response Details:</h4>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(apiResponse.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-700 text-sm font-medium">Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || aadhaarNumber.length !== 12}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Creating ABHA...
              </>
            ) : (
              'Create ABHA with Aadhaar'
            )}
          </button>
        </form>

        {/* Removed the security message section */}
      </div>
    </div>
  );
}