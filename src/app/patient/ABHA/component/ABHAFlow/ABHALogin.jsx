// components/ABHAFlow/ABHALogin.jsx
import { useState, useRef } from 'react';
import { encryptData } from '../../../../../lib/encryption'; 

export default function ABHALogin({ onSuccess, onBack }) {
  const [step, setStep] = useState('select-method'); // 'select-method', 'enter-mobile', 'verify-otp'
  const [loginMethod, setLoginMethod] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txnId, setTxnId] = useState('');
  const inputRefs = useRef([]);

  const loginMethods = [
    {
      id: 'mobile',
      title: 'Mobile OTP',
      description: 'Login using mobile number and OTP',
      icon: '📱'
    },
    {
      id: 'abha-number',
      title: 'ABHA Number',
      description: 'Login using ABHA number with mobile OTP',
      icon: '🆔'
    },
    {
      id: 'aadhaar',
      title: 'Aadhaar Number',
      description: 'Login using Aadhaar number with OTP',
      icon: '🔐'
    },
    {
      id: 'abha-address',
      title: 'ABHA Address',
      description: 'Login using ABHA address with mobile OTP',
      icon: '📧'
    }
  ];

  const handleMethodSelect = (methodId) => {
    setLoginMethod(methodId);
    setError('');

    // For mobile login, proceed to enter mobile number
    if (methodId === 'mobile') {
      setStep('enter-mobile');
    } else {
      // For other methods, show coming soon or implement accordingly
      setError(`${methodId.replace('-', ' ')} login is coming soon. Please use mobile OTP for now.`);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📱 Sending OTP to mobile:', mobileNumber);

      // Step 1: Create session
      const sessionResponse = await fetch('/api/abha/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }

      const sessionData = await sessionResponse.json();
      const accessToken = sessionData.accessToken;

      // Step 2: Get encryption certificate
      const certResponse = await fetch(`/api/abha/certificate?accessToken=${accessToken}`);
      if (!certResponse.ok) {
        throw new Error('Failed to get certificate');
      }

      const certData = await certResponse.json();

      // Step 3: Encrypt mobile number
      const encryptedMobile = encryptData(mobileNumber, certData.publicKey);

      // Step 4: Request mobile OTP for login
      const otpResponse = await fetch('/api/abha/enrollment/mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          encryptedMobile,
          scope: ["abha-enrol", "mobile-verify"]
        }),
      });

      const otpData = await otpResponse.json();
      
      if (!otpResponse.ok || !otpData.txnId) {
        throw new Error(otpData.message || 'Failed to send OTP');
      }

      console.log('✅ Transaction ID:', otpData.txnId);
      setTxnId(otpData.txnId);
      setStep('verify-otp');

    } catch (err) {
      console.error('OTP request failed:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log('🔐 Verifying OTP for mobile login...');
  
      // Step 1: Create session
      const sessionResponse = await fetch('/api/abha/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }
  
      const sessionData = await sessionResponse.json();
      const accessToken = sessionData.accessToken;
  
      // Step 2: Get encryption certificate
      const certResponse = await fetch(`/api/abha/certificate?accessToken=${accessToken}`);
      if (!certResponse.ok) {
        throw new Error('Failed to get certificate');
      }
  
      const certData = await certResponse.json();
  
      // Step 3: Encrypt OTP
      const encryptedOtp = encryptData(otpValue, certData.publicKey);
  
      // Step 4: Verify OTP with ABHA API
      const verifyResponse = await fetch('/api/abha/enrollment/verify-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          txnId,
          encryptedOtp,
          scope: ["abha-enrol", "mobile-verify"]
        }),
      });
  
      const verifyData = await verifyResponse.json();
  
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Failed to verify OTP');
      }
  
      console.log('✅ Mobile verification successful:', verifyData);
  
      // Step 5: Get user profile using the X-token from verification response
      if (verifyData.success && verifyData.tokens) {
        const xToken = verifyData.tokens.token;
        
        console.log('📋 Fetching user profile with X-token...');
        
        // Get user profile
        const profileResponse = await fetch('/api/abha/profile/get-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken,
            xToken: xToken
          }),
        });
  
        let userProfile = {};
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          userProfile = profileData;
          console.log('✅ User profile fetched:', profileData);
        } else {
          console.warn('⚠️ Could not fetch user profile, using verification data');
          userProfile = {
            ABHAProfile: verifyData.ABHAProfile || {},
            message: verifyData.message,
            isNew: verifyData.isNew
          };
        }
  
        // Step 6: Get ABHA Card
        console.log('🪪 Fetching ABHA card...');
        let abhaCardData = null;
        
        const abhaCardResponse = await fetch('/api/abha/profile/get-abha-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken,
            xToken: xToken
          }),
        });
  
        if (abhaCardResponse.ok) {
          const cardData = await abhaCardResponse.json();
          abhaCardData = cardData;
          console.log('✅ ABHA card fetched:', cardData);
        } else {
          console.warn('⚠️ Could not fetch ABHA card');
        }
  
        // Step 7: Integrate with patient database
        console.log('🔗 Integrating with patient database...');
        
        const integrationResponse = await fetch('/api/abha/patients/integrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileData: userProfile,
            abhaCardData: abhaCardData,
            accessToken: accessToken,
            xToken: xToken
          }),
        });
  
        const integrationData = await integrationResponse.json();
  
        if (!integrationResponse.ok) {
          throw new Error(integrationData.error || 'Failed to integrate patient');
        }
  
        console.log('✅ Patient integration successful:', integrationData);
  
        // Success - pass all data to onSuccess
        onSuccess({
          method: 'mobile',
          userData: {
            mobile: mobileNumber,
            mobileVerified: true,
            message: 'Login successful',
            txnId: verifyData.txnId,
            accessToken: accessToken,
            xToken: xToken,
            ...verifyData,
            ...userProfile,
            integration: integrationData,
            isExistingUser: true
          }
        });
      } else {
        throw new Error(verifyData.message || 'Verification failed - no tokens received');
      }
  
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError(err.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMethods = () => {
    setStep('select-method');
    setLoginMethod('');
    setMobileNumber('');
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  // Method Selection Step
  if (step === 'select-method') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          {onBack && (
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          )}

          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ABHA Login</h1>
            <p className="text-gray-600">Choose your preferred login method</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loginMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method.id)}
                disabled={isLoading}
                className={`p-6 border-2 rounded-xl text-left transition duration-200 ${
                  loginMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{method.title}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Secure Login</h3>
            <p className="text-sm text-blue-700">
              All login methods are secure and compliant with ABDM guidelines. Your data is protected with encryption.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Enter Mobile Number Step
  if (step === 'enter-mobile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <button onClick={handleBackToMethods} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Methods
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter Mobile Number</h1>
            <p className="text-gray-600">We'll send an OTP to verify your number</p>
          </div>

          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={10}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || mobileNumber.length !== 10}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Verify OTP Step
  if (step === 'verify-otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <button onClick={() => setStep('enter-mobile')} className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Mobile
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h1>
            <p className="text-gray-600">Enter the OTP sent to {mobileNumber.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')}</p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OTP
              </label>
              <div className="flex space-x-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={handleSendOTP}
              className="text-blue-600 hover:text-blue-800 text-sm"
              disabled={isLoading}
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}