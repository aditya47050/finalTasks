// src/app/api/abha/enrollment/mobile-otp/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, encryptedMobile, scope } = body;

    console.log('📱 Requesting mobile OTP...', {
      encryptedMobileLength: encryptedMobile?.length,
      scope: scope
    });

    const otpResponse = await axios.post(
      'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp',
      {
        // Remove the txnId from the data payload as it's not required
        scope: scope || ["abha-address-login", "mobile-verify"],
        loginHint: "mobile-number",
        loginId: encryptedMobile,
        otpSystem: "abdm"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'TIMESTAMP': new Date().toISOString(),
          'REQUEST-ID': generateUUID(),
          'Authorization': `Bearer ${accessToken}`,
          'X-CM-ID': process.env.X_CM_ID || 'sbx'
        },
        timeout: 15000,
        validateStatus: function (status) {
          return status < 500;
        }
      }
    );

    console.log('✅ Mobile OTP response:', {
      status: otpResponse.status,
      data: otpResponse.data
    });

    if (otpResponse.status === 200) {
      return NextResponse.json({
        success: true,
        ...otpResponse.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `HTTP ${otpResponse.status}`,
        message: 'Failed to request mobile OTP',
        details: otpResponse.data,
        status: otpResponse.status
      }, { status: otpResponse.status });
    }

  } catch (error) {
    console.error('❌ Mobile OTP request failed:', {
      message: error.message,
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    if (error.response) {
      return NextResponse.json({
        success: false,
        error: 'OTP API Error',
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