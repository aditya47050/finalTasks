import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "PHARMACY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pharmacyId } = params;
    const { orderId, receipt, note } = await request.json()

    // Validate parameters
    if (!orderId) {
      return NextResponse.json({ 
        error: "Order ID is required" 
      }, { status: 400 })
    }

    if (!receipt) {
      return NextResponse.json({ 
        error: "Receipt file URL is required" 
      }, { status: 400 })
    }

    // Verify the pharmacy ID matches the logged-in pharmacy
    const pharmacy = await db.pharmacy.findFirst({
      where: { 
        id: pharmacyId,
        email: session.user.email
      },
    })

    if (!pharmacy) {
      return NextResponse.json({ 
        error: "Pharmacy not found or you don't have permission to access this pharmacy" 
      }, { status: 404 })
    }

    // Verify the order belongs to this pharmacy
    const order = await db.pharmacyOrder.findFirst({
      where: { 
        id: orderId,
        pharmacyId: pharmacyId
      },
    })

    if (!order) {
      return NextResponse.json({ 
        error: "Order not found or you don't have permission to access this order" 
      }, { status: 404 })
    }

    // Update the order with receipt
    const updatedOrder = await db.pharmacyOrder.update({
      where: { id: orderId },
      data: {
        receipt: receipt,
        ...(note && { note: note }), // Only update note if provided
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: "Receipt uploaded successfully",
      order: updatedOrder 
    })

  } catch (err) {
    console.error("Error uploading receipt:", err)
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 })
  }
}