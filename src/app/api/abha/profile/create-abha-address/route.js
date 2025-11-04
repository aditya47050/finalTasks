// pages/api/abha/profile/create-abha-address.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, abhaAddress, txnId, preferred = 1 } = body;

    if (!accessToken || !abhaAddress || !txnId) {
      return NextResponse.json({
        success: false,
        error: 'Missing parameters',
        message: 'Access token, ABHA address, and transaction ID are required'
      }, { status: 400 });
    }

    console.log('🔧 Creating ABHA address...', {
      abhaAddress,
      txnId: txnId.substring(0, 8) + '...',
      preferred
    });

    const requestPayload = {
      txnId: txnId,
      abhaAddress: abhaAddress,
      preferred: preferred
    };

    const config = {
      method: 'post',
      url: 'https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/abha-address',
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

    console.log('🚀 Sending ABHA address creation request...');
    
    const response = await axios(config);
    
    console.log('✅ ABHA address creation response:', {
      status: response.status,
      data: response.data
    });

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        abhaAddress: abhaAddress,
        txnId: txnId,
        ...response.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
        message: 'Failed to create ABHA address',
        details: response.data,
        status: response.status
      }, { status: response.status });
    }

  } catch (error) {
    console.error('❌ ABHA address creation failed:', {
      message: error.message,
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    if (error.response) {
      return NextResponse.json({
        success: false,
        error: 'Creation API Error',
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