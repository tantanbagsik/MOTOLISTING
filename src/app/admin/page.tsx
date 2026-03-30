"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car, Users, CheckCircle, Clock, Eye, DollarSign, TrendingUp,
  MapPin, Navigation, RefreshCw, LogOut, Home, Check, X, Trash2,
  Activity, Download
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "users" | "tracking">("overview");
  const [listings, setListings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes, usersRes] = await Promise.all([
        fetch("/api/listings?status=all"),
        fetch("/api/admin/users"),
      ]);

      if (listingsRes.ok) {
        const data = await listingsRes.json();
        setListings(data);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveListing = async (id: string) => {
    try {
      await fetch(`/api/admin/listings/${id}/approve`, { method: "POST" });
      setListings(listings.map(l =>
        l.id === id ? { ...l, listingStatus: "approved" } : l
      ));
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const rejectListing = async (id: string) => {
    try {
      await fetch(`/api/listings/${id}`, { method: "DELETE" });
      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await fetch(`/api/listings/${id}`, { method: "DELETE" });
      setListings(listings.filter(l => l.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const filteredListings = filter === "all"
    ? listings
    : listings.filter(l => l.listingStatus === filter);

  const stats = {
    totalListings: listings.length,
    pendingListings: listings.filter(l => l.listingStatus === "pending").length,
    approvedListings: listings.filter(l => l.listingStatus === "approved").length,
    totalUsers: users.length,
    totalValue: listings.reduce((sum, l) => sum + (l.price || 0), 0),
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
      {/* Header */}
      <header className="bg-secondary text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="w-8 h-8 text-accent" />
            <span className="font-outfit font-bold text-xl">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">Ray Panganiban Technology</span>
            <Link href="/" className="p-2 hover:bg-white/10 rounded-lg">
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-secondary min-h-screen text-white p-4 relative">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${
                activeTab === "overview" ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Activity className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${
                activeTab === "listings" ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Car className="w-5 h-5" />
              Listings
              {stats.pendingListings > 0 && (
                <span className="ml-auto bg-warning text-xs px-2 py-1 rounded-full">
                  {stats.pendingListings}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${
                activeTab === "users" ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Users className="w-5 h-5" />
              Users
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${
                activeTab === "tracking" ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <MapPin className="w-5 h-5" />
              Live Tracking
            </button>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/10 p-3 rounded-xl text-sm">
              <p className="text-white/60">Contact</p>
              <p>raypanganiban0825@gmail.com</p>
              <p>09564804965</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "overview" && (
            <div>
              <h1 className="font-outfit text-2xl font-bold text-text-primary mb-6">
                Dashboard Overview
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-card rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm">Total Listings</p>
                      <p className="text-2xl font-bold">{stats.totalListings}</p>
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
                      <p className="text-2xl font-bold">{stats.pendingListings}</p>
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
                      <p className="text-2xl font-bold">{stats.approvedListings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl shadow-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm">Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-2xl shadow-card p-6 mb-8">
                <h2 className="font-outfit text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setActiveTab("listings"); setFilter("pending"); }}
                    className="px-6 py-3 bg-warning text-white rounded-xl font-semibold"
                  >
                    Review Pending ({stats.pendingListings})
                  </button>
                  <button
                    onClick={() => setActiveTab("listings")}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold"
                  >
                    Manage All Listings
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-outfit text-lg font-semibold mb-4">Recent Listings</h2>
                <div className="space-y-4">
                  {listings.slice(0, 5).map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 bg-background rounded-xl">
                      <div className="flex items-center gap-4">
                        <img
                          src={listing.images?.[0] || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100"}
                          alt=""
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{listing.title}</p>
                          <p className="text-sm text-text-secondary">
                            ₱{listing.price?.toLocaleString()} • {listing.listingStatus}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        listing.listingStatus === "approved" ? "bg-success/10 text-success" :
                        listing.listingStatus === "pending" ? "bg-warning/10 text-warning" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {listing.listingStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "listings" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-outfit text-2xl font-bold text-text-primary">
                  Manage Listings
                </h1>
                <div className="flex gap-2">
                  {["all", "pending", "approved"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        filter === f
                          ? "bg-primary text-white"
                          : "bg-card text-text-secondary hover:bg-gray-100"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Vehicle</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Seller</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-background/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={listing.images?.[0] || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100"}
                                alt=""
                                className="w-16 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-medium">{listing.title}</p>
                                <p className="text-sm text-text-secondary">{listing.year}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            ₱{listing.priceType === "rent"
                              ? `${listing.price?.toLocaleString()}/day`
                              : listing.price?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm">{listing.seller?.name || "Unknown"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              listing.listingStatus === "approved" ? "bg-success/10 text-success" :
                              listing.listingStatus === "pending" ? "bg-warning/10 text-warning" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {listing.listingStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {listing.listingStatus === "pending" && (
                                <>
                                  <button
                                    onClick={() => approveListing(listing.id)}
                                    className="p-2 text-success hover:bg-success/10 rounded-lg"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => rejectListing(listing.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => deleteListing(listing.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Delete"
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
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h1 className="font-outfit text-2xl font-bold text-text-primary mb-6">
                User Management
              </h1>

              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Listings</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-background/50">
                          <td className="px-6 py-4">
                            <p className="font-medium">{user.name}</p>
                            {user.phone && (
                              <p className="text-sm text-text-secondary">{user.phone}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin" ? "bg-primary/10 text-primary" :
                              user.role === "seller" ? "bg-accent/10 text-accent" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">{user._count?.vehicles || 0}</td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tracking" && (
            <div>
              <h1 className="font-outfit text-2xl font-bold text-text-primary mb-6">
                Live Vehicle Tracking
              </h1>

              <div className="bg-card rounded-2xl shadow-card p-6">
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Live Tracking Coming Soon
                  </h3>
                  <p className="text-text-secondary">
                    Real-time vehicle location tracking will be available in the next update.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
