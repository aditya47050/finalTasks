// import React from 'react'

// const SingleSurgeryCategory = ({surgeryname}) => {
//   return (
//     <div>
//  <div className="justify-center text-center mb-2 mt-1.5">
//           <h1 className="md:text-[25px] text-[20px] text-[#5271FF] font-extrabold">
//            Surgery Packages
//           </h1>
//           <p className='text-[#5271FF] text-[19px]'>{surgeryname.title}</p>
//         </div>
//     </div>
//   )
// }

// export default SingleSurgeryCategory

"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Shield,
  Heart,
  ArrowRight,
  Calendar,
  CheckCircle
} from "lucide-react";

const crowdfundingcategory = [
  {
    id: 1,
    src: "",
    link: "#",
    text: "Cardiac Surgery",
    hospital: "Apollo Hospital",
    location: "Mumbai, Maharashtra",
    amount: "3,50,000",
    originalAmount: "4,00,000",
    value: "65",
    rating: 4.8,
    reviews: 124,
    features: ["24/7 Support", "Free Consultation", "Insurance Accepted"],
    duration: "3-5 days",
    availability: "Available"
  },
  {
    id: 2,
    src: "",
    link: "#",
    text: "Orthopedic Surgery",
    hospital: "Fortis Hospital",
    location: "Delhi, NCR",
    amount: "2,80,000",
    originalAmount: "3,20,000",
    value: "72",
    rating: 4.6,
    reviews: 89,
    features: ["Expert Surgeon", "Modern Equipment", "Quick Recovery"],
    duration: "2-3 days",
    availability: "Available"
  },
  {
    id: 3,
    src: "",
    link: "#",
    text: "Neuro Surgery",
    hospital: "Manipal Hospital",
    location: "Bangalore, Karnataka",
    amount: "4,50,000",
    originalAmount: "5,00,000",
    value: "35",
    rating: 4.9,
    reviews: 156,
    features: ["Advanced Technology", "Experienced Team", "Post-op Care"],
    duration: "5-7 days",
    availability: "Limited"
  },
  {
    id: 4,
    src: "",
    link: "#",
    text: "Eye Surgery",
    hospital: "AIIMS Delhi",
    location: "New Delhi",
    amount: "1,20,000",
    originalAmount: "1,50,000",
    value: "65",
    rating: 4.7,
    reviews: 203,
    features: ["Laser Technology", "Same Day Discharge", "Follow-up Care"],
    duration: "1 day",
    availability: "Available"
  },
  {
    id: 5,
    src: "",
    link: "#",
    text: "Cosmetic Surgery",
    hospital: "Kokilaben Hospital",
    location: "Mumbai, Maharashtra",
    amount: "2,20,000",
    originalAmount: "2,80,000",
    value: "65",
    rating: 4.5,
    reviews: 78,
    features: ["Expert Surgeon", "Natural Results", "Confidential"],
    duration: "2-4 days",
    availability: "Available"
  },
  {
    id: 6,
    src: "",
    link: "#",
    text: "Gastro Surgery",
    hospital: "Max Hospital",
    location: "Gurgaon, Haryana",
    amount: "3,20,000",
    originalAmount: "3,80,000",
    value: "65",
    rating: 4.8,
    reviews: 112,
    features: ["Minimal Invasive", "Quick Recovery", "Diet Counseling"],
    duration: "3-4 days",
    availability: "Available"
  },
];

const SingleSurgeryDetails = ({ surgeryname }) => {
  return (
    <>
      <style jsx>{`
        .agoda-card {
          transition: all 0.3s ease;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .agoda-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .price-tag {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .discount-badge {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 500;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Surgery Packages</h1>
            <p className="text-xl text-blue-100">{surgeryname.title}</p>
            <div className="mt-6 flex justify-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Shield className="w-4 h-4 mr-2" />
                Verified Hospitals
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <CheckCircle className="w-4 h-4 mr-2" />
                Expert Surgeons
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Users className="w-4 h-4 mr-2" />
                1000+ Patients
              </Badge>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="mx-auto w-full hidden md:block container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {crowdfundingcategory.map((item, index) => (
              <div key={item.id} className="agoda-card group">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                  {item.src ? (
                    <Image
                      src={item.src}
                      width={400}
                      height={200}
                      alt={item.text}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-blue-600 text-6xl">🏥</div>
                    </div>
                  )}
                  
                  {/* Favorites Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                  
                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${item.availability === 'Available' ? 'bg-green-500' : 'bg-orange-500'} text-white border-0`}>
                      {item.availability}
                    </Badge>
                  </div>
                  
                  {/* Book Now Button */}
                  <Button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title and Rating */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{item.text}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                        <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Hospital Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{item.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{item.location}</span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Duration: {item.duration}</span>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {item.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">₹{item.amount}</span>
                          <span className="text-sm text-gray-500 line-through">₹{item.originalAmount}</span>
                          <div className="discount-badge">
                            Save ₹{(parseInt(item.originalAmount.replace(/,/g, '')) - parseInt(item.amount.replace(/,/g, ''))).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">per package</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile View */}
        <div className="mx-auto w-full md:hidden block container py-4">
          <div className="space-y-4">
            {crowdfundingcategory.map((item, index) => (
              <div key={item.id} className="agoda-card">
                <div className="flex">
                  {/* Image Section */}
                  <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden rounded-l-2xl">
                    {item.src ? (
                      <Image
                        src={item.src}
                        width={200}
                        height={200}
                        alt={item.text}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <div className="text-blue-600 text-3xl">🏥</div>
                      </div>
                    )}
                    
                    {/* Availability Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`${item.availability === 'Available' ? 'bg-green-500' : 'bg-orange-500'} text-white border-0 text-xs`}>
                        {item.availability}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-4">
                    {/* Title and Rating */}
                    <div className="mb-2">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{item.text}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                        <span className="text-xs text-gray-500">({item.reviews})</span>
                      </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-gray-600 truncate">{item.hospital}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">{item.location}</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1 mb-2">
                      <Clock className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-gray-600">{item.duration}</span>
                    </div>

                    {/* Price Section */}
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-gray-900">₹{item.amount}</span>
                            <span className="text-xs text-gray-500 line-through">₹{item.originalAmount}</span>
                          </div>
                          <div className="discount-badge inline-block mt-1">
                            Save ₹{(parseInt(item.originalAmount.replace(/,/g, '')) - parseInt(item.amount.replace(/,/g, ''))).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 text-xs py-1 px-2 border-red-200 text-red-600 hover:bg-red-50">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Information Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Surgery Package Information
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive surgery packages with transparent pricing and expert care
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Verified Hospitals</h4>
                  <p className="text-sm text-gray-600">All hospitals are verified and certified</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Expert Surgeons</h4>
                  <p className="text-sm text-gray-600">Board-certified and experienced surgeons</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">1000+ Patients</h4>
                  <p className="text-sm text-gray-600">Successfully treated patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleSurgeryDetails;
