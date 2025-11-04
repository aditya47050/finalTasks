import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Missing Parameter',
        message: 'Access token is required'
      }, { status: 400 });
    }

    console.log('📄 Fetching certificate...', {
      accessToken: accessToken ? '***' + accessToken.slice(-10) : 'Not provided'
    });

    // Use the correct certificate endpoint from your documentation
    const config = {
      method: 'get',
      url: 'https://abhasbx.abdm.gov.in/abha/api/v3/profile/public/certificate',
      headers: {
        'REQUEST-ID': generateUUID(),
        'TIMESTAMP': new Date().toISOString(),
        'Authorization': `Bearer ${accessToken}`,
        'X-CM-ID': process.env.X_CM_ID || 'sbx'
      },
      timeout: 15000,
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    };

    console.log('Sending certificate request...');
    
    const response = await axios(config);
    
    console.log('✅ Certificate response:', {
      status: response.status,
      dataLength: response.data ? JSON.stringify(response.data).length : 0
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
        message: 'Failed to fetch certificate',
        details: response.data,
        status: response.status
      }, { status: response.status });
    }

  } catch (error) {
    console.error('❌ Certificate fetch failed:', {
      message: error.message,
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data
    });

    if (error.response) {
      return NextResponse.json({
        success: false,
        error: 'Certificate API Error',
        message: error.response.data?.message || `Server returned ${error.response.status}`,
        details: error.response.data,
        status: error.response.status
      }, { status: error.response.status });
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json({
        success: false,
        error: 'Connection Failed',
        message: 'Unable to connect to certificate server',
        code: error.code
      }, { status: 502 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal Error',
      message: error.message
    }, { status: 500 });
  }
}

// Handle other methods
export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Method Not Allowed',
    message: 'Only GET method is supported for certificate endpoint'
  }, { status: 405 });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}