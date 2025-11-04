"use client";
import { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Phone,
  Navigation,
  Truck,
  MapPin,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useRef } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { FaAmbulance } from "react-icons/fa";
import Link from "next/link";
import Cookies from "js-cookie";

// Fix leaflet default icon issue for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create custom ambulance icons using SVG
const createAmbulanceIcon = (color) => {
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="11" fill="${color}" stroke="white" strokeWidth="2"/>
      <path d="M4 12h2l2-3h4l2 3h2v4h-2v2h-2v-2H8v2H6v-2H4v-4z" fill="white"/>
      <rect x="10" y="8" width="4" height="1" fill="white"/>
      <rect x="11" y="7" width="2" height="3" fill="white"/>
    </svg>
  `;
  return new L.DivIcon({
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: "custom-ambulance-icon",
  });
};

const onlineAmbulanceIcon = createAmbulanceIcon("#10B981"); // green
const offlineAmbulanceIcon = createAmbulanceIcon("#6B7280"); // gray

const userLocationIcon = new L.DivIcon({
  html: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
  className: "custom-user-icon",
});

// Component to recenter map when location changes
const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 13);
    }
  }, [position, map]);
  return null;
};

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const AmbulanceMap = ({ ambulances, onAmbulanceSelect }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [nearbyAmbulances, setNearbyAmbulances] = useState([]);
  const [searchRadius, setSearchRadius] = useState(5);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const watchIdRef = useRef(null);
  // New states for manual city search
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isManualLocation, setIsManualLocation] = useState(false);

  // Watch position ID for cleanup
  const [watchId, setWatchId] = useState(null);
  useEffect(() => {
    const savedLocation = Cookies.get("manualLocation");
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserLocation(location);
        setIsManualLocation(true);
      } catch (error) {
        console.error("Failed to parse location cookie", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isManualLocation && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location watch error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isManualLocation]);

  // Fetch city suggestions when typing (debounced)
  useEffect(() => {
    if (!cityInput || !isManualLocation) {
      setCitySuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            cityInput
          )}`
        );
        const data = await res.json();
        setCitySuggestions(data);
      } catch (error) {
        console.error("City search error:", error);
      }
    };

    const timeoutId = setTimeout(fetchCities, 500);
    return () => clearTimeout(timeoutId);
  }, [cityInput, isManualLocation]);

  // Filter nearby ambulances when userLocation or ambulances or radius changes
  useEffect(() => {
    if (userLocation && ambulances.length > 0) {
      const nearby = ambulances
        .filter((ambulance) => {
          if (!ambulance.latitude || !ambulance.longitude) return false;
          const lat = Number.parseFloat(ambulance.latitude);
          const lng = Number.parseFloat(ambulance.longitude);
          if (isNaN(lat) || isNaN(lng)) return false;
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            lat,
            lng
          );
          return distance <= searchRadius;
        })
        .sort((a, b) => {
          const distA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number.parseFloat(a.latitude),
            Number.parseFloat(a.longitude)
          );
          const distB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number.parseFloat(b.latitude),
            Number.parseFloat(b.longitude)
          );
          return distA - distB;
        });

      setNearbyAmbulances(nearby);
    }
  }, [userLocation, ambulances, searchRadius]);

  const handleAmbulanceClick = useCallback(
    (ambulance) => {
      setSelectedAmbulance(ambulance);
      onAmbulanceSelect?.(ambulance);
    },
    [onAmbulanceSelect]
  );



  const handleCitySelect = (city) => {
    const lat = parseFloat(city.lat);
    const lng = parseFloat(city.lon);

    setUserLocation({ lat, lng });
    setIsManualLocation(true);
    setCitySuggestions([]);
    setCityInput("");

    // Save to cookies
    Cookies.set("manualLocation", JSON.stringify({ lat, lng }));
  };
  const clearManualLocation = () => {
    Cookies.remove("manualLocation");
    setIsManualLocation(false);
    setUserLocation(null); // or fall back to geolocation
  };

  // Center map on userLocation or default Delhi
  const center = userLocation || { lat: 28.6139, lng: 77.209 };

  return (
    <div className="relative w-full h-screen lg:h-[80vh] min-h-[500px] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <FaAmbulance size={20} />
        </h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsControlsOpen(!isControlsOpen)}>
            <FaLocationArrow size={16} />
          </Button>
          <Button size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={16} />
          </Button>
        </div>
      </div>

      {/* Controls Panel - Mobile Overlay / Desktop Fixed */}
      {isControlsOpen && (
        <Card
          className={`
          ${isControlsOpen ? "fixed" : "hidden lg:block"} 
          top-4 left-4 z-[1000] bg-white w-80 max-w-[calc(100vw-2rem)]
          ${isControlsOpen ? "lg:relative lg:top-0 lg:left-0" : ""}
        `}
        >
          <CardHeader className="pb-3">
            <div className="flex  items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings size={16} />
                Controls
              </CardTitle>
              {isControlsOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsControlsOpen(false)}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Radius Control */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Search Radius: {searchRadius}km
              </Label>
              <Slider
                value={[searchRadius]}
                onValueChange={(value) => setSearchRadius(value[0])}
                max={30}
                min={1}
                step={1}
                className="w-full bg-blue-500 rounded-full h-1 "
              />
            </div>

            {/* Manual Location Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="manual-location"
                checked={isManualLocation}
                onCheckedChange={(checked) => {
                  setIsManualLocation(!!checked);
                  if (!checked) {
                    setUserLocation(null);
                    setCityInput("");
                    setCitySuggestions([]);
                  }
                }}
              />
              <Label htmlFor="manual-location" className="text-sm">
                Enter city manually
              </Label>
            </div>

            {/* City Search */}
            {isManualLocation && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">City Search</Label>
                <Input
                  type="text"
                  placeholder="Enter city name"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  autoComplete="off"
                />
                {citySuggestions.length > 0 && (
                  <div className="max-h-40 overflow-auto border rounded-md bg-white shadow-lg">
                    {citySuggestions.map((city, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Map Container */}
      <div className="flex-1 h-[150px] px-5 sm:px-8 lg:px-12 z-0 lg:h-full relative">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap position={userLocation} />

          {/* User Location */}
          {userLocation && (
            <>
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={userLocationIcon}
              >
                <Popup>Your Location</Popup>
              </Marker>
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={searchRadius * 1000}
                pathOptions={{
                  color: "#3B82F6",
                  fillColor: "#3B82F6",
                  fillOpacity: 0.1,
                  weight: 1,
                }}
              />
            </>
          )}

          {/* Ambulance Markers */}
          {ambulances.map((ambulance) => {
            const lat = Number.parseFloat(ambulance.latitude);
            const lng = Number.parseFloat(ambulance.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              return (
                <Marker
                  key={ambulance.id}
                  position={[lat, lng]}
                  icon={
                    ambulance.isOnline
                      ? onlineAmbulanceIcon
                      : offlineAmbulanceIcon
                  }
                  eventHandlers={{
                    click: () => handleAmbulanceClick(ambulance),
                  }}
                >
                  <Popup>
                    <div className="text-center space-y-2">
                      <div>
                        <strong className="block">
                          {ambulance.ambulancemodel}
                        </strong>
                        <p className="text-xs text-gray-600">
                          {ambulance.ambulancetype}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-600">
                          ₹{ambulance.ambulancecharges}
                        </p>
                        <p className="text-xs flex items-center gap-1">
                          <Phone size={12} />
                          {ambulance.contactnumber}
                        </p>
                      </div>
                <Button
  size="sm"
  onClick={(e) => {
    e.preventDefault();
    if (
      typeof globalThis !== "undefined" &&
      userLocation &&
      ambulance.latitude &&
      ambulance.longitude
    ) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${ambulance.latitude},${ambulance.longitude}`;
      globalThis.open(url, "_blank");
    }
  }}
  className="w-full"
>
  <Navigation size={14} className="mr-1" />
  Get Directions
</Button>

                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>

      {/* Sidebar - Mobile Overlay / Desktop Fixed */}
      <div
        className={`
        ${isSidebarOpen ? "fixed" : "hidden"} lg:block
        ${isSidebarOpen ? "inset-0 bg-white  bg-opacity-50 z-[1000]" : ""}
        lg:relative lg:bg-transparent lg:inset-auto
      `}
      >
        <Card
          className={`
          ${isSidebarOpen ? "absolute right-0 top-0 h-full" : ""}
          lg:relative lg:h-auto
          w-full max-w-sm lg:max-w-none lg:w-80 xl:w-96
          ${isSidebarOpen ? "rounded-none lg:rounded-xl" : ""}
          overflow-hidden
        `}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Truck size={20} />
                Nearby Ambulances
                {nearbyAmbulances.length > 0 && (
                  <Badge variant="secondary">{nearbyAmbulances.length}</Badge>
                )}
              </CardTitle>
              {isSidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[60vh] lg:max-h-[70vh] overflow-auto">
              {!userLocation && (
                <div className="p-4 text-center">
                  <MapPin className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-500">
                    Please enable location or enter a city manually to find
                    nearby ambulances.
                  </p>
                </div>
              )}

              {nearbyAmbulances.length === 0 && userLocation && (
                <div className="p-4 text-center">
                  <Truck className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-500">
                    No ambulances found within {searchRadius}km radius.
                  </p>
                </div>
              )}

              {nearbyAmbulances.map((ambulance) => {
                const distance = userLocation
                  ? calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      Number.parseFloat(ambulance.latitude),
                      Number.parseFloat(ambulance.longitude)
                    ).toFixed(1)
                  : null;

                return (
                  <div
                    key={ambulance.id}
                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedAmbulance?.id === ambulance.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                    onClick={() => handleAmbulanceClick(ambulance)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Link href={`/ambulance/${ambulance.id}`}>
                          <h3 className="font-medium text-sm">
                            {ambulance.ambulancemodel}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-600">
                          {ambulance.ambulancetype}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={ambulance.isOnline ? "default" : "secondary"}
                          className={ambulance.isOnline ? "bg-green-500" : ""}
                        >
                          {ambulance.isOnline ? "Online" : "Offline"}
                        </Badge>
                        {distance && (
                          <span className="text-xs text-gray-500">
                            {distance}km away
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-green-600">
                          ₹{ambulance.ambulancecharges}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <Phone size={10} />
                          {ambulance.contactnumber}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          getDirections(ambulance);
                        }}
                        disabled={!userLocation}
                      >
                        <Navigation size={12} className="mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile overlay backdrop */}
      {(isSidebarOpen || isControlsOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsControlsOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AmbulanceMap;
