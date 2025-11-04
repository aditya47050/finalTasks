// components/ABHAFlow/UpdateEmail.jsx
import { useState } from 'react';

export default function UpdateEmail({ onSuccess, onBack, currentEmail, userData }) {
  const [email, setEmail] = useState(currentEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📧 Starting email verification process...');

      // Step 1: Create session
      const sessionResponse = await fetch('/api/abha/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!sessionResponse.ok) throw new Error('Failed to create session');
      const sessionData = await sessionResponse.json();
      const accessToken = sessionData.accessToken;

      // Step 2: Get encryption certificate
      const certResponse = await fetch(`/api/abha/certificate?accessToken=${accessToken}`);
      if (!certResponse.ok) throw new Error('Failed to get certificate');
      const certData = await certResponse.json();

      // Step 3: Encrypt email using the encryption API
      const encryptResponse = await fetch('/api/abha/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: email,
          publicKey: certData.publicKey
        }),
      });

      if (!encryptResponse.ok) throw new Error('Failed to encrypt email');
      const encryptResult = await encryptResponse.json();
      const encryptedEmail = encryptResult.encryptedData;

      console.log('✅ Email encrypted successfully');

      // Step 4: Get X-token from user data (from previous steps)
      // The X-token should be available in userData from the verification response
      const xToken = userData?.xToken || userData?.userData?.xToken || userData?.tokens?.token;
      
      if (!xToken) {
        throw new Error('X-Token not available. Please complete previous verification steps first.');
      }

      console.log('📤 Sending email verification request...');

      // Step 5: Send email verification link
      const emailResponse = await fetch('/api/abha/profile/email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          encryptedEmail,
          xToken: xToken,
          scope: ['abha-profile', 'email-link-verify']
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(emailData.message || 'Failed to send verification link');
      }

      console.log('✅ Email verification link sent successfully:', emailData);
      
      setSuccess('Verification link sent to your email address. Please check your inbox and click the link to verify your email.');
      
      // Optionally, you can automatically proceed after a delay
      // Or wait for user to manually proceed after verifying email
      setTimeout(() => {
        onSuccess({ 
          email,
          message: 'Verification link sent successfully'
        });
      }, 5000);
      
    } catch (err) {
      console.error('❌ Email verification failed:', err);
      setError(err.message || 'Failed to send verification link. Please try again.');
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
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Email Address</h1>
          <p className="text-gray-600">Enter your email address to receive verification link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

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

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-green-700 text-sm font-medium">Success</p>
                  <p className="text-green-600 text-sm mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Sending Verification Link...
              </>
            ) : (
              'Send Verification Link'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> A verification link will be sent to your email address. Click on the link to verify and update your email. This may take a few minutes.
          </p>
        </div>

        {/* Security Information */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-blue-700 text-sm font-medium">Secure Encryption</p>
              <p className="text-blue-600 text-sm mt-1">
                Your email address is securely encrypted using RSA-OAEP encryption before being sent to the server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}