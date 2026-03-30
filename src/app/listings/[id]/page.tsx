"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Shield, CreditCard, Truck, FileText, Download } from "lucide-react";

const mockVehicleDetail = {
  id: "1",
  make: "Toyota",
  model: "Camry",
  year: 2024,
  price: 2150000,
  priceType: "sale",
  mileage: 5000,
  color: "Pearl White",
  transmission: "Automatic",
  engine: "2.5L 4-Cylinder",
  fuelType: "Petrol",
  condition: "New",
  description: "Experience the perfect blend of elegance and performance with the 2024 Toyota Camry. This stunning vehicle features a powerful yet efficient engine, advanced safety features, and a luxurious interior designed for ultimate comfort.",
  features: ["Apple CarPlay", "Android Auto", "Lane Departure Warning", "Adaptive Cruise Control", "Wireless Charging", "Premium Sound System"],
  images: [
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1568577216339-378c6f4f49e1?w=800&h=600&fit=crop",
  ],
  seller: {
    name: "Premium Auto Gallery",
    phone: "+63 912 345 6789",
    email: "sales@raypanganibantech.com",
    location: "Metro Manila, Philippines",
  },
};

const insuranceOptions = [
  { type: "Basic", cost: 25000, coverage: "Third Party Only" },
  { type: "Comprehensive", cost: 45000, coverage: "Full Coverage" },
  { type: "Premium", cost: 75000, coverage: "Full + Gap Insurance" },
];

const installmentDurations = [12, 24, 36, 48, 60];

export default function VehicleDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [insuranceType, setInsuranceType] = useState("Basic");
  const [downPayment, setDownPayment] = useState(20);
  const [duration, setDuration] = useState(36);
  const [accessories, setAccessories] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const vehicle = mockVehicleDetail;
  const selectedInsurance = insuranceOptions.find(i => i.type === insuranceType) || insuranceOptions[0];
  
  const basePrice = vehicle.price;
  const insuranceCost = selectedInsurance.cost;
  const downPaymentAmount = (basePrice * downPayment) / 100;
  const remainingAmount = basePrice - downPaymentAmount + accessories + deliveryFee;
  const monthlyPayment = remainingAmount / duration;

  const generatePDF = () => {
    alert("Quotation PDF would be generated here with all the selected options.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/listings" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" /> Back to Listings
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="relative h-96">
                <img
                  src={vehicle.images[selectedImage]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 px-4 py-2 bg-accent text-secondary rounded-full font-semibold">
                  For Sale
                </span>
              </div>
              <div className="p-4 flex gap-3 overflow-x-auto">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6">
              <h1 className="font-outfit text-3xl font-bold text-text-primary mb-2">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-text-secondary text-lg mb-4">{vehicle.year}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-background p-4 rounded-xl">
                  <p className="text-text-secondary text-sm">Mileage</p>
                  <p className="font-semibold text-text-primary">{vehicle.mileage?.toLocaleString()} mi</p>
                </div>
                <div className="bg-background p-4 rounded-xl">
                  <p className="text-text-secondary text-sm">Transmission</p>
                  <p className="font-semibold text-text-primary">{vehicle.transmission}</p>
                </div>
                <div className="bg-background p-4 rounded-xl">
                  <p className="text-text-secondary text-sm">Fuel Type</p>
                  <p className="font-semibold text-text-primary">{vehicle.fuelType}</p>
                </div>
                <div className="bg-background p-4 rounded-xl">
                  <p className="text-text-secondary text-sm">Condition</p>
                  <p className="font-semibold text-text-primary">{vehicle.condition}</p>
                </div>
              </div>

              <h2 className="font-outfit text-xl font-semibold mb-4">Description</h2>
              <p className="text-text-secondary leading-relaxed">{vehicle.description}</p>

              <h2 className="font-outfit text-xl font-semibold mt-6 mb-4">Features</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-outfit text-xl font-semibold">Quotation</h2>
                <CreditCard className="w-5 h-5 text-primary" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Insurance Type
                  </label>
                  <select
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    {insuranceOptions.map((opt) => (
                      <option key={opt.type} value={opt.type}>
                        {opt.type} - ₱{opt.cost.toLocaleString()} ({opt.coverage})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Down Payment: {downPayment}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Installment Duration
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {installmentDurations.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          duration === d
                            ? "bg-primary text-white"
                            : "bg-background text-text-secondary hover:bg-primary/10"
                        }`}
                      >
                        {d} mo
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Accessories
                  </label>
                  <select
                    value={accessories}
                    onChange={(e) => setAccessories(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value={0}>None - ₱0</option>
                    <option value={5000}>Floor Mats - ₱5,000</option>
                    <option value={15000}>Premium Package - ₱15,000</option>
                    <option value={35000}>Tech Package - ₱35,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Delivery
                  </label>
                  <select
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value={0}>Pickup - ₱0</option>
                    <option value={1500}>Local Delivery - ₱1,500</option>
                    <option value={5000}>Long Distance - ₱5,000</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Base Price</span>
                  <span className="font-semibold">₱{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Insurance ({insuranceType})</span>
                  <span className="font-semibold">₱{insuranceCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Down Payment ({downPayment}%)</span>
                  <span className="font-semibold">-₱{downPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Accessories</span>
                  <span className="font-semibold">₱{accessories.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery</span>
                  <span className="font-semibold">₱{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>Total Price</span>
                  <span className="text-primary">₱{(basePrice + insuranceCost - downPaymentAmount + accessories + deliveryFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-success font-semibold">
                  <span>Monthly Payment</span>
                  <span>₱{monthlyPayment.toLocaleString()}/mo</span>
                </div>
              </div>

              <button
                onClick={generatePDF}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Download className="w-5 h-5" /> Download Quotation
              </button>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-outfit text-lg font-semibold mb-4">Seller Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{vehicle.seller.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{vehicle.seller.name}</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {vehicle.seller.location}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${vehicle.seller.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" /> {vehicle.seller.phone}
                </a>
                <a
                  href={`mailto:${vehicle.seller.email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="w-4 h-4" /> {vehicle.seller.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
