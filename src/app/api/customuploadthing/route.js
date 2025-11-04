// app/api/customuploadthing/route.js
import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Public cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Secret API key for server-side only
  api_secret: process.env.CLOUDINARY_API_SECRET, // Secret API secret for server-side only
});

// Edge function for handling POST requests
export const POST = async (req) => {
  try {
    console.log("Request received for Cloudinary upload");

    const { fileName, fileSize, fileType } = await req.json(); // Parse the request body as JSON
    console.log("Received data:", { fileName, fileSize, fileType });

    if (!fileName || !fileSize || !fileType) {
      console.error("Missing required data (fileName, fileSize, fileType)");
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Generate a timestamp for the upload
    const timestamp = Math.floor(Date.now() / 1000);
    console.log("Generated timestamp:", timestamp);

    // Generate Cloudinary signature
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: fileName, // Use custom public_id or default to auto-generated
        resource_type: 'auto', // Auto-detect file type
        type: 'upload', // Explicitly define the upload type
      },
      process.env.CLOUDINARY_API_SECRET // Secret API key for generating the signature
    );
    console.log("Generated signature:", signature);

    return NextResponse.json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      signature,
      timestamp,
      public_id: fileName, // Return the custom public_id (optional)
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return NextResponse.json({ error: 'Failed to generate upload details', details: error.message }, { status: 500 });
  }
};

// Handling other methods like GET is possible but you can add them as needed
export const GET = (req) => {
  console.log("GET request received");
  return NextResponse.json({ message: 'GET requests not allowed for this endpoint' }, { status: 405 });
};
