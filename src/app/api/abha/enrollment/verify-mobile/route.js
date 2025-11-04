// src/app/api/abha/enrollment/verify-mobile/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, txnId, encryptedOtp, scope } = body;

    console.log('🔐 Verifying mobile OTP...', {
      txnId: txnId?.substring(0, 8) + '...',
      encryptedOtpLength: encryptedOtp?.length
    });

    const verifyResponse = await axios.post(
      'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm',
      {
        scope: scope || ["abha-address-login", "mobile-verify"],
        authData: {
          authMethods: ["otp"],
          otp: {
            timeStamp: new Date().toISOString().replace('T', ' ').split('.')[0],
            txnId: txnId, // Ensure txnId from OTP request is used
            otpValue: encryptedOtp // Encrypted OTP should be used
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'TIMESTAMP': new Date().toISOString(),
          'REQUEST-ID': generateUUID(),
          'Authorization': `Bearer ${accessToken}`, // Ensure correct token is used
          // 'apikey': '{{APIKEY}}', // If using apikey instead of accessToken
          'X-CM-ID': process.env.X_CM_ID || 'sbx'
        },
        timeout: 15000,
        validateStatus: function (status) {
          return status < 500;
        }
      }
    );

    console.log('✅ Mobile verification response:', {
      status: verifyResponse.status,
      data: verifyResponse.data
    });

    if (verifyResponse.status === 200) {
      return NextResponse.json({
        success: true,
        ...verifyResponse.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `HTTP ${verifyResponse.status}`,
        message: 'Failed to verify mobile OTP',
        details: verifyResponse.data,
        status: verifyResponse.status
      }, { status: verifyResponse.status });
    }

  } catch (error) {
    console.error('❌ Mobile verification failed:', {
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