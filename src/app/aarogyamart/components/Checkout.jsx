"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Plus, CreditCard, Truck, Shield } from "lucide-react";

export default function CheckoutPage(id) {
  const userId = id.id;
  const { state, getTotalPrice, clearCart } = useCart();
  const items = state.items || [];
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    pincode: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/aarogyamart/cart");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await fetch(`/api/aarogyamart/address?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setAddresses(data.data);
          const defaultAddr = data.data.find((a) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr.id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };

    const fetchRazorpayConfig = async () => {
      try {
        const response = await fetch("/api/aarogyamart/razorpay-config");
        const { keyId } = await response.json();
        setRazorpayKeyId(keyId);
      } catch (error) {
        console.error("Failed to fetch Razorpay config:", error);
      }
    };

    fetchAddresses();
    fetchRazorpayConfig();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  // ✅ Add new address via API
  const handleAddAddress = async () => {
    if (
      newAddress.name &&
      newAddress.phone &&
      newAddress.address &&
      newAddress.city &&
      newAddress.state &&
      newAddress.district &&
      newAddress.taluka &&
      newAddress.pincode
    ) {
      try {
        const res = await fetch("/api/aarogyamart/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newAddress, userId }),
        });
        const data = await res.json();
        if (data.success) {
          setAddresses((prev) => [...prev, data.data]);
          setSelectedAddress(data.data.id);
          setNewAddress({
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            district: "",
            taluka: "",
            pincode: "",
          });
          setShowAddAddress(false);
        }
      } catch (err) {
        console.error("Add address failed:", err);
      }
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (!razorpayKeyId) {
      alert("Payment system not ready. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/aarogyamart/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          items,
          addressId: selectedAddress,
          userId,
        }),
      });

      const { order } = await response.json();
      const selectedAddr = addresses.find((addr) => addr.id === selectedAddress);

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "AarogyaMart",
        description: "Medical Equipment Purchase",
        order_id: order.id,
        handler: async (response) => {
          try {
            const orderData = {
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              items,
              addressId: selectedAddress,
              userId,
              total,
            };

            // Save order in DB
            await fetch("/api/aarogyamart/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderData),
            });

            // Clear cart and redirect
            clearCart();
            router.push(`/aarogyamart/order-success?orderId=${order.id}`);
          } catch (err) {
            console.error("Failed to save order:", err);
            alert("Order was successful but saving failed. Contact support.");
          }
        },
        prefill: {
          name: selectedAddr?.name,
          contact: selectedAddr?.phone,
        },
        theme: { color: "#3B82F6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 50;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + gst;

  if (!items || items.length === 0) {
    return null; // show nothing if cart empty
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-500">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-start space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200
                        ${selectedAddress === address.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:shadow-lg"}`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      {/* Custom Radio */}
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${selectedAddress === address.id ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"}`}
                        >
                          {selectedAddress === address.id && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{address.name}</div>
                        <div className="text-sm text-gray-600">{address.phone}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {address.address}, {address.city}, {address.state} - {address.pincode}
                        </div>
                        {address.isDefault && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {!showAddAddress ? (
                  <Button
                    variant="default"
                    onClick={() => setShowAddAddress(true)}
                    className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 rounded-xl flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add New Address
                  </Button>
                ) : (
                  <div className="mt-4 p-6 border rounded-xl bg-blue-50 shadow-inner">
                    <h4 className="font-semibold text-blue-600 mb-4 text-lg">Add New Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="Enter full name"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="Enter phone number"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          placeholder="Enter complete address"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="Enter city"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="Enter state"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          value={newAddress.district}
                          onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                          placeholder="Enter district"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taluka">Taluka</Label>
                        <Input
                          id="taluka"
                          value={newAddress.taluka}
                          onChange={(e) => setNewAddress({ ...newAddress, taluka: e.target.value })}
                          placeholder="Enter taluka"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          placeholder="Enter pincode"
                          className="border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        onClick={handleAddAddress}
                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl w-full"
                      >
                        Save Address
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddAddress(false)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-50 w-full rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-4 border rounded-xl bg-blue-50">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Razorpay Secure Payment</div>
                    <div className="text-sm text-gray-600">
                      Pay securely with Credit Card, Debit Card, Net Banking, UPI & Wallets
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">Expected Delivery</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={!selectedAddress || isProcessing || !razorpayKeyId}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl text-white"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : `Place Order - ₹${total.toLocaleString()}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
