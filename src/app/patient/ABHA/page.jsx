"use client";
import { useState } from 'react';
import ABHAWelcome from './component/ABHAFlow/ABHAWelcome';
import AadhaarVerification from './component/ABHAFlow/AadhaarVerification';
import OTPVerification from './component/ABHAFlow/OTPVerification';
import UserDetails from './component/ABHAFlow/UserDetails';
import UpdateMobile from './component/ABHAFlow/UpdateMobile';
import UpdateEmail from './component/ABHAFlow/UpdateEmail';
import ABHALogin from './component/ABHAFlow/ABHALogin';
import PatientIntegration from './component/ABHAFlow/PatientIntegration';
import PasswordSetup from './component/ABHAFlow/PasswordSetup'; // Add this import
import CreateABHAAddress from './component/ABHAFlow/CreateABHAAddress';

export default function ABHAFlow() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [flowData, setFlowData] = useState({});

  const steps = {
    welcome: {
      component: <ABHAWelcome onSelection={handleWelcomeSelection} />,
      title: 'Welcome'
    },
    aadhaar: {
      component: <AadhaarVerification 
        onSuccess={handleAadhaarSuccess} 
        onBack={() => setCurrentStep('welcome')} 
      />,
      title: 'Aadhaar Verification'
    },
    otp: {
      component: <OTPVerification 
        txnId={flowData.txnId}
        accessToken={flowData.accessToken}
        onSuccess={handleOTPSuccess}
        onBack={() => setCurrentStep('aadhaar')}
      />,
      title: 'OTP Verification'
    },
    details: {
      component: <UserDetails 
        userData={flowData.userData || {}}
        onUpdateMobile={() => setCurrentStep('update-mobile')}
        onUpdateEmail={() => setCurrentStep('update-email')}
        onCreateABHA={() => setCurrentStep('create-abha')}
        onComplete={handleUserDetailsComplete} // Update this line
        onBack={() => setCurrentStep('otp')} 
      />,
      title: 'User Details'
    },
    'update-mobile': {
      component: <UpdateMobile 
        onSuccess={handleMobileUpdateSuccess}
        onBack={() => setCurrentStep('details')}
        currentMobile={flowData.userData?.mobile}
      />,
      title: 'Update Mobile'
    },
    'update-email': {
      component: <UpdateEmail 
        onSuccess={handleEmailUpdateSuccess}
        onBack={() => setCurrentStep('details')}
        currentEmail={flowData.userData?.email}
        userData={flowData.userData}
      />,
      title: 'Update Email'
    },
    'password-setup': {
      component: <PasswordSetup 
        patientData={flowData.patientData}
        onComplete={handlePasswordSetupComplete}
        onBack={() => setCurrentStep('details')}
      />,
      title: 'Set Password'
    },
    'patient-integration': {
      component: <PatientIntegration 
        userData={flowData.userData || {}}
        onComplete={handlePatientIntegrationComplete}
        onBack={() => setCurrentStep('details')}
      />,
      title: 'Patient Setup'
    }
  };

  function handleWelcomeSelection(selection) {
    if (selection === 'no-card') {
      setCurrentStep('aadhaar');
    } else {
      setCurrentStep('login');
    }
  }

  function handleAadhaarSuccess(data) {
    setFlowData(prev => ({ ...prev, ...data }));
    setCurrentStep('otp');
  }

  function handleOTPSuccess(verifyData) {
    console.log('🎉 OTP Verification Response Received:');
    console.log('📊 Full Response Object:', verifyData);
    console.log('🔍 Response Keys:', Object.keys(verifyData));
    
    setFlowData(prev => ({ 
      ...prev, 
      userData: verifyData
    }));
    
    setCurrentStep('details');
    
    console.log('➡️ Moving to details step to display received data');
  }

  function handleMobileUpdateSuccess(updateData) {
    setFlowData(prev => ({
      ...prev,
      userData: { ...prev.userData, mobile: updateData.mobile }
    }));
    setCurrentStep('details');
  }

  function handleEmailUpdateSuccess(updateData) {
    console.log('✅ Email update successful:', updateData);
    
    setFlowData(prev => ({
      ...prev,
      userData: { 
        ...prev.userData, 
        email: updateData.email,
        emailVerificationSent: true,
        emailVerificationMessage: updateData.message
      }
    }));
    
    setCurrentStep('details');
  }

  function handleABHASuccess(data) {
    console.log('ABHA address created:', data);
    setCurrentStep('patient-integration');
  }

  function handleLoginSuccess(loginData) {
    setFlowData(prev => ({ ...prev, ...loginData }));
    setCurrentStep('patient-integration');
  }

  function handlePatientIntegrationComplete(patientData) {
    console.log('Patient integration complete:', patientData);
    alert('Patient profile setup completed successfully!');
    // You can redirect here: router.push('/dashboard');
  }

  function handlePasswordSetupComplete(patientResult) {
    console.log('✅ Patient profile created successfully:', patientResult);
    alert('Patient profile setup completed successfully!');
    // You can redirect to dashboard: router.push('/dashboard');
  }

  function handleUserDetailsComplete(patientData) {
    console.log('🎉 User details complete, proceeding to password setup:', patientData);
    
    // Store patient data and move to password setup
    setFlowData(prev => ({
      ...prev,
      patientData: patientData
    }));
    
    setCurrentStep('password-setup');
  }
  
  return (
    <div>
      {/* Progress Bar - Hide for some steps */}
      {!['welcome', 'patient-integration', 'password-setup'].includes(currentStep) && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 overflow-x-auto">
                {Object.keys(steps)
                  .filter(step => !['welcome', 'patient-integration', 'password-setup'].includes(step))
                  .map((step, index, filteredSteps) => (
                  <div key={step} className="flex items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : index < filteredSteps.indexOf(currentStep)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        currentStep === step ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {steps[step].title}
                    </span>
                    {index < filteredSteps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-4 ${
                          index < filteredSteps.indexOf(currentStep)
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500 flex-shrink-0">
                Step {Object.keys(steps)
                  .filter(step => !['welcome', 'patient-integration', 'password-setup'].includes(step))
                  .indexOf(currentStep) + 1} of {Object.keys(steps)
                  .filter(step => !['welcome', 'patient-integration', 'password-setup'].includes(step)).length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={!['welcome', 'patient-integration', 'password-setup'].includes(currentStep) ? 'pt-20' : ''}>
        {steps[currentStep].component}
      </div>
    </div>
  );
}