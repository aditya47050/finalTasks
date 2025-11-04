import { Header } from "./components/header"
import { BannerCarousel } from "./components/banner-carousel"
import { CategoryGrid } from "./components/category-grid"
import { ProductGrid } from "./components/product-grid"
import { Footer } from "./components/footer"
import { LiaShippingFastSolid } from "react-icons/lia";
import { CiLock } from "react-icons/ci";
import { BiSupport } from "react-icons/bi"
import { IoCall } from "react-icons/io5"
import { Input } from '@/components/ui/input';
import { getSession } from '@/lib/getsession';
import { db } from '@/lib/db';
import HomeSection from "./components/HomeSection"
import SuggestedSection from './components/SuggestedSection';

export default async function HomePage() {
  const session = await getSession();
    let loggeduserId = null;
    let role = null;
    if(session){

      const isId = session.id ? session.id : session.email;
      if (isId === session.id) {
        const patientData = await db.Patient.findUnique({
          where: { id: isId },
        });
    
        const doctorData = await db.Doctor.findUnique({
          where: { id: isId },
        });
        if (patientData || doctorData) {
          loggeduserId = patientData !== null ? patientData.id : doctorData.id;
        role = patientData !== null ? patientData.role : doctorData.role;
        }
      }
      else{
        const hospitalData = await db.Hospital.findUnique({
          where: { email: isId },
        });
        if (hospitalData) {
          loggeduserId = hospitalData.id;
          role = hospitalData.role;
        }
      }
    }
    const sections = await db.homeSection.findMany({
      orderBy: { position: "asc" }, // Sort by position
    });
    const beforeCategory = sections.filter((s) => s.position === 0);
  const afterCategory = sections.filter((s) => s.position === 1);
  const afterProduct = sections.filter((s) => s.position === 2);
     // Personalized products
  let suggestedProducts = [];
  if (loggeduserId) {
    const wishlist = await db.wishlist.findUnique({
      where: { userId: loggeduserId },
      include: { items: { include: { product: true } } },
    });
    const cart = await db.cart.findUnique({
      where: { userId: loggeduserId },
      include: { items: { include: { product: true } } },
    });
    const orders = await db.order.findMany({
      where: { userId: loggeduserId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const wishlistProducts = wishlist?.items.map((i) => i.product) || [];
    const cartProducts = cart?.items.map((i) => i.product) || [];
    const orderedProducts = orders?.flatMap((o) => o.items.map((i) => i.product)) || [];

    suggestedProducts = [...wishlistProducts, ...cartProducts, ...orderedProducts].filter(Boolean);
  }
    
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Banner */}
        <section className="container mx-auto px-4 py-6">
          <BannerCarousel />
        </section>
        {/* Sections before CategoryGrid */}
        {beforeCategory.map((section) => (
          <HomeSection
            key={section.id}
            title={section.title}
            type={section.type}
            row={section.row}
            column={section.column}
            backgroundImage={section.backgroundImage}
            filterIds={section.filterIds}
          />
        ))}
        {/* Suggested Section */}
        {loggeduserId && (suggestedProducts.length > 0 && (
          <SuggestedSection title="Suggested for You" products={suggestedProducts} columns={4} />
        ))}

        {/* Categories */}
        <CategoryGrid />

        {afterCategory.map((section) => (
          <HomeSection
            key={section.id}
            title={section.title}
            type={section.type}
            row={section.row}
            column={section.column}
            backgroundImage={section.backgroundImage}
            filterIds={section.filterIds}
          />
        ))}

        {/* Featured Products */}
        <ProductGrid />

        {afterProduct.map((section) => (
          <HomeSection
            key={section.id}
            title={section.title}
            type={section.type}
            row={section.row}
            column={section.column}
            backgroundImage={section.backgroundImage}
            filterIds={section.filterIds}
          />
        ))}

        {/* Trust Indicators */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl"><LiaShippingFastSolid /></span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
                <p className="text-gray-500">On orders above ₹2,000</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl"><CiLock /></span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-500">100% secure transactions</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl"><BiSupport /></span>
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-500">Always here to help</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Newsletter Section */}
      <div className="bg-white my-4 md:w-[24rem] xl:w-[25rem] container mx-auto">
        <div className="relative w-full max-w-md flex items-center">
          {/* Icon */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <IoCall
              className="h-6 w-6 bg-white rounded-full p-1 md:h-7 md:w-7"
              color="#243451"
            />
          </span>

          {/* Input Field */}
          <Input
            placeholder="Enter Number/Email ID"
            className="rounded-full  bg-[#243451] font-poppins placeholder:text-[12px] text-white placeholder-blue-950 placeholder:font-semibold pl-10 md:pl-12 w-full"
          />

          {/* Button */}
          <button
            type="button"
            className="absolute right-0 mr-[6px] -mt-1"
          >
            <span className="text-[#243451] p-2 text-[10px]  font-bold bg-white px-4 rounded-full">
              Subscribe
            </span>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
