// prisma/clearBrands.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Delete all ProductMart records first
  const deletedProducts = await prisma.productMart.deleteMany({});
  console.log(`🗑️ Deleted ${deletedProducts.count} ProductMart records.`);

  // 2️⃣ Then delete all Brand records
  const deletedBrands = await prisma.brand.deleteMany({});
  console.log(`🗑️ Deleted ${deletedBrands.count} Brand records.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
