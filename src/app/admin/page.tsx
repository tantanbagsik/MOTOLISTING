"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Car, MapPin, Gauge, Navigation, DollarSign, TrendingUp, Users, Activity, Download, RefreshCw } from "lucide-react";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface VehicleLocation {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: Date;
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
  };
}

const shopLocation = { lat: 34.0522, lng: -118.2437 };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "tracking" | "vehicles" | "sales">("overview");
  const [isLive, setIsLive] = useState(true);
  const [locations, setLocations] = useState<VehicleLocation[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch("/api/locations");
      const data = await res.json();
      setLocations(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchVehicles();
      await fetchLocations();
      setLoading(false);
    };
    init();
  }, [fetchLocations, fetchVehicles]);

  useEffect(() => {
    if (isLive && activeTab === "tracking") {
      const interval = setInterval(() => {
        fetchLocations();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive, activeTab, fetchLocations]);

  const simulateMovement = async (vehicleId: string) => {
    const vehicle = locations.find(l => l.vehicleId === vehicleId);
    if (!vehicle) return;

    const newLat = vehicle.latitude + (Math.random() - 0.5) * 0.005;
    const newLng = vehicle.longitude + (Math.random() - 0.5) * 0.005;
    const newSpeed = Math.floor(Math.random() * 80);

    await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId,
        latitude: newLat,
        longitude: newLng,
        speed: newSpeed,
      }),
    });

    fetchLocations();
  };

  const calculateDistance = (lat: number, lng: number) => {
    const R = 6371;
    const dLat = (lat - shopLocation.lat) * Math.PI / 180;
    const dLng = (lng - shopLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(shopLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const getStatusColor = (speed: number) => {
    if (speed === 0) return "bg-gray-400";
    if (speed < 40) return "bg-success";
    if (speed < 70) return "bg-warning";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-white/80">Manage vehicles, track locations, and view analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLive ? "bg-success text-white" : "bg-white/10 text-white"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isLive ? "animate-spin" : ""}`} />
                {isLive ? "Live" : "Paused"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", icon: Activity, label: "Overview" },
            { id: "tracking", icon: MapPin, label: "Live Tracking" },
            { id: "vehicles", icon: Car, label: "Vehicles" },
            { id: "sales", icon: DollarSign, label: "Sales Summary" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-card text-text-secondary hover:bg-primary/10"
              }`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Car, label: "Total Vehicles", value: vehicles.length, change: "+12%", color: "bg-primary" },
                { icon: TrendingUp, label: "Available", value: vehicles.filter(v => v.status === "available").length, change: "+8%", color: "bg-success" },
                { icon: MapPin, label: "Active Tracking", value: locations.length, change: "+5%", color: "bg-accent" },
                { icon: Users, label: "Total Users", value: 156, change: "+15%", color: "bg-warning" },
              ].map((stat, index) => (
                <div key={index} className="bg-card rounded-2xl shadow-card p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-text-secondary text-sm">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="font-outfit text-3xl font-bold text-text-primary">{stat.value}</p>
                    <span className="text-success text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h3 className="font-outfit text-xl font-semibold mb-4">Tracking Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                      <span className="text-text-primary">Active Vehicles</span>
                    </div>
                    <span className="font-bold text-success">{locations.filter(l => l.speed > 0).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-text-primary">Idle Vehicles</span>
                    </div>
                    <span className="font-bold text-text-secondary">{locations.filter(l => l.speed === 0).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span className="text-text-primary">Avg Distance</span>
                    </div>
                    <span className="font-bold text-primary">
                      {locations.length > 0 
                        ? (locations.reduce((sum, l) => sum + parseFloat(calculateDistance(l.latitude, l.longitude)), 0) / locations.length).toFixed(1)
                        : 0} km
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6">
                <h3 className="font-outfit text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {locations.slice(0, 5).map((loc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-xl">
                      <div className="flex items-center gap-3">
                        <Car className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-text-primary text-sm">{loc.vehicle?.make} {loc.vehicle?.model}</p>
                          <p className="text-xs text-text-secondary">{loc.speed} km/h</p>
                        </div>
                      </div>
                      <span className="text-xs text-text-secondary">{new Date(loc.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-outfit text-xl font-semibold">Live Vehicle Locations</h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-success rounded-full animate-pulse"></span>
                  <span className="text-text-secondary text-sm">Tracking {locations.length} vehicles</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-background rounded-xl h-[500px] relative overflow-hidden">
                    {typeof window !== "undefined" && (
                      <MapContainer
                        center={[shopLocation.lat, shopLocation.lng]}
                        zoom={14}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[shopLocation.lat, shopLocation.lng]}>
                          <Popup>
                            <div className="text-center">
                              <p className="font-bold">Shop Location</p>
                              <p className="text-sm">34.0522° N, 118.2437° W</p>
                            </div>
                          </Popup>
                        </Marker>
                        {locations.map((loc) => (
                          <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                            <Popup>
                              <div className="text-center">
                                <p className="font-bold">{loc.vehicle?.make} {loc.vehicle?.model}</p>
                                <p className="text-sm">Speed: {loc.speed} km/h</p>
                                <p className="text-sm">Distance: {calculateDistance(loc.latitude, loc.longitude)} km</p>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    )}
                    {!loading && locations.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background">
                        <div className="text-center">
                          <MapPin className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                          <p className="text-text-secondary">No vehicles being tracked</p>
                          <p className="text-sm text-text-secondary">Add vehicle locations to see them on the map</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-text-primary">Tracked Vehicles</h4>
                  {loading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 text-primary mx-auto animate-spin" />
                      <p className="text-text-secondary mt-2">Loading...</p>
                    </div>
                  ) : locations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-text-secondary">No tracked vehicles</p>
                      <button
                        onClick={fetchLocations}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
                      >
                        Refresh
                      </button>
                    </div>
                  ) : (
                    locations.map((loc) => (
                      <div
                        key={loc.id}
                        className="bg-background p-4 rounded-xl cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(loc.speed)}`}></div>
                            <div>
                              <p className="font-medium text-text-primary">{loc.vehicle?.make} {loc.vehicle?.model}</p>
                              <p className="text-xs text-text-secondary">ID: {loc.vehicleId.slice(0, 8)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => simulateMovement(loc.vehicleId)}
                            className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg"
                            title="Simulate movement"
                          >
                            <Navigation className="w-4 h-4 text-primary" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1 text-text-secondary">
                            <Gauge className="w-3 h-3" /> {loc.speed} km/h
                          </div>
                          <div className="flex items-center gap-1 text-text-secondary">
                            <Navigation className="w-3 h-3" /> {calculateDistance(loc.latitude, loc.longitude)} km
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary mt-2">
                          {new Date(loc.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {locations.length > 0 && (
                <div className="mt-4 bg-primary/5 p-4 rounded-xl">
                  <h4 className="font-semibold text-text-primary mb-3">Live Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{locations.length}</p>
                      <p className="text-sm text-text-secondary">Total Tracked</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">{locations.filter(l => l.speed > 0).length}</p>
                      <p className="text-sm text-text-secondary">Moving</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">{Math.max(...locations.map(l => l.speed))}</p>
                      <p className="text-sm text-text-secondary">Max Speed (km/h)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {(locations.reduce((sum, l) => sum + l.speed, 0) / locations.length || 0).toFixed(0)}
                      </p>
                      <p className="text-sm text-text-secondary">Avg Speed (km/h)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "vehicles" && (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-outfit text-xl font-semibold">Vehicle Database</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Vehicle</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vehicles.map((vehicle) => {
                      const loc = locations.find(l => l.vehicleId === vehicle.id);
                      return (
                        <tr key={vehicle.id} className="hover:bg-background/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-text-primary">{vehicle.make} {vehicle.model}</p>
                              <p className="text-sm text-text-secondary">{vehicle.year}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              vehicle.priceType === "sale" ? "bg-success/10 text-success" :
                              vehicle.priceType === "rent" ? "bg-accent/10 text-accent" :
                              "bg-primary/10 text-primary"
                            }`}>
                              {vehicle.priceType}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-text-primary">
₱{vehicle.priceType === "rent" ? `${vehicle.price.toLocaleString()}/day` : vehicle.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              vehicle.status === "available" ? "bg-success/10 text-success" :
                              vehicle.status === "sold" ? "bg-warning/10 text-warning" :
                              "bg-primary/10 text-primary"
                            }`}>
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {loc ? (
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(loc.speed)}`}></div>
                                <span className="text-sm text-text-secondary">{loc.speed} km/h</span>
                              </div>
                            ) : (
                              <span className="text-sm text-text-secondary">Not tracked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <p className="text-text-secondary text-sm">Total Vehicles</p>
                <p className="font-outfit text-3xl font-bold text-text-primary">{vehicles.length}</p>
              </div>
              <div className="bg-card rounded-2xl shadow-card p-6">
                <p className="text-text-secondary text-sm">Available</p>
                <p className="font-outfit text-3xl font-bold text-success">
                  {vehicles.filter(v => v.status === "available").length}
                </p>
              </div>
              <div className="bg-card rounded-2xl shadow-card p-6">
                <p className="text-text-secondary text-sm">Total Value</p>
                <p className="font-outfit text-3xl font-bold text-primary">
                  ₱{vehicles.reduce((sum, v) => sum + v.price, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-outfit text-xl font-semibold">All Vehicles</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Vehicle</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-background/50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-text-primary">{vehicle.make} {vehicle.model}</p>
                          <p className="text-sm text-text-secondary">{vehicle.year}</p>
                        </td>
                        <td className="px-6 py-4 text-text-secondary capitalize">{vehicle.priceType}</td>
                        <td className="px-6 py-4 font-semibold text-success">
                          ₱{vehicle.priceType === "rent" ? `${vehicle.price.toLocaleString()}/day` : vehicle.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            vehicle.status === "available" ? "bg-success/10 text-success" :
                            "bg-warning/10 text-warning"
                          }`}>
                            {vehicle.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
