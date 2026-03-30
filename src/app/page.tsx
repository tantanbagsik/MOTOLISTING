"use client";

import Link from "next/link";
import { Search, Car, CreditCard, Calendar, MapPin, ArrowRight, Shield, Clock, Headphones } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
  { icon: Car, title: "Wide Selection", desc: "Browse thousands of vehicles for sale, rent, or installment" },
  { icon: Shield, title: "Secure Payments", desc: "Safe and secure transaction processing" },
  { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer assistance" },
  { icon: Headphones, title: "AI Assistant", desc: "Voice-powered inquiries for quick answers" },
];

const quickLinks = [
  { href: "/listings?tab=sale", label: "Buy a Car", color: "bg-primary" },
  { href: "/listings?tab=rent", label: "Rent a Car", color: "bg-success" },
  { href: "/listings?tab=installment", label: "Installment Plan", color: "bg-accent" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-secondary via-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="font-outfit text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              Find Your Perfect
              <span className="text-accent block">Vehicle Today</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in stagger-1">
              Your trusted platform for car sales, rentals, and flexible installment plans. 
              AI-powered assistance to guide you every step of the way.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in stagger-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${link.color} text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="max-w-3xl mx-auto animate-fade-in stagger-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by make, model, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-14 rounded-full text-lg shadow-xl border-0 focus:ring-4 focus:ring-accent/50"
                />
                <Link
                  href={`/listings?q=${searchQuery}`}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-primary-600 transition-colors"
                >
                  <Search className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-card p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in stagger-${index + 1}`}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-outfit text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Search & Compare", desc: "Browse our extensive collection of vehicles with advanced filters" },
              { icon: Calendar, title: "Book or Purchase", desc: "Choose your preferred option - buy, rent, or installment plan" },
              { icon: Car, title: "Drive Away", desc: "Complete the paperwork and enjoy your new vehicle" },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <step.icon className="w-10 h-10 text-secondary" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-white text-secondary rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-outfit text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-outfit text-3xl font-bold text-text-primary mb-2">
                Featured Vehicles
              </h2>
              <p className="text-text-secondary">Handpicked selections just for you</p>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { make: "Toyota", model: "Camry", year: 2024, price: 2150000, type: "sale", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop" },
              { make: "Honda", model: "Civic", year: 2023, price: 3500, type: "rent", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400&h=300&fit=crop" },
              { make: "Tesla", model: "Model 3", year: 2024, price: 3850000, type: "installment", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop" },
            ].map((car, index) => (
              <Link
                key={index}
                href={`/listings`}
                className={`bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 group animate-fade-in stagger-${index + 1}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    car.type === "sale" ? "bg-success text-white" :
                    car.type === "rent" ? "bg-accent text-secondary" :
                    "bg-primary text-white"
                  }`}>
                    {car.type === "sale" ? "For Sale" : car.type === "rent" ? "For Rent" : "Installment"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-outfit text-xl font-semibold text-text-primary">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-text-secondary text-sm mb-3">{car.year}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {car.type === "rent" ? `₱${car.price.toLocaleString()}/day` : `₱${car.price.toLocaleString()}`}
                    </span>
                    <span className="text-sm text-text-secondary">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who found their perfect vehicle through Ray Panganiban Technology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/listings"
              className="bg-accent text-secondary px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Browse Vehicles
            </Link>
            <Link
              href="/seller"
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              List Your Car
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Car className="w-8 h-8 text-accent" />
                <span className="text-white font-outfit font-bold text-xl">Ray Panganiban Tech</span>
              </div>
              <p className="text-white/60">Your trusted partner in automotive solutions</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/listings" className="text-white/60 hover:text-white">For Sale</Link></li>
                <li><Link href="/listings?tab=rent" className="text-white/60 hover:text-white">For Rent</Link></li>
                <li><Link href="/listings?tab=installment" className="text-white/60 hover:text-white">Installment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/seller" className="text-white/60 hover:text-white">Seller Dashboard</Link></li>
                <li><Link href="/admin" className="text-white/60 hover:text-white">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-white/60">support@autohubpro.com</p>
              <p className="text-white/60">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40">
            © 2024 Ray Panganiban Technology. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
