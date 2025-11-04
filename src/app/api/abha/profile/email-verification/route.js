// src/app/api/abha/profile/email-verification/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import { encryptData } from '@/lib/encryption';

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, encryptedEmail, scope, xToken } = body;

    if (!accessToken || !encryptedEmail || !xToken) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: accessToken, encryptedEmail, and xToken are required'
      }, { status: 400 });
    }

    console.log('📧 Requesting email verification link...', {
      encryptedEmailLength: encryptedEmail?.length,
      scope: scope
    });

    const requestPayload = {
      scope: scope || ["abha-profile", "email-link-verify"],
      loginHint: "email",
      loginId: encryptedEmail,
      otpSystem: "abdm"
    };

    const config = {
      method: 'post',
      url: 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/emailVerificationLink',
      data: requestPayload,
      headers: {
        'Content-Type': 'application/json',
        'REQUEST-ID': generateUUID(),
        'TIMESTAMP': new Date().toISOString(),
        'X-token': `Bearer ${xToken}`,
        'Authorization': `Bearer ${accessToken}`,
        'X-CM-ID': process.env.X_CM_ID || 'sbx'
      },
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500;
      }
    };

    console.log('🚀 Sending email verification request to ABHA API...');
    
    const response = await axios(config);
    
    console.log('✅ Email verification response:', {
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
        message: 'Failed to send email verification link',
        details: response.data,
        status: response.status
      }, { status: response.status });
    }

  } catch (error) {
    console.error('❌ Email verification failed:', {
      message: error.message,
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    if (error.response) {
      return NextResponse.json({
        success: false,
        error: 'Email Verification API Error',
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