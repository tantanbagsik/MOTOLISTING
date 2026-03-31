"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search, Car, CreditCard, Calendar, Shield, Clock, Headphones,
  ArrowRight, Star, ChevronRight, ShoppingBag, Tag, Users, CheckCircle,
  TrendingUp, Globe, Award
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { value: "10K+", label: "Vehicles Listed", icon: Car },
  { value: "5K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Cars Sold", icon: ShoppingBag },
  { value: "50+", label: "Cities Covered", icon: Globe },
];

const categories = [
  {
    title: "Buy a Car",
    description: "Browse thousands of quality vehicles for sale at competitive prices",
    icon: ShoppingBag,
    href: "/listings?tab=sale",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Rent a Car",
    description: "Flexible daily, weekly, or monthly rental options for any occasion",
    icon: Tag,
    href: "/listings?tab=rent",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Installment Plans",
    description: "Easy financing options with low monthly payments you can afford",
    icon: CreditCard,
    href: "/listings?tab=installment",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every vehicle is verified by our team for quality and authenticity",
  },
  {
    icon: Clock,
    title: "Quick Process",
    description: "List your car in minutes or find your dream car with fast search",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated team is always ready to help you with any questions",
  },
  {
    icon: Award,
    title: "Best Deals",
    description: "Competitive pricing and exclusive deals you won't find anywhere else",
  },
];

const testimonials = [
  {
    name: "Juan Dela Cruz",
    role: "Car Buyer",
    content: "Found my dream Toyota Fortuner at an amazing price. The process was smooth and the team was very helpful!",
    rating: 5,
    avatar: "J",
  },
  {
    name: "Maria Santos",
    role: "Car Seller",
    content: "Sold my car within a week of listing. The platform is easy to use and reach many potential buyers.",
    rating: 5,
    avatar: "M",
  },
  {
    name: "Carlos Reyes",
    role: "Rental Customer",
    content: "Rented a car for our family trip. Great selection and very affordable rates. Highly recommended!",
    rating: 5,
    avatar: "C",
  },
];

const brands = ["Toyota", "Honda", "Mitsubishi", "Nissan", "Ford", "Mazda", "Hyundai", "Kia"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/listings?status=approved")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedVehicles(data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-secondary via-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6 animate-fade-in">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white/80 text-sm">Trusted by 10,000+ customers</span>
              </div>

              <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in leading-tight">
                Find Your Perfect
                <span className="text-accent block">Vehicle Today</span>
              </h1>

              <p className="text-lg text-white/70 max-w-xl mb-10 animate-fade-in stagger-1 leading-relaxed">
                The Philippines&apos; trusted marketplace for buying, renting, and financing vehicles. 
                Browse thousands of verified listings and find your dream car.
              </p>

              <div className="bg-white rounded-2xl p-2 shadow-2xl animate-fade-in stagger-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-text-secondary ml-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by make, model, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-3 text-text-primary placeholder-text-secondary outline-none bg-transparent"
                  />
                  <Link
                    href={`/listings?q=${searchQuery}`}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex-shrink-0"
                  >
                    Search
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 animate-fade-in stagger-3">
                {["Toyota", "Honda", "Mitsubishi", "Nissan"].map((brand) => (
                  <Link
                    key={brand}
                    href={`/listings?q=${brand}`}
                    className="px-4 py-2 bg-white/10 backdrop-blur text-white/80 rounded-full text-sm hover:bg-white/20 transition-colors"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative animate-fade-in stagger-2">
                <img
                  src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop"
                  alt="Luxury Car"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">Verified Listing</p>
                      <p className="text-sm text-text-secondary">Quality guaranteed</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-accent text-secondary rounded-xl p-3 shadow-xl">
                  <p className="text-xs font-medium">Starting from</p>
                  <p className="text-xl font-bold">₱2,500/day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-outfit text-3xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-text-secondary text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Are You Looking For?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Whether you want to buy, rent, or finance, we have the perfect option for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="group bg-card rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${cat.bgColor} rounded-xl flex items-center justify-center mb-5`}>
                  <cat.icon className={`w-7 h-7 ${cat.iconColor}`} />
                </div>
                <h3 className="font-outfit text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Browse Now <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="font-outfit text-3xl font-bold text-text-primary mb-2">
                Featured Vehicles
              </h2>
              <p className="text-text-secondary">Explore our handpicked selection of quality vehicles</p>
            </div>
            <Link
              href="/listings"
              className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle, i) => (
                <Link
                  key={vehicle.id}
                  href={vehicle.priceType === "rent" ? `/rent/${vehicle.id}` : `/listings/${vehicle.id}`}
                  className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop"}
                      alt={vehicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.priceType === "sale" ? "bg-green-500 text-white" :
                      vehicle.priceType === "rent" ? "bg-amber-500 text-white" :
                      "bg-blue-500 text-white"
                    }`}>
                      {vehicle.priceType === "sale" ? "For Sale" : vehicle.priceType === "rent" ? "For Rent" : "Installment"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-outfit text-lg font-semibold text-text-primary mb-1">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">
                      {vehicle.year} {vehicle.transmission && `• ${vehicle.transmission}`} {vehicle.fuelType && `• ${vehicle.fuelType}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {vehicle.priceType === "rent"
                          ? `₱${vehicle.price?.toLocaleString()}/day`
                          : `₱${vehicle.price?.toLocaleString()}`}
                      </span>
                      <span className="text-sm text-primary font-medium flex items-center gap-1">
                        View <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-gray-100">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No vehicles yet</h3>
              <p className="text-text-secondary mb-6">Be the first to list your vehicle on our platform</p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                List Your Vehicle
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search & Compare",
                description: "Browse our extensive collection of vehicles with advanced filters and find your perfect match",
                icon: Search,
              },
              {
                step: "02",
                title: "Connect & Negotiate",
                description: "Contact sellers directly, ask questions, and negotiate the best deal for your budget",
                icon: Users,
              },
              {
                step: "03",
                title: "Purchase & Drive",
                description: "Complete the transaction securely and drive away in your new vehicle with confidence",
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200"></div>
                )}
                <div className="relative inline-flex">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                    <item.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 bg-accent text-secondary text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-outfit text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose MOTOLISTING
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We provide the best experience for buying and selling vehicles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-outfit text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center font-outfit text-lg font-semibold text-text-secondary mb-8">
            Popular Brands
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/listings?q=${brand}`}
                className="px-6 py-3 bg-gray-50 rounded-xl text-text-secondary font-medium hover:bg-primary hover:text-white transition-all"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Trusted by thousands of satisfied customers across the Philippines
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{testimonial.name}</p>
                    <p className="text-text-secondary text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers. Whether you want to buy, sell, or rent, 
            MOTOLISTING has you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/listings"
              className="bg-accent text-secondary px-8 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors"
            >
              Browse Vehicles
            </Link>
            <Link
              href="/auth/register"
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
