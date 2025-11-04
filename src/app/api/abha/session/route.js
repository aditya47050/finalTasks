import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    console.log('🔐 Creating ABHA session...');
    
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.log('No JSON body provided, using environment variables');
      body = {};
    }
    
    const requestPayload = {
      clientId: body.clientId || process.env.ABHA_CLIENT_ID,
      clientSecret: body.clientSecret || process.env.ABHA_CLIENT_SECRET,
      grantType: 'client_credentials'
    };

    console.log('Request details:', {
      clientId: requestPayload.clientId ? '***' + requestPayload.clientId.slice(-4) : 'Not provided',
      hasClientSecret: !!requestPayload.clientSecret,
      endpoint: 'https://dev.abdm.gov.in/gateway/v0.5/sessions',
      timestamp: new Date().toISOString()
    });

    // Validate required parameters
    if (!requestPayload.clientId || !requestPayload.clientSecret) {
      return NextResponse.json({
        success: false,
        error: 'Missing Credentials',
        message: 'Client ID and Client Secret are required. Please check your environment variables.',
        details: {
          clientId: !!requestPayload.clientId,
          clientSecret: !!requestPayload.clientSecret
        }
      }, { status: 400 });
    }

    const config = {
      method: 'post',
      url: 'https://dev.abdm.gov.in/gateway/v0.5/sessions',
      data: requestPayload,
      headers: {
        'Content-Type': 'application/json',
        'REQUEST-ID': generateUUID(),
        'TIMESTAMP': new Date().toISOString(),
        'X-CM-ID': process.env.X_CM_ID || 'sbx'
      },
      timeout: 30000,
      // Handle raw response first
      transformResponse: [(data) => {
        // Return raw data, we'll parse it manually
        return data;
      }]
    };

    console.log('Sending request to ABDM gateway...');
    
    const response = await axios(config);
    
    console.log('✅ Raw response received:', {
      status: response.status,
      statusText: response.statusText,
      dataLength: response.data ? response.data.length : 0,
      contentType: response.headers['content-type']
    });

    let responseData;
    
    // Try to parse JSON response
    if (response.data && typeof response.data === 'string') {
      try {
        responseData = JSON.parse(response.data);
        console.log('✅ Response parsed as JSON successfully');
      } catch (parseError) {
        console.log('❌ Response is not valid JSON:', response.data.substring(0, 200));
        return NextResponse.json({
          success: false,
          error: 'Invalid Response Format',
          message: 'Server returned non-JSON response',
          rawResponse: response.data.substring(0, 500),
          status: response.status
        }, { status: 500 });
      }
    } else if (typeof response.data === 'object') {
      responseData = response.data;
    } else {
      responseData = {};
    }

    if (response.status === 200) {
      if (responseData.accessToken) {
        return NextResponse.json({
          success: true,
          ...responseData
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Invalid Response',
          message: 'Session created but no access token received',
          details: responseData,
          status: response.status
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
        message: responseData?.message || response.statusText || 'Request failed',
        details: responseData,
        status: response.status
      }, { status: response.status });
    }

  } catch (error) {
    console.error('❌ Session creation failed:', {
      message: error.message,
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
      stack: error.stack
    });

    // Handle different types of errors
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        success: false,
        error: 'Connection Refused',
        message: 'Unable to connect to ABDM server. The server may be down or unreachable.',
        code: 'CONNECTION_REFUSED'
      }, { status: 503 });
    }

    if (error.code === 'ENOTFOUND') {
      return NextResponse.json({
        success: false,
        error: 'DNS Lookup Failed',
        message: 'Cannot resolve ABDM server hostname. Check your internet connection.',
        code: 'DNS_ERROR'
      }, { status: 502 });
    }

    if (error.code === 'ETIMEDOUT') {
      return NextResponse.json({
        success: false,
        error: 'Request Timeout',
        message: 'The request to ABDM server timed out after 30 seconds.',
        code: 'TIMEOUT'
      }, { status: 504 });
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      let errorData = error.response.data;
      
      // Try to parse response data if it's a string
      if (typeof errorData === 'string') {
        try {
          errorData = JSON.parse(errorData);
        } catch (e) {
          // Keep as string if not JSON
          errorData = { rawMessage: errorData.substring(0, 500) };
        }
      }

      return NextResponse.json({
        success: false,
        error: 'ABDM API Error',
        message: errorData?.message || `Server returned ${status} status`,
        details: errorData,
        status: status
      }, { status: status });
    }

    if (error.request) {
      // The request was made but no response was received
      return NextResponse.json({
        success: false,
        error: 'No Response',
        message: 'No response received from ABDM server. The request was sent but no reply was received.',
        code: 'NO_RESPONSE'
      }, { status: 502 });
    }

    // Something else happened
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}

// Test endpoint to verify connectivity
export async function GET() {
  return NextResponse.json({
    message: 'ABHA Session API',
    status: 'active',
    endpoints: {
      POST: '/api/abha/session - Create session token'
    },
    environment: {
      hasClientId: !!process.env.ABHA_CLIENT_ID,
      hasClientSecret: !!process.env.ABHA_CLIENT_SECRET,
      xCmId: process.env.X_CM_ID || 'sbx'
    }
  });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}