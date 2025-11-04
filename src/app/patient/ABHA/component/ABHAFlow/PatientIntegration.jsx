import { useState, useEffect } from 'react';

export default function PatientIntegration({ userData, onComplete }) {
  const [existingPatients, setExistingPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkExistingPatients();
  }, [userData]);

  const checkExistingPatients = async () => {
    try {
      // Check if patient exists with same email or mobile
      const response = await fetch('/api/abha/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          mobile: userData.mobile
        })
      });

      if (response.ok) {
        const data = await response.json();
        setExistingPatients(data.patients || []);
      }
    } catch (err) {
      console.error('Error checking patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/patients/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          abhacard: true,
          abhaCardNumber: userData.abhaNumber,
          profileComplete: true
        })
      });

      if (!response.ok) throw new Error('Failed to create patient');
      
      const patientData = await response.json();
      onComplete(patientData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePatient = async () => {
    if (!selectedPatient) return;
    
    setIsSaving(true);
    setError('');

    try {
      const response = await fetch('/api/patients/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient,
          abhaData: userData,
          abhacard: true,
          abhaCardNumber: userData.abhaNumber
        })
      });

      if (!response.ok) throw new Error('Failed to update patient');
      
      const patientData = await response.json();
      onComplete(patientData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-t-2 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Checking existing records...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profile Setup</h1>
          <p className="text-gray-600">Complete your patient profile setup</p>
        </div>

        {/* ABHA Details Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">ABHA Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">ABHA Number:</span>
              <p className="font-semibold">{userData.abhaNumber}</p>
            </div>
            <div>
              <span className="text-blue-700">Name:</span>
              <p className="font-semibold">{userData.fullName}</p>
            </div>
            {userData.mobile && (
              <div>
                <span className="text-blue-700">Mobile:</span>
                <p className="font-semibold">{userData.mobile}</p>
              </div>
            )}
            {userData.email && (
              <div>
                <span className="text-blue-700">Email:</span>
                <p className="font-semibold">{userData.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Existing Patients Selection */}
        {existingPatients.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Existing Patient Records Found</h3>
            <p className="text-gray-600 mb-4">We found existing patient records with similar details. Would you like to link your ABHA with an existing record?</p>
            
            <div className="space-y-3 mb-4">
              {existingPatients.map(patient => (
                <label key={patient.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="existingPatient"
                    value={patient.id}
                    checked={selectedPatient === patient.id}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {patient.email} • {patient.mobile ? `******${patient.mobile.slice(-4)}` : 'No mobile'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleUpdatePatient}
              disabled={!selectedPatient || isSaving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 mb-4"
            >
              {isSaving ? 'Linking...' : 'Link with Selected Patient'}
            </button>

            <div className="text-center">
              <span className="text-gray-500">or</span>
            </div>
          </div>
        )}

        {/* Create New Patient */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            {existingPatients.length > 0 ? 'Create New Patient Record' : 'Create Patient Record'}
          </h3>
          
          <button
            onClick={handleCreatePatient}
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {isSaving ? 'Creating...' : 'Create New Patient Record'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Your ABHA details will be linked to your patient profile</li>
            <li>• You can access digital health records</li>
            <li>• Healthcare providers can view your medical history with consent</li>
            <li>• You can manage your health data securely</li>
          </ul>
        </div>
      </div>
    </div>
  );
}