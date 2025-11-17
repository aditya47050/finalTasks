import { NextResponse } from "next/server";
import { db } from '@/lib/db';
import { getSession } from '@/lib/getsession';
import bcrypt from "bcrypt";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const seller = await db.martSeller.findFirst({
      where: { id: session.id },
      include: { brands: true }, // include all brands of seller
    });

    if (!seller) {
      return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
    }

    const { password, ...sellerData } = seller;

    return NextResponse.json({ success: true, data: sellerData });
  } catch (error) {
    console.error("[Profile GET error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const seller = await db.martSeller.findFirst({ where: { id: session.id } });
    if (!seller) {
      return NextResponse.json({ success: false, error: "Seller not found" }, { status: 404 });
    }

    const updateData = {};

    if (body.mobile) updateData.mobile = body.mobile;
    if (body.pincode) updateData.pincode = body.pincode;
    if (body.address) updateData.address = body.address;

    if (body.currentPassword && body.newPassword) {
      updateData.password = await bcrypt.hash(body.newPassword, 10);
    }

    const updatedSeller = await db.martSeller.update({
      where: { id: seller.id },
      data: updateData,
      include: { brands: true }, // include brands in response
    });

    const { password, ...sellerData } = updatedSeller;
    return NextResponse.json({ success: true, data: sellerData });
  } catch (error) {
    console.error("[Profile PATCH error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
