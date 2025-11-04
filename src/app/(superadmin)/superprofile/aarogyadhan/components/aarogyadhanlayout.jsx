"use client"
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, IndianRupee, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { MdPhotoCameraFront } from 'react-icons/md';

const AarogyadhanLayout = ({ children }) => {
  const pathname = usePathname(); // Get the current pathname

  return (
    <div className="min-h-screen ">
      <div className="md:container mx-auto  md:p-2 space-y-4">
        {/* Tabs visible on all subpages */}
        <Tabs defaultValue="" className="bg-gray-100 w-auto border rounded-xl ">
          <TabsList className="flex justify-center items-center gap-5 flex-wrap">
            <Link href="/superprofile/aarogyadhan">
              <TabsTrigger
                value="overview"
                className={`flex items-center gap-2 ${pathname.startsWith('/superprofile/aarogyadhan') ? 'text-blue-500' : ''}`}
              >
                <Heart className="h-4 w-4" />
                Campaigns
              </TabsTrigger>
            </Link>

            <Link href="/superprofile/aarogyadhan/donors">
              <TabsTrigger
                value="donors"
                className={`flex items-center gap-2 ${pathname.startsWith('/superprofile/aarogyadhan/donors') ? 'text-blue-500' : ''}`}
              >
                <Users className="h-4 w-4" />
                Donors
              </TabsTrigger>
            </Link>
            <Link href="/superprofile/aarogyadhan/donations">
              <TabsTrigger
                value="donations"
                className={`flex items-center gap-2 ${pathname.startsWith('/superprofile/aarogyadhan/donations') ? 'text-blue-500' : ''}`}
              >
                <IndianRupee className="h-4 w-4" />
                Donations
              </TabsTrigger>
            </Link>
            <Link href="/superprofile/aarogyadhan/photographers">
              <TabsTrigger
                value="photographers"
                className={`flex items-center gap-2 ${pathname.startsWith('/superprofile/aarogyadhan/photographers') ? 'text-blue-500' : ''}`}
              >
                <MdPhotoCameraFront className="h-4 w-4" />
                Photographers
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  );
};

export default AarogyadhanLayout;