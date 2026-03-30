"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, MessageCircle, DollarSign, Car, TrendingUp, Users } from "lucide-react";

const mockListings = [
  { id: "1", make: "Toyota", model: "Camry", year: 2024, price: 2150000, priceType: "sale", status: "available", views: 245, inquiries: 12 },
  { id: "2", make: "Honda", model: "Civic", year: 2023, price: 3500, priceType: "rent", status: "available", views: 189, inquiries: 8 },
  { id: "3", make: "Tesla", model: "Model 3", year: 2024, price: 3850000, priceType: "installment", status: "sold", views: 512, inquiries: 25 },
];

const mockInquiries = [
  { id: "1", vehicle: "Toyota Camry", message: "Is this available for test drive?", status: "pending", date: "2024-01-15" },
  { id: "2", vehicle: "Honda Civic", message: "What's the lowest price?", status: "responded", date: "2024-01-14" },
  { id: "3", vehicle: "Tesla Model 3", message: "Can I get insurance included?", status: "pending", date: "2024-01-14" },
];

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries" | "add">("listings");
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = {
    totalListings: 3,
    activeListings: 2,
    totalViews: 946,
    totalInquiries: 45,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-outfit text-3xl md:text-4xl font-bold text-white mb-2">
                Seller Dashboard
              </h1>
              <p className="text-white/80">Manage your listings and inquiries</p>
            </div>
            <button
              onClick={() => setActiveTab("add")}
              className="flex items-center gap-2 bg-accent text-secondary px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" /> Add New Listing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Car, label: "Total Listings", value: stats.totalListings, color: "bg-primary" },
            { icon: TrendingUp, label: "Active Listings", value: stats.activeListings, color: "bg-success" },
            { icon: Eye, label: "Total Views", value: stats.totalViews, color: "bg-accent" },
            { icon: MessageCircle, label: "Inquiries", value: stats.totalInquiries, color: "bg-warning" },
          ].map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl shadow-card p-6">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-text-secondary text-sm">{stat.label}</p>
              <p className="font-outfit text-3xl font-bold text-text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === "listings" ? "bg-primary text-white" : "bg-card text-text-secondary"
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === "inquiries" ? "bg-primary text-white" : "bg-card text-text-secondary"
            }`}
          >
            Inquiries ({mockInquiries.length})
          </button>
        </div>

        {activeTab === "listings" && (
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Vehicle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-text-primary">{listing.make} {listing.model}</p>
                        <p className="text-sm text-text-secondary">{listing.year}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.priceType === "sale" ? "bg-success/10 text-success" :
                          listing.priceType === "rent" ? "bg-accent/10 text-accent" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {listing.priceType.charAt(0).toUpperCase() + listing.priceType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-primary">
                        ₱{listing.priceType === "rent" ? `${listing.price.toLocaleString()}/day` : listing.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.status === "available" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">{listing.views}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-text-secondary hover:text-warning hover:bg-warning/10 rounded-lg transition-colors">
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
        )}

        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {mockInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-card rounded-2xl shadow-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">{inquiry.vehicle}</h3>
                    <p className="text-text-secondary mt-1">{inquiry.message}</p>
                    <p className="text-sm text-text-secondary mt-2">{inquiry.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    inquiry.status === "pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    Reply
                  </button>
                  <button className="px-4 py-2 bg-background text-text-secondary rounded-lg text-sm hover:bg-primary/10 transition-colors">
                    View Vehicle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "add" && (
          <div className="bg-card rounded-2xl shadow-card p-8">
            <h2 className="font-outfit text-2xl font-bold text-text-primary mb-6">Add New Listing</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Make</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" placeholder="Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Model</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" placeholder="Camry" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Year</label>
                  <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Price</label>
                  <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" placeholder="28500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Listing Type</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary">
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="installment">Installment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Mileage</label>
                  <input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" placeholder="5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Transmission</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary">
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Fuel Type</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary">
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                <textarea className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" rows={4} placeholder="Describe your vehicle..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Image URL</label>
                <input type="url" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary" placeholder="https://..." />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Submit Listing
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
