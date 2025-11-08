import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("💳 Seeding Cashless Payment Methods...");

  // Find existing insurance record
  const insurance = await prisma.healthInsurance.findUnique({
    where: { id: "6880cdd55f7a804c4ff8d547" },
  });

  if (!insurance) {
    console.log("❌ No insurance found with given ID!");
    return;
  }

  // Define cashless services JSON
  const cashlessServices = [
    {
      type: "BHIM UPI",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/BHIM_UPI_logo.svg/512px-BHIM_UPI_logo.svg.png",
      description: "Instant UPI-based payments via linked bank accounts for cashless claim settlements.",
    },
    {
      type: "Google Pay",
      icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Pay_Logo.svg",
      description: "Secure and fast UPI payments through Google Pay.",
    },
    {
      type: "PhonePe",
      icon: "https://upload.wikimedia.org/wikipedia/commons/f/f2/PhonePe-Logo.svg",
      description: "Cashless UPI & wallet payments via PhonePe.",
    },
    {
      type: "Paytm Wallet & UPI",
      icon: "https://upload.wikimedia.org/wikipedia/commons/5/55/Paytm_logo.png",
      description: "Supports both Paytm wallet and UPI for instant transactions.",
    },
    {
      type: "Debit / Credit Cards",
      icon: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Credit_card_font_awesome.svg",
      description: "Visa, MasterCard, and RuPay cards accepted for cashless insurance settlements.",
    },
    {
      type: "Net Banking",
      icon: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Online-banking-icon.png",
      description: "Instant net banking options through all major Indian banks.",
    },
  ];

  // Update insurance with cashless JSON
  await prisma.healthInsurance.update({
    where: { id: insurance.id },
    data: {
      cashlessServices,
    },
  });

  console.log("✅ Cashless payment methods added for:", insurance.companyName);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("🌱 Seeding completed successfully!");
  })
  .catch(async (err) => {
    console.error("❌ Seed error:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
