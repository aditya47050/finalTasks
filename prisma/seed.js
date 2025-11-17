const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding No Claim Bonus Service into HealthInsurance...");

  const insurances = await prisma.healthInsurance.findMany();

  if (insurances.length === 0) {
    console.log("⚠️ No HealthInsurance records found. Please seed base data first.");
    return;
  }

  for (const insurance of insurances) {
    const noClaimBonusData = {
      title: "No Claim Bonus",
      value: "Yes",
      description:
        "Reward for claim-free years with increased sum insured or premium discounts. Encourages healthy living and responsible usage of policy.",
      icon: "Award",
      isAvailable: true,
    };

    await prisma.healthInsurance.update({
      where: { id: insurance.id },
      data: {
        noClaimBonusService: noClaimBonusData,
      },
    });

    console.log(`✅ Added No Claim Bonus service for: ${insurance.companyName || insurance.policyNumber}`);
  }

  console.log("🎉 No Claim Bonus service seeding complete!");
}

main()
  .catch((err) => {
    console.error("❌ Error while seeding No Claim Bonus Service:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
