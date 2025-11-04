import { Inter } from "next/font/google";
import JobNavBar from "./components/jobnav";
import NextTopLoader from "nextjs-toploader";



const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aarogya-Aadhar Job Portal",
  description: "",
};

export default function JobPortalLayout({ children }) {
  return (
    <> {children}    </>
       
      
    
  );
}
