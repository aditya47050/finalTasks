import { Inter } from "next/font/google";
import "./globals.css";
import ChatbotIcon from "./components/chatbot";

import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aarogya-Aadhar",
  description: "",
};

export default function RootLayout({ children }) { 
  return (
    <html lang="en">
      <body
        className={`${inter.className} w-full m-0 p-0 relative`} // Tailwind classes for no padding/margin and relative positioning
      >
        <NextTopLoader />
        <ToastContainer position="top-center" autoClose={5000} />
        {/* Render the children content <SplashScreen> */}
        {children}
        {/* </SplashScreen> */}
        {/* Position the chatbot icon at the bottom-right corner */}
        {/* <div className="fixed bottom-5 right-5 z-50">
          <ChatbotIcon />
        </div> */}
      </body>
    </html>
  );
}
