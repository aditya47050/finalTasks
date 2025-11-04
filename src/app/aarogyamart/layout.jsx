import { Inter, JetBrains_Mono } from "next/font/google"
import { Suspense } from "react"
import { CartProvider } from "./components/cart-context"
import { CartPopup } from "./components/cart-popup"
import { WishlistProvider } from './components/wishlist-context';
import { WishlistPopup } from "./components/wishlist-popup";
import { getSession } from '@/lib/getsession';
import { db } from '@/lib/db';
import { Header } from './components/header';


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "AarogyaMart - Hospital Equipment Store",
  description: "Your trusted source for medical equipment and hospital supplies",
  generator: "v0.app",
}

export default async function RootLayout({ children }) {
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
      if (patientData || doctorData ) {
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
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable}`}>
        <CartProvider userId={loggeduserId} role={role}>
          <WishlistProvider userId={loggeduserId} role={role}>
            <Header role={role}/>
            <Suspense fallback={null}>{children}</Suspense>
            <CartPopup />
            <WishlistPopup />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
