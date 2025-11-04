import { NextResponse } from 'next/server';
import { encryptData } from '@/lib/encryption';

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, publicKey } = body;

    if (!data || !publicKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Parameters',
        message: 'Data and public key are required'
      }, { status: 400 });
    }

    console.log('🔐 Server-side encryption requested...');

    try {
      const encryptedData = encryptData(data, publicKey);
      
      return NextResponse.json({
        success: true,
        encryptedData: encryptedData
      });

    } catch (encryptionError) {
      console.error('❌ Server-side encryption failed:', encryptionError);
      return NextResponse.json({
        success: false,
        error: 'Encryption Failed',
        message: encryptionError.message,
        details: 'Failed to encrypt data with the provided public key'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Encryption API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal Error',
      message: error.message
    }, { status: 500 });
  }
}