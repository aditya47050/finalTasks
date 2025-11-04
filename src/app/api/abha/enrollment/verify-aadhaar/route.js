import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      accessToken, 
      txnId, 
      encryptedOtp, 
      mobile,
      timestamp = new Date().toISOString().replace('T', ' ').slice(0, 23)
    } = body;

    if (!accessToken || !txnId || !encryptedOtp || !mobile) {
      return NextResponse.json({
        success: false,
        error: 'Missing Parameters',
        message: 'Access token, transaction ID, encrypted OTP, and mobile are required'
      }, { status: 400 });
    }

    console.log('✅ Verifying Aadhaar OTP for enrollment...');

    const requestPayload = {
      authData: {
        authMethods: ["otp"],
        otp: {
          timeStamp: timestamp,
          txnId: txnId,
          otpValue: encryptedOtp,
          mobile: mobile
        }
      },
      consent: {
        code: "abha-enrollment",
        version: "1.4"
      }
    };

    console.log('Verification payload:', {
      txnId: requestPayload.authData.otp.txnId,
      mobile: requestPayload.authData.otp.mobile,
      timestamp: requestPayload.authData.otp.timeStamp
    });

    const config = {
      method: 'post',
      url: 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar',
      data: requestPayload,
      headers: {
        'Content-Type': 'application/json',
        'REQUEST-ID': generateUUID(),
        'TIMESTAMP': new Date().toISOString(),
        'Authorization': `Bearer ${accessToken}`,
        'X-CM-ID': process.env.X_CM_ID || 'sbx'
      },
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500;
      }
    };

    console.log('Sending OTP verification request to:', config.url);
    
    const response = await axios(config);
    
    console.log('✅ OTP verification response:', {
      status: response.status,
      data: response.data
    });

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        ...response.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
        message: 'Failed to verify OTP',
        details: response.data,
        status: response.status
      }, { status: response.status });
    }

  } catch (error) {
    console.error('❌ OTP verification failed:', {
      message: error.message,
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    if (error.response) {
      return NextResponse.json({
        success: false,
        error: 'Verification API Error',
        message: error.response.data?.message || `Server returned ${error.response.status}`,
        details: error.response.data,
        status: error.response.status
      }, { status: error.response.status });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal Error',
      message: error.message
    }, { status: 500 });
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}