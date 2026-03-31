"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car, Plus, Edit, Trash2, Eye, Clock, CheckCircle, Home,
  LayoutDashboard, LogOut, Bell, User, MessageCircle,
  DollarSign, Tag, ShoppingBag, CreditCard, TrendingUp,
  Filter, Grid3X3, List, ChevronRight, Calendar, Phone, Mail, MapPin
} from "lucide-react";

interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceType: string;
  listingStatus: string;
  createdAt: string;
  images: string[];
  color: string | null;
  transmission: string | null;
  mileage: number | null;
  fuelType: string | null;
}

type TabType = "all" | "sale" | "rent" | "installment";

export default function DashboardPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchUserData();
    fetchUserVehicles();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      router.push("/auth/login");
    }
  };

  const fetchUserVehicles = async () => {
    try {
      const res = await fetch("/api/dashboard/listings");
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await fetch(`/api/listings/${id}`, { method: "DELETE" });
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesTab = activeTab === "all" || v.priceType === activeTab;
    const matchesStatus = statusFilter === "all" || v.listingStatus === statusFilter;
    return matchesTab && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    sale: vehicles.filter(v => v.priceType === "sale").length,
    rent: vehicles.filter(v => v.priceType === "rent").length,
    installment: vehicles.filter(v => v.priceType === "installment").length,
    approved: vehicles.filter(v => v.listingStatus === "approved").length,
    pending: vehicles.filter(v => v.listingStatus === "pending").length,
    totalValue: vehicles.reduce((sum, v) => sum + v.price, 0),
  };

  const tabs = [
    { id: "all" as TabType, label: "All Listings", icon: Grid3X3, count: stats.total },
    { id: "sale" as TabType, label: "For Sale", icon: ShoppingBag, count: stats.sale },
    { id: "rent" as TabType, label: "For Rent", icon: Tag, count: stats.rent },
    { id: "installment" as TabType, label: "Installment", icon: CreditCard, count: stats.installment },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-text-secondary text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-accent" />
              <span className="font-outfit font-bold text-lg hidden sm:block">MOTOLISTING</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link href="/listings" className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1">
                <Car className="w-4 h-4" /> Browse
              </Link>
              <Link href="/dashboard" className="text-white font-medium text-sm flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="text-white/70 hover:text-white transition-colors text-sm">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{user?.name?.[0] || "U"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-primary to-primary-700 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.[0] || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-outfit font-bold">Welcome back, {user?.name || "User"}!</h1>
                <p className="text-white/80 text-sm mt-1">Manage your vehicle listings and grow your business</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.role === "admin" ? "bg-accent text-secondary" :
                user?.role === "seller" ? "bg-success/80 text-white" :
                "bg-white/20 text-white"
              }`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-white/60" />
              <span className="text-white/90">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-white/60" />
                <span className="text-white/90">{user?.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-white/90">Member since {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-card rounded-xl shadow-card p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Total</p>
                <p className="text-xl font-bold text-text-primary">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">For Sale</p>
                <p className="text-xl font-bold text-text-primary">{stats.sale}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">For Rent</p>
                <p className="text-xl font-bold text-text-primary">{stats.rent}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Installment</p>
                <p className="text-xl font-bold text-text-primary">{stats.installment}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Approved</p>
                <p className="text-xl font-bold text-text-primary">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Pending</p>
                <p className="text-xl font-bold text-text-primary">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/dashboard/listings/add"
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Listing
          </Link>
          <Link
            href="/listings"
            className="flex items-center gap-2 bg-card text-text-primary px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 text-sm"
          >
            <Eye className="w-4 h-4" />
            Browse Marketplace
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-2 bg-card text-text-primary px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 text-sm"
          >
            <Calendar className="w-4 h-4" />
            My Bookings
          </Link>
          <Link
            href="/dashboard/inquiries"
            className="flex items-center gap-2 bg-card text-text-primary px-5 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Inquiries
          </Link>
        </div>

        {/* Listings Section */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden border border-gray-100">
          {/* Tabs Header */}
          <div className="border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-white/20" : "bg-gray-100"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-text-secondary hover:bg-gray-50"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-text-secondary hover:bg-gray-50"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Content */}
          {filteredVehicles.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {activeTab === "all" ? "No listings yet" : `No ${activeTab} listings`}
              </h3>
              <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                {activeTab === "all"
                  ? "Start by adding your first vehicle to the marketplace"
                  : `You don't have any ${activeTab} listings yet`}
              </p>
              <Link
                href="/dashboard/listings/add"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Listing
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-card-hover transition-shadow group"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400"}
                      alt={vehicle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        vehicle.priceType === "sale" ? "bg-green-500 text-white" :
                        vehicle.priceType === "rent" ? "bg-accent text-white" :
                        "bg-blue-500 text-white"
                      }`}>
                        {vehicle.priceType === "sale" ? "For Sale" : vehicle.priceType === "rent" ? "For Rent" : "Installment"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        vehicle.listingStatus === "approved" ? "bg-green-100 text-green-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {vehicle.listingStatus === "approved" ? "Live" : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary text-sm truncate">{vehicle.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                      <span>{vehicle.year}</span>
                      {vehicle.transmission && <span>• {vehicle.transmission}</span>}
                      {vehicle.color && <span>• {vehicle.color}</span>}
                    </div>
                    <p className="text-lg font-bold text-primary mt-2">
                      ₱{vehicle.priceType === "rent"
                        ? `${vehicle.price.toLocaleString()}/day`
                        : vehicle.price.toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Link
                        href={`/listings/${vehicle.id}`}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
                      </Link>
                      <Link
                        href={`/dashboard/listings/edit/${vehicle.id}`}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <img
                    src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100"}
                    alt={vehicle.title}
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{vehicle.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                      <span>{vehicle.year}</span>
                      {vehicle.mileage && <span>• {vehicle.mileage.toLocaleString()} km</span>}
                      {vehicle.transmission && <span>• {vehicle.transmission}</span>}
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.priceType === "sale" ? "bg-green-100 text-green-700" :
                      vehicle.priceType === "rent" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {vehicle.priceType === "sale" ? "Sale" : vehicle.priceType === "rent" ? "Rent" : "Installment"}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.listingStatus === "approved" ? "bg-green-100 text-green-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {vehicle.listingStatus}
                    </span>
                  </div>
                  <p className="font-bold text-primary text-sm whitespace-nowrap">
                    ₱{vehicle.priceType === "rent"
                      ? `${vehicle.price.toLocaleString()}/day`
                      : vehicle.price.toLocaleString()}
                  </p>
                  <div className="flex gap-1">
                    <Link
                      href={`/dashboard/listings/edit/${vehicle.id}`}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-card rounded-2xl shadow-card p-6 border border-gray-100">
          <h3 className="font-outfit text-lg font-semibold text-text-primary mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:raypanganiban0825@gmail.com" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Email Support</p>
                <p className="font-medium text-primary text-sm">raypanganiban0825@gmail.com</p>
              </div>
            </a>
            <a href="tel:09564804965" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Phone Support</p>
                <p className="font-medium text-text-primary text-sm">09564804965</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
