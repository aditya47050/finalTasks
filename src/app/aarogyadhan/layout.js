import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/dhan-Sidebar";
import { Header } from "./components/dhanHeader";
import { getSession } from "@/lib/getsession";

export const metadata = {
  title: "Aarogya Dhan",
  description: "Medical Crowdfunding Platform",
};

export default async function Layout({ children }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={` relative  overflow-visible`}>
        
        {/* Medical Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 -z-10" />

        {/* Medical Pattern Overlay */}
        <div className="fixed inset-0 -z-10">
          {/* Heartbeat Line */}
          <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent opacity-30" />
          <div className="absolute top-40 right-0 w-full h-px bg-gradient-to-l from-transparent via-blue-200 to-transparent opacity-20" />

          {/* Medical Cross Shadows */}
          <div className="absolute top-32 right-20 w-8 h-8 opacity-5">
            <div className="absolute inset-0 bg-teal-400 rounded-sm transform rotate-45" />
            <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-sm" />
          </div>

          <div className="absolute bottom-40 left-16 w-6 h-6 opacity-5">
            <div className="absolute inset-0 bg-blue-400 rounded-sm transform rotate-45" />
            <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-white rounded-sm" />
          </div>

          {/* Circular Medical Elements */}
          <div className="absolute top-60 left-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-teal-100/20 to-blue-100/20 blur-xl" />
          <div className="absolute bottom-32 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-green-100/20 to-teal-100/20 blur-lg" />

          {/* DNA Helix Pattern */}
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2 opacity-10">
            <div className="w-2 h-40 relative">
              <div className="absolute top-0 left-0 w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <div
                className="absolute top-8 right-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute top-16 left-0 w-2 h-2 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-24 right-0 w-2 h-2 bg-teal-400 rounded-full animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
              <div
                className="absolute top-32 left-0 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>

          {/* Stethoscope Curve */}
          <div className="absolute bottom-20 right-20 w-20 h-20 opacity-5">
            <div className="w-full h-full border-4 border-teal-300 rounded-full border-dashed" />
            <div className="absolute top-2 left-2 w-4 h-4 bg-teal-300 rounded-full" />
          </div>
        </div>

        {/* Subtle Mesh Gradient Overlay */}
        <div className="fixed w-full inset-0 bg-gradient-to-tr from-white/50 via-transparent to-white/30 -z-10" />

        <SidebarProvider>

          {session && !<AppSidebar />}
          <div className="flex-1 flex flex-col min-h-screen w-full relative">

          {}
          <div className="flex-1 flex flex-col min-h-screen relative">

            {/* Content Background with Glass Effect */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

            <div className="relative z-10  mx-0 px-0 w-full">
              <Header session={session} />
              <main className="flex-1 relative">
                {/* Main Content Shadow */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 pointer-events-none" />
                <div className="relative z-10">{children}</div>
              </main>
            </div>
          </div>
</div>
        </SidebarProvider>
        <NextTopLoader color="#0891b2" />
        <ToastContainer />
      </body>
    </html>
  );
}
