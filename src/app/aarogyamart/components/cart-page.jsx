"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CiShop } from "react-icons/ci";
import { useCart } from "./cart-context";
// 👉 Example userId (in real app get from session/auth)


export function CartPage(userId) {
  const { state, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // ✅ Fetch cart data from API
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/aarogyamart/cart/${userId.userId}`);
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Helpers
  const subtotal = cart?.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;

  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + shipping + tax;

  // ✅ Coupon handlers
  const handleApplyCoupon = () => {
    const validCoupons = {
      SAVE10: { discount: 10, minAmount: 1000 },
      WELCOME15: { discount: 15, minAmount: 1500 },
      HEALTH20: { discount: 20, minAmount: 2500 },
    };

    const coupon = validCoupons[couponCode.toUpperCase()];

    if (coupon && subtotal >= coupon.minAmount) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        discount: coupon.discount,
      });
      setCouponCode("");
    } else {
      alert("Invalid coupon code or minimum amount not met");
    }
  };

  const handleRemoveCoupon = () => setAppliedCoupon(null);

  if (loading) {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-1/3 bg-gray-200 rounded mb-6 animate-pulse"></div>

      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Cart Items Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2].map((_, idx) => (
            <div key={idx} className="flex gap-4 p-6 border rounded-lg animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}


  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven`t added anything yet. Start shopping now!
          </p>
          <Link href="/aarogyamart/products">
            <Button size="lg" className="rounded-xl bg-blue-500 text-white px-8">
              Start Shopping <CiShop className="!h-6 !w-6" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6"> 
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6"> 
        <Link href="/" className="hover:text-blue-500"> Home </Link> 
        <span>/</span> 
        <span>Shopping Cart</span> 
      </nav> 
      <div className="flex items-center justify-between mb-8"> 
        <h1 className="text-3xl font-bold">Shopping Cart ({getTotalItems()} items)</h1> 
        <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700 bg-transparent"> <Trash2 className="h-4 w-4 mr-2" /> Clear Cart </Button> 
      </div> 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
        <div className="lg:col-span-2 space-y-4"> 
          {state.items.map((item) => ( 
            <Card key={item.id}> 
            <CardContent className="p-6"> 
              <div className="flex gap-4"> 
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg"> 
                  <Image 
                    src={item?.product?.images[0] || "/placeholder.svg"} 
                    alt={item.name} fill 
                    className="object-cover" 
                  /> 
                </div> 
                <div className="flex-1"> 
                  <div className="flex justify-between items-start mb-2"> 
                    <div> 
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3> 
                      <p className="text-gray-500">{item.brand}</p> 
                      {!item?.product?.inStock && ( <Badge variant="destructive" className="mt-1"> Out of Stock </Badge> )} 
                    </div> 
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(item.id)} > <Trash2 className="h-4 w-4" /> </Button> 
                  </div> 
                  <div className="flex items-center justify-between"> 
                    <div className="flex items-center gap-2"> 
                      <span className="text-xl font-bold text-blue-500">₹{item.price.toLocaleString()}</span> 
                      {item.originalPrice > item.price && ( 
                        <span className="text-sm text-gray-500 line-through"> ₹{item.originalPrice.toLocaleString()} </span> 
                      )} 
                    </div> 
                    <div className="flex items-center gap-3"> 
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} > <Minus className="h-4 w-4" /> </Button> 
                      <span className="text-lg font-medium w-12 text-center">{item.quantity}</span> 
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} > <Plus className="h-4 w-4" /> </Button> 
                    </div> 
                  </div> 
                  <div className="mt-3 text-right"> 
                    <span className="text-lg font-semibold"> Subtotal: ₹{(item.price * item.quantity).toLocaleString()} </span> 
                  </div> 
                </div> 
              </div> 
            </CardContent> 
          </Card> 
        ))} 
        <div className="pt-4"> 
          <Link href="/aarogyamart/products"> 
            <Button variant="outline" size="lg"> Continue Shopping </Button> 
          </Link> 
        </div> 
      </div> 
      <div className="space-y-6"> 
        <Card> 
          <CardContent className="p-6"> 
            <h3 className="font-semibold mb-4 flex items-center gap-2"> <Tag className="h-5 w-5" /> Coupon Code </h3> {appliedCoupon ? ( 
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"> 
                <div> 
                  <span className="font-medium text-green-800">{appliedCoupon.code}</span> 
                  <p className="text-sm text-green-600">{appliedCoupon.discount}% discount applied</p> 
                </div> 
                <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-red-600"> Remove </Button> 
              </div> 
            ) : ( 
              <div className="flex gap-2"> 
                <Input placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} /> <Button onClick={handleApplyCoupon} disabled={!couponCode.trim()}> Apply </Button> 
              </div> 
            )} 
            <div className="mt-3 text-xs text-gray-500"> 
              <p>Available coupons: SAVE10, WELCOME15, HEALTH20</p> 
            </div> 
          </CardContent> 
        </Card> 
        <Card> 
          <CardContent className="p-6"> 
            <h3 className="font-semibold mb-4">Order Summary</h3> 
            <div className="space-y-3"> 
              <div className="flex justify-between"> 
                <span>Subtotal ({getTotalItems()} items)</span> 
                <span>₹{subtotal.toLocaleString()}</span> 
              </div> 
              {appliedCoupon && ( 
                <div className="flex justify-between text-green-600"> 
                  <span>Discount ({appliedCoupon.code})</span> 
                  <span>-₹{discount.toLocaleString()}</span> 
                </div> 
              )} 
              <div className="flex justify-between"> 
                <span>Shipping</span> 
                <span className={shipping === 0 ? "text-green-600" : ""}> {shipping === 0 ? "FREE" : `₹${shipping}`} </span> 
              </div> 
              <div className="flex justify-between"> 
                <span>Tax (GST 18%)</span> 
                <span>₹{tax.toLocaleString()}</span> 
              </div> 
              <Separator /> 
              <div className="flex justify-between text-lg font-semibold"> 
                <span>Total</span> 
                <span className="text-primary">₹{total.toLocaleString()}</span> 
              </div> 
            </div> 
            {subtotal < 2000 && ( 
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"> 
                <p className="text-sm text-blue-800"> Add ₹{(2000 - subtotal).toLocaleString()} more to get free shipping! </p> 
              </div> 
            )} 
            <Link href="/aarogyamart/checkout" className="block mt-6"> 
              <Button size="lg" className="w-full rounded-xl bg-blue-500 hover:bg-blue-500 text-white"> Proceed to Checkout </Button> 
            </Link> 
          </CardContent> 
        </Card> 
        <Card> 
          <CardContent className="p-6"> 
            <div className="space-y-4"> 
              <div className="flex items-center gap-3"> <Truck className="h-5 w-5 text-blue-500" /> 
                <div> 
                  <p className="font-medium text-sm">Free Shipping</p> 
                  <p className="text-xs text-gray-500">On orders above ₹2,000</p> 
                </div> 
              </div> 
              <div className="flex items-center gap-3"> <Shield className="h-5 w-5 text-blue-500" /> 
                <div> 
                  <p className="font-medium text-sm">Secure Payment</p> 
                  <p className="text-xs text-gray-500">100% secure transactions</p> 
                </div> 
              </div> 
              <div className="flex items-center gap-3"> <RotateCcw className="h-5 w-5 text-blue-500" /> 
              <div> 
                <p className="font-medium text-sm">Easy Returns</p> 
                <p className="text-xs text-gray-500">7-day return policy</p> 
              </div> 
            </div> 
          </div> 
        </CardContent> 
      </Card> 
    </div> 
  </div> 
</div>
  );
}
