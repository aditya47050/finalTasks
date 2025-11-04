// components/ABHAFlow/CreateABHAAddress.jsx
import { useState, useEffect } from 'react';

export default function CreateABHAAddress({ onSuccess, onBack, userData }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    const extractedTxnId = userData?.txnId || userData?.data?.txnId;
    if (extractedTxnId) setTxnId(extractedTxnId);

    initializeSession();
  }, [userData]);

  const initializeSession = async () => {
    try {
      const sessionResponse = await fetch('/api/abha/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setAccessToken(sessionData.accessToken);

        if (txnId) getABHAAddressSuggestions(sessionData.accessToken);
      }
    } catch (err) {
      setError('Failed to initialize session');
    }
  };

  const getABHAAddressSuggestions = async (token) => {
    if (!txnId) {
      setError('Transaction ID is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/abha/profile/suggest-abha-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: token,
          txnId,
          name: extractFirstName(userData),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to get suggestions');

      if (data.success && data.abhaAddressList?.length) {
        setSuggestions(data.abhaAddressList);
        setSelectedSuggestion(data.abhaAddressList[0]);
      } else {
        setSuggestions([]);
        setSelectedSuggestion('');
        setError(data.message || 'No suggestions available');
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err.message || 'Failed to fetch suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const extractFirstName = (userData) => {
    const fullName = userData?.data?.ABHAProfile?.name || userData?.fullName || 'user';
    return fullName.split(' ')[0].toLowerCase();
  };

  const handleSuggestionSelect = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleUseSuggestion = async () => {
    if (!selectedSuggestion || !accessToken || !txnId) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/abha/profile/create-abha-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          abhaAddress: selectedSuggestion,
          txnId,
          preferred: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to create ABHA address');

      if (data.success) {
        onSuccess({ abhaAddress: selectedSuggestion, txnId: data.txnId, ...data });
      } else {
        throw new Error(data.message || 'ABHA address creation failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose ABHA Address</h1>
          <p className="text-gray-600">Select from suggested addresses</p>
        </div>

        {isLoading && !suggestions.length ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-t-2 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading suggestions...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-3 mb-6">
            {suggestions.map((suggestion, idx) => (
              <label
                key={idx}
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition duration-200 ${
                  selectedSuggestion === suggestion
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <input
                  type="radio"
                  name="abhaSuggestion"
                  value={suggestion}
                  checked={selectedSuggestion === suggestion}
                  onChange={() => handleSuggestionSelect(suggestion)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{suggestion}</p>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center mb-6">
            <p className="text-gray-600">No suggestions available</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleUseSuggestion}
          disabled={!selectedSuggestion || isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
              Creating...
            </>
          ) : (
            `Use ${selectedSuggestion}`
          )}
        </button>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">About ABHA Address</h3>
          <p className="text-sm text-purple-700">
            Your ABHA address is a unique username that allows you to access and share your health records securely across healthcare providers.
          </p>
        </div>
      </div>
    </div>
  );
}
