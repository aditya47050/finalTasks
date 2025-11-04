import { HeroSection } from './components/hero-section';
import { FeaturedJobs } from './components/featured-jobs';
import { CategoriesSection } from './components/categories-section';
import { IoCall } from 'react-icons/io5';
import { Input } from '@/components/ui/input';
import Testimonials from './components/testimonials';
import TopCompaniesHiring from './components/top-companies-hiring';
import TopMatchingJobs from './components/top-matching-jobs';
import { getSession } from '@/lib/getsession';
import { db } from '@/lib/db';

export default async function HomePage() {
  const session = await getSession();
  let user = null;
  let seekerId = null;

  if (session?.email) {
    user = await db.JObUser.findFirst({ where: { email: session.email } });
  }
  if(user){
    seekerId = await db.JobSeeker.findFirst({
      where : {
        userId : user.id
      },
      select : {
        id : true,
      }
    })
  }

  return (
    <div className="min-h-screen bg-blue-50/30">
      <main>
        <HeroSection />
        {/* Top Matching Jobs (12 cards) */}
        {seekerId && <TopMatchingJobs seekerId={seekerId}/>
        }
        <CategoriesSection />
        <FeaturedJobs />
        {/* Top Companies Hiring (8 cards) */}
        <TopCompaniesHiring />
        {/* Testimonials with continuous scroll */}
        <Testimonials />
        {/* Newsletter Section */}
        <div className=" py-4 md:w-[24rem] xl:w-[25rem] container mx-auto">
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
      </main>
    </div>
  )
}
