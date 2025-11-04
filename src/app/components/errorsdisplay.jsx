"use client"

import { Shield, UserCheck, CreditCard, LogIn, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AccessDeniedVariant1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
              <Shield className="h-24 w-24 text-blue-600 relative" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            This healthcare service requires proper authentication and verification. 
            Please complete the following steps to access your medical services.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-xl">
              <UserCheck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Register</h3>
              <p className="text-sm text-gray-600">Create your account</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Get Health Card</h3>
              <p className="text-sm text-gray-600">Receive verification</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <LogIn className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Login</h3>
              <p className="text-sm text-gray-600">Access your services</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login to Continue
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">
                <UserCheck className="h-4 w-4 mr-2" />
                Register Now
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
