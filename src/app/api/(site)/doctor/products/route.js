import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/getsession";
import nodemailer from 'nodemailer';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your password
  },
});

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name, brand, category, description, composition, manufacturer,
      batchNumber, expiryDate, manufacturingDate, price, discountPercent,
      stock, unit, prescriptionRequired, productImage, tags, pharmacyId, doctorId
    } = body;

    // Calculate discounted price
    const discountedPrice = discountPercent
      ? price * (1 - discountPercent / 100)
      : null;

    // Create the product
    const product = await db.product.create({
      data: {
        name,
        brand,
        category,
        description,
        composition,
        manufacturer,
        batchNumber,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : null,
        price,
        discountPercent,
        discountedPrice,
        stock,
        unit,
        prescriptionRequired,
        productImage,
        tags,
        pharmacyId,
        doctorId,
        pharmacyLinkedProductId: null  // Initialize as null during creation
      },
      include: {
        pharmacy: {
          select: {
            regname: true,
            email: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Update the product to set the pharmacyLinkedProductId to its own id
    await db.product.update({
      where: { id: product.id },
      data: { pharmacyLinkedProductId: product.id },
    });

    // Send email notification to the pharmacy owner
    if (product.pharmacy.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: product.pharmacy.email,
        subject: `New Product Added by Doctor - ${product.name}`,
        html: `
          <div>
            <h2>New Product Added to Your Pharmacy</h2>
            <p>Doctor ${product.doctor?.firstName} ${product.doctor?.lastName} (${product.doctor?.email}) has added a new product to your pharmacy <strong>${product.pharmacy.regname}</strong>:</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3>Product Details:</h3>
              <p><strong>Name:</strong> ${product.name}</p>
              <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
              <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
              <p><strong>Price:</strong> ₹${product.price}</p>
              <p><strong>Stock:</strong> ${product.stock}</p>
              <p><strong>Manufacturer:</strong> ${product.manufacturer || 'N/A'}</p>
            </div>
            <p>This product is now available in your inventory and can be managed from your pharmacy dashboard.</p>
            <p>Best regards,<br>Your Healthcare Platform</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent to:", product.pharmacy.email);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating doctor product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}