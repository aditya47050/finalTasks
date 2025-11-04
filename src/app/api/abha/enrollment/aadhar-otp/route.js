import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  console.log('🔵 ========== BACKEND: AADHAAR OTP REQUEST STARTED ==========');
  
  try {
    const body = await request.json();
    const { accessToken, encryptedAadhaar } = body;

    console.log('📦 Backend: Request Body Received:', {
      accessToken: body.accessToken ? `...${body.accessToken.slice(-10)}` : 'MISSING',
      encryptedAadhaarLength: body.encryptedAadhaar?.length || 'MISSING'
    });

    if (!accessToken || !encryptedAadhaar) {
      console.error('❌ Backend: Missing parameters');
      return NextResponse.json({
        success: false,
        error: 'Missing Parameters',
        message: 'Access token and encrypted Aadhaar are required'
      }, { status: 400 });
    }

    console.log('📱 Backend: Requesting Aadhaar OTP for ABHA enrollment...');

    const requestPayload = {
      txnId: "",
      scope: ["abha-enrol"],
      loginHint: "aadhaar", 
      loginId: encryptedAadhaar,
      otpSystem: "aadhaar"
    };

    const requestId = generateUUID();
    const timestamp = new Date().toISOString();
    
    const config = {
      method: 'post',
      url: 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp',
      data: requestPayload,
      headers: {
        'Content-Type': 'application/json',
        'REQUEST-ID': requestId,
        'TIMESTAMP': timestamp,
        'Authorization': `Bearer ${accessToken}`,
        'X-CM-ID': process.env.X_CM_ID || 'sbx'
      },
      timeout: 30000,
    };

    console.log('🚀 Backend: Sending request to ABHA API...');
    console.log('🌐 Backend: Request Config:', {
      url: config.url,
      method: config.method,
      requestId,
      timestamp,
      xCmId: config.headers['X-CM-ID']
    });

    const response = await axios(config);
    
    console.log('✅ Backend: Received response from ABHA API');
    console.log('📨 Backend: Response Details:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    // Handle successful response
    if (response.status === 200) {
      console.log('🎉 Backend: OTP request successful');
      console.log('📝 Backend: Transaction ID:', response.data.txnId);
      console.log('💬 Backend: Message:', response.data.message);
      
      return NextResponse.json({
        success: true,
        txnId: response.data.txnId,
        message: response.data.message,
        ...response.data
      });
    }

    // Handle other status codes
    console.warn('⚠️ Backend: Non-200 response from ABHA API');
    return NextResponse.json({
      success: false,
      error: `HTTP ${response.status}`,
      message: response.data?.message || 'Request failed',
      details: response.data,
      status: response.status
    }, { status: response.status });

  } catch (error) {
    console.error('❌ ========== BACKEND: REQUEST FAILED ==========');
    console.error('❌ Backend: Error details:', {
      message: error.message,
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    if (error.response) {
      return NextResponse.json({
        success: false,
        error: 'API Error',
        message: error.response.data?.message || `Server returned ${error.response.status}`,
        details: error.response.data,
        status: error.response.status
      }, { status: error.response.status });
    }

    return NextResponse.json({
      success: false,
      error: 'Request Failed',
      message: error.message
    }, { status: 500 });
  } finally {
    console.log('🔵 ========== BACKEND: REQUEST COMPLETED ==========');
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}