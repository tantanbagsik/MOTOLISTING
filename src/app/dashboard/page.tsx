"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car, Plus, Edit, Trash2, Eye, Clock, CheckCircle, Home,
  LayoutDashboard, LogOut, Settings, Bell, User, MessageCircle,
  TrendingUp, DollarSign
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
}

export default function DashboardPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-card shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <Car className="w-8 h-8 text-primary" />
                <span className="font-outfit font-bold text-xl text-primary">Ray Panganiban Tech</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link href="/listings" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-1">
                <Car className="w-4 h-4" /> Browse
              </Link>
              <Link href="/dashboard" className="text-primary font-medium flex items-center gap-1">
                <User className="w-4 h-4" /> My Dashboard
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">{user?.name?.[0] || "U"}</span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-text-primary">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-card shadow-sm min-h-[calc(100vh-4rem)] transition-all duration-300 overflow-hidden lg:w-64`}>
          <div className="p-4">
            <div className="bg-primary/5 p-4 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{user?.name?.[0] || "U"}</span>
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{user?.name}</p>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                user?.role === 'admin' ? 'bg-primary text-white' :
                user?.role === 'seller' ? 'bg-success text-white' :
                'bg-gray-200 text-gray-700'
              }`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/listings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"
              >
                <Car className="w-5 h-5" />
                <span>My Listings</span>
                <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">{vehicles.length}</span>
              </Link>
              <Link
                href="/dashboard/listings/add"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Listing</span>
              </Link>
              <Link
                href="/dashboard/inquiries"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Inquiries</span>
              </Link>
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"
              >
                <Clock className="w-5 h-5" />
                <span>Bookings</span>
              </Link>
              <Link
                href="/listings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>Browse Vehicles</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-outfit text-3xl font-bold text-text-primary">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-text-secondary mt-1">Manage your vehicle listings and account</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Total Listings</p>
                  <p className="text-2xl font-bold text-text-primary">{vehicles.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Pending</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {vehicles.filter(v => v.listingStatus === "pending").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Approved</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {vehicles.filter(v => v.listingStatus === "approved").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Total Value</p>
                  <p className="text-2xl font-bold text-text-primary">
                    ₱{vehicles.reduce((sum, v) => sum + v.price, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              href="/dashboard/listings/add"
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Listing
            </Link>
            <Link
              href="/listings"
              className="flex items-center gap-2 bg-card text-text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Eye className="w-5 h-5" />
              Browse All Vehicles
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 bg-card text-text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {/* Recent Listings */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-outfit text-xl font-semibold text-text-primary">
                Your Listings
              </h2>
              <Link href="/dashboard/listings" className="text-primary text-sm hover:underline">
                View All →
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <div className="p-12 text-center">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  No listings yet
                </h3>
                <p className="text-text-secondary mb-6">
                  Start by adding your first vehicle listing
                </p>
                <Link
                  href="/dashboard/listings/add"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Add First Listing
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Vehicle</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vehicles.slice(0, 5).map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-background/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100"}
                              alt={vehicle.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-text-primary">{vehicle.make} {vehicle.model}</p>
                              <p className="text-sm text-text-secondary">{vehicle.year}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            vehicle.priceType === "sale" ? "bg-success/10 text-success" :
                            vehicle.priceType === "rent" ? "bg-accent/10 text-accent" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {vehicle.priceType === "sale" ? "Sale" : vehicle.priceType === "rent" ? "Rent" : "Installment"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-text-primary">
                          ₱{vehicle.priceType === "rent" ? `${vehicle.price.toLocaleString()}/day` : vehicle.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            vehicle.listingStatus === "approved" ? "bg-success/10 text-success" :
                            vehicle.listingStatus === "pending" ? "bg-warning/10 text-warning" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {vehicle.listingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-8 bg-card rounded-2xl shadow-card p-6">
            <h3 className="font-outfit text-lg font-semibold text-text-primary mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">@</span>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Email</p>
                  <p className="font-medium text-primary">raypanganiban0825@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">#</span>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Phone</p>
                  <p className="font-medium text-primary">09564804965</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
