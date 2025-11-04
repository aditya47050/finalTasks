import { useState, useRef, useEffect } from 'react';

export default function OTPVerification({ txnId, accessToken, onSuccess, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

// In OTPVerification.jsx - Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      throw new Error('Please enter complete OTP');
    }

    if (!mobile) {
      throw new Error('Please enter mobile number');
    }

    console.log('🔐 STEP 5: Encrypting and verifying OTP...');

    // Step 1: Get encryption certificate
    console.log('📜 Getting encryption certificate for OTP...');
    const certResponse = await fetch(`/api/abha/certificate?accessToken=${encodeURIComponent(accessToken)}`);
    
    if (!certResponse.ok) {
      const errorText = await certResponse.text();
      throw new Error(`Certificate fetch failed: ${errorText}`);
    }

    const certData = await certResponse.json();
    console.log('✅ Certificate data:', certData);

    // Step 2: Encrypt OTP
    console.log('🔒 Encrypting OTP...');
    const encryptResponse = await fetch('/api/abha/encrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: otpValue,
        publicKey: certData.publicKey
      }),
    });

    if (!encryptResponse.ok) {
      const errorText = await encryptResponse.text();
      throw new Error(`Encryption failed: ${errorText}`);
    }

    const encryptResult = await encryptResponse.json();
    console.log('✅ Encrypt result:', encryptResult);

    const encryptedOtp = encryptResult.encryptedData;

    // Step 3: Verify OTP
    console.log('📱 Verifying OTP with ABHA API...');
    const verifyResponse = await fetch('/api/abha/enrollment/verify-aadhaar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
        txnId,
        encryptedOtp,
        mobile
      }),
    });

    console.log('📡 Verify Response Status:', verifyResponse.status);
    
    const responseText = await verifyResponse.text();
    console.log('📄 Raw Response Text:', responseText);

    let verifyData;
    try {
      verifyData = JSON.parse(responseText);
      console.log('✅ Parsed JSON Response:', verifyData);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error(`Response is not valid JSON: ${responseText}`);
    }

    // JUST PASS WHATEVER WE RECEIVED TO onSuccess
    console.log('🎉 Passing raw response to parent:', verifyData);
    onSuccess(verifyData);

  } catch (err) {
    console.error('❌ OTP verification failed:', err.message);
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h1>
          <p className="text-gray-600">Enter the OTP sent to your registered mobile number</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number for Communication
            </label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={10}
              required
            />
          </div>

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
            disabled={isLoading || otp.join('').length !== 6 || mobile.length !== 10}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Didn't receive OTP? Resend
          </button>
        </div>
      </div>
    </div>
  );
}