"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, Grid, List, Mic, MicOff, Send, X } from "lucide-react";

type PriceType = "sale" | "rent" | "installment";

const mockVehicles = [
  { id: "1", make: "Toyota", model: "Camry", year: 2024, price: 2150000, priceType: "sale", mileage: 5000, transmission: "Automatic", fuelType: "Petrol", condition: "New", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop" },
  { id: "2", make: "Honda", model: "Civic", year: 2023, price: 3500, priceType: "rent", mileage: 25000, transmission: "Automatic", fuelType: "Petrol", condition: "Used", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400&h=300&fit=crop" },
  { id: "3", make: "Tesla", model: "Model 3", year: 2024, price: 3850000, priceType: "installment", mileage: 1000, transmission: "Automatic", fuelType: "Electric", condition: "New", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop" },
  { id: "4", make: "BMW", model: "3 Series", year: 2023, price: 3850000, priceType: "sale", mileage: 15000, transmission: "Automatic", fuelType: "Petrol", condition: "Used", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop" },
  { id: "5", make: "Mercedes", model: "C-Class", year: 2024, price: 4250000, priceType: "sale", mileage: 3000, transmission: "Automatic", fuelType: "Diesel", condition: "New", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=300&fit=crop" },
  { id: "6", make: "Audi", model: "A4", year: 2023, price: 2850000, priceType: "installment", mileage: 20000, transmission: "Automatic", fuelType: "Petrol", condition: "Used", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop" },
  { id: "7", make: "Toyota", model: "Fortuner", year: 2024, price: 1850000, priceType: "sale", mileage: 8000, transmission: "Automatic", fuelType: "Diesel", condition: "New", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=300&fit=crop" },
  { id: "8", make: "Mitsubishi", model: " Montero Sport", year: 2024, price: 4500, priceType: "rent", mileage: 18000, transmission: "Automatic", fuelType: "Diesel", condition: "Used", image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop" },
];

const priceTypeLabels: Record<PriceType, string> = {
  sale: "For Sale",
  rent: "For Rent",
  installment: "For Installment",
};

function ListingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as PriceType) || "sale";
  
  const [activeTab, setActiveTab] = useState<PriceType>(initialTab);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showInquiry, setShowInquiry] = useState<string | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    minPrice: "",
    maxPrice: "",
    transmission: "",
    fuelType: "",
  });

  useEffect(() => {
    const tab = searchParams.get("tab") as PriceType;
    if (tab && ["sale", "rent", "installment"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesTab = v.priceType === activeTab;
    const matchesSearch = searchQuery === "" || 
      `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMake = filters.make === "" || v.make === filters.make;
    const matchesTransmission = filters.transmission === "" || v.transmission === filters.transmission;
    const matchesFuel = filters.fuelType === "" || v.fuelType === filters.fuelType;
    return matchesTab && matchesSearch && matchesMake && matchesTransmission && matchesFuel;
  });

  const toggleVoice = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };
      
      recognition.start();
    } else {
      alert("Voice recognition not supported in this browser");
    }
  };

  const handleInquiry = (vehicleId: string) => {
    if (inquiryMessage.trim()) {
      alert(`Inquiry sent: ${inquiryMessage}`);
      setInquiryMessage("");
      setShowInquiry(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-6">
            Browse Vehicles
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search make, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg shadow-lg border-0 focus:ring-2 focus:ring-accent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <button
                onClick={toggleVoice}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                  isListening ? "bg-warning text-white animate-pulse" : "text-text-secondary hover:text-primary"
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>
          </div>

          {isListening && (
            <div className="mt-4 flex items-center gap-2 text-white/80 animate-pulse">
              <Mic className="w-5 h-5" /> Listening...
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {showFilters && (
            <aside className="lg:w-72 bg-card rounded-2xl shadow-card p-6 h-fit animate-slide-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-outfit text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="lg:hidden">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Make</label>
                  <select
                    value={filters.make}
                    onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Makes</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Audi">Audi</option>
                    <option value="Tesla">Tesla</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {(Object.keys(priceTypeLabels) as PriceType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "bg-card text-text-secondary hover:bg-primary/10"
                    }`}
                  >
                    {priceTypeLabels[tab]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-primary text-white" : "bg-card text-text-secondary"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-primary text-white" : "bg-card text-text-secondary"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-text-secondary mb-4">{filteredVehicles.length} vehicles found</p>

            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filteredVehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className={`bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 animate-fade-in stagger-${(index % 5) + 1} ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <div className={`relative h-48 overflow-hidden ${viewMode === "list" ? "w-72 flex-shrink-0" : ""}`}>
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.priceType === "sale" ? "bg-success text-white" :
                      vehicle.priceType === "rent" ? "bg-accent text-secondary" :
                      "bg-primary text-white"
                    }`}>
                      {priceTypeLabels[vehicle.priceType as PriceType]}
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1">
                    <h3 className="font-outfit text-xl font-semibold text-text-primary">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">{vehicle.year} • {vehicle.mileage?.toLocaleString()} miles • {vehicle.transmission}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{vehicle.fuelType}</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{vehicle.condition}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {vehicle.priceType === "rent" ? `₱${vehicle.price.toLocaleString()}/day` : `₱${vehicle.price.toLocaleString()}`}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowInquiry(vehicle.id)}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm"
                        >
                          Inquire
                        </button>
                        {vehicle.priceType === "rent" ? (
                          <Link
                            href={`/rent/${vehicle.id}`}
                            className="px-4 py-2 bg-accent text-secondary rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                          >
                            Book Now
                          </Link>
                        ) : (
                          <Link
                            href={`/listings/${vehicle.id}`}
                            className="px-4 py-2 bg-accent text-secondary rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No vehicles found matching your criteria</p>
                <button
                  onClick={() => { setSearchQuery(""); setFilters({ make: "", minPrice: "", maxPrice: "", transmission: "", fuelType: "" }); }}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-outfit text-xl font-semibold">Send Inquiry</h3>
              <button onClick={() => setShowInquiry(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {["Is this available?", "What's the lowest price?", "Can I test drive?", "Include insurance?"].map((template) => (
                <button
                  key={template}
                  onClick={() => setInquiryMessage(template)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    inquiryMessage === template
                      ? "bg-primary text-white"
                      : "bg-background text-text-secondary hover:bg-primary/10"
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>

            <textarea
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              placeholder="Or type your message..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary mb-4"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={toggleVoice}
                className={`p-3 rounded-lg ${isListening ? "bg-warning text-white" : "bg-background text-text-secondary"}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                onClick={() => handleInquiry(showInquiry)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5" /> Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
      <ListingsContent />
    </Suspense>
  );
}
