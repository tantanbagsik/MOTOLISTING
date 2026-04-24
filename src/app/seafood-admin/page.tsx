"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Star, 
  BarChart3, Settings, LogOut, Menu, TrendingUp, 
  DollarSign, ShoppingBag, CheckCircle, XCircle, Clock,
  Plus, Search, Edit, Trash2, Eye, X, Image, Save, Lock
} from "lucide-react";

const ADMINCredentials = {
  email: "admin@raypanganiban.tech",
  password: "password123"
};

const stats = [
  { label: "Total Sales", value: "₱125,400", change: "+12%", icon: DollarSign },
  { label: "Orders", value: "156", change: "+8%", icon: ShoppingBag },
  { label: "Products", value: "48", change: "+3%", icon: Package },
  { label: "Customers", value: "89", change: "+15%", icon: Users },
];

const recentOrders = [
  { id: "ORD-001", customer: "Juan Dela Cruz", items: "2 items", total: 4500, status: "pending", date: "2024-01-15" },
  { id: "ORD-002", customer: "Maria Santos", items: "1 item", total: 3200, status: "confirmed", date: "2024-01-14" },
  { id: "ORD-003", customer: "Pedro Reyes", items: "3 items", total: 6800, status: "delivered", date: "2024-01-14" },
  { id: "ORD-004", customer: "Ana Garcia", items: "1 item", total: 1800, status: "pending", date: "2024-01-13" },
];

const products = [
  { id: "1", name: "Fresh Atlantic Salmon", category: "Fresh Fish", price: 450, stock: 50, status: "active", featured: true, variations: ["500g", "1kg", "2kg"] },
  { id: "2", name: "Tiger Prawns Large", category: "Shellfish", price: 680, stock: 30, status: "active", featured: true, variations: ["500g", "1kg"] },
  { id: "3", name: "Blue Swimming Crab", category: "Shellfish", price: 350, stock: 0, status: "active", featured: false, variations: ["1pc", "2pc", "5pc"] },
  { id: "4", name: "Fresh Tuna Steak", category: "Fresh Fish", price: 520, stock: 20, status: "inactive", featured: true, variations: ["500g", "1kg"] },
];

const reviews = [
  { id: "1", product: "Fresh Atlantic Salmon", user: "Carlos M.", rating: 5, title: "Super fresh!", content: "Super fresh! Best salmon I've bought. Will order again.", status: "approved", date: "2024-01-14" },
  { id: "2", product: "Tiger Prawns Large", user: "Jenny L.", rating: 4, title: "Good quality", content: "Good quality, fast delivery. Recommended!", status: "pending", date: "2024-01-13" },
  { id: "3", product: "Fresh Grouper", user: "Mark T.", rating: 5, title: "Perfect for sinigang", content: "Perfect for sinigang! Very fresh.", status: "approved", date: "2024-01-12" },
];

export default function SeafoodAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState(products);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const savedAuth = localStorage.getItem("seafood_admin_auth");
    if (savedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === ADMINCredentials.email && loginForm.password === ADMINCredentials.password) {
      setIsAuthenticated(true);
      localStorage.setItem("seafood_admin_auth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("seafood_admin_auth");
    setLoginForm({ email: "", password: "" });
  };

  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "customers", label: "Customers", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter(p => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setProductsList(productsList.map(p => 
      p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
    ));
  };

  const handleToggleFeatured = (id: string) => {
    setProductsList(productsList.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 mt-2">SeafoodMart Administration</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="admin@raypanganiban.tech"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="••••••••"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#1E3A8A]/90"
            >
              Sign In
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/seafood" className="text-sm text-[#1E3A8A] hover:underline">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1E3A8A] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <div className="p-6">
          <Link href="/seafood" className="text-xl font-bold flex items-center gap-2 mb-8">
            <span className="text-2xl">🐟</span>
            SeafoodMart
          </Link>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? "bg-white/20" 
                    : "hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {tab.id === "orders" && (
                  <span className="ml-auto bg-yellow-500 text-xs px-2 py-0.5 rounded-full text-black">3</span>
                )}
                {tab.id === "reviews" && (
                  <span className="ml-auto bg-yellow-500 text-xs px-2 py-0.5 rounded-full text-black">1</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg w-full">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">SeafoodMart Admin</span>
              <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-[#1E3A8A]" />
                      </div>
                    </div>
                    <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change} from last month
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} className="text-sm text-[#1E3A8A] hover:underline">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Order</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Customer</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Items</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Total</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3 font-medium">{order.id}</td>
                          <td className="py-3">{order.customer}</td>
                          <td className="py-3 text-gray-500">{order.items}</td>
                          <td className="py-3 font-medium">₱{order.total.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "delivered" ? "bg-green-100 text-green-700" :
                              order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-gray-500">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1E3A8A]/90"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Base Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Variations</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Featured</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{product.name}</td>
                        <td className="py-3 px-4 text-gray-500">{product.category}</td>
                        <td className="py-3 px-4">₱{product.price}</td>
                        <td className="py-3 px-4">
                          <span className={product.stock === 0 ? "text-red-500 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {product.variations.map((v: string) => (
                              <span key={v} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{v}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(product.id)}
                            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                              product.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {product.status}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleToggleFeatured(product.id)}>
                            {product.featured ? (
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            ) : (
                              <Star className="w-5 h-5 text-gray-300" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingProduct(product)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
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

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 flex-wrap">
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                <input type="date" className="border border-gray-300 rounded-lg px-4 py-2" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Items</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4 text-gray-500">{order.items}</td>
                        <td className="py-3 px-4 font-medium">₱{order.total.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "delivered" ? "bg-green-100 text-green-700" :
                            order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{order.date}</td>
                        <td className="py-3 px-4">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.product}</span>
                        <span className="text-gray-400 text-sm">by {review.user}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                      <h4 className="font-medium text-gray-900">{review.title}</h4>
                      <p className="text-gray-600 mt-1">{review.content}</p>
                      <p className="text-gray-400 text-sm mt-2">{review.date}</p>
                    </div>
                    <div className="flex gap-2">
                      {review.status === "pending" && (
                        <>
                          <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {review.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Orders</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Spent</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-3 px-4 font-medium">Juan Dela Cruz</td>
                    <td className="py-3 px-4 text-gray-500">juan@example.com</td>
                    <td className="py-3 px-4">5</td>
                    <td className="py-3 px-4">₱15,400</td>
                    <td className="py-3 px-4 text-gray-500">2024-01-01</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 font-medium">Maria Santos</td>
                    <td className="py-3 px-4 text-gray-500">maria@example.com</td>
                    <td className="py-3 px-4">3</td>
                    <td className="py-3 px-4">₱8,500</td>
                    <td className="py-3 px-4 text-gray-500">2024-01-05</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Sales Overview</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Sales chart will appear here</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Top Products</h3>
                <div className="space-y-3">
                  {productsList.slice(0, 4).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">{i + 1}</span>
                      <span className="flex-1">{p.name}</span>
                      <span className="font-medium">₱{(p.price * 15).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
              <h3 className="font-semibold mb-6">Store Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Store Name</label>
                  <input type="text" defaultValue="SeafoodMart" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" defaultValue="support@seafoodmart.com" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" defaultValue="+63 123 456 7890" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Fee (₱)</label>
                  <input type="number" defaultValue="150" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Free Shipping Minimum (₱)</label>
                  <input type="number" defaultValue="2000" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                </div>
                <button className="bg-[#1E3A8A] text-white px-6 py-2 rounded-lg hover:bg-[#1E3A8A]/90">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Add/Edit Product Modal */}
      {(showAddProduct || editingProduct) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input 
                    type="text" 
                    defaultValue={editingProduct?.name || ""}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2" 
                    placeholder="Fresh Atlantic Salmon"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                      <option>Fresh Fish</option>
                      <option>Shellfish</option>
                      <option>Frozen Seafood</option>
                      <option>Canned & Preserved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Base Price (₱)</label>
                    <input 
                      type="number" 
                      defaultValue={editingProduct?.price || ""}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2" 
                      placeholder="450"
                    />
                  </div>
                </div>

                {/* Product Variations */}
                <div>
                  <label className="block text-sm font-medium mb-2">Product Variations (each variation can have different price)</label>
                  <div className="space-y-2">
                    {["500g", "1kg", "2kg"].map((variation, i) => (
                      <div key={variation} className="flex gap-2">
                        <input 
                          type="text" 
                          defaultValue={variation}
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2" 
                          placeholder="Variation name"
                        />
                        <input 
                          type="number" 
                          defaultValue={editingProduct?.price ? editingProduct.price * (i + 1) * 0.5 : ""}
                          className="w-32 border border-gray-300 rounded-lg px-4 py-2" 
                          placeholder="Price"
                        />
                        <input 
                          type="number" 
                          defaultValue={editingProduct?.stock || ""}
                          className="w-24 border border-gray-300 rounded-lg px-4 py-2" 
                          placeholder="Stock"
                        />
                      </div>
                    ))}
                  </div>
                  <button className="text-sm text-[#1E3A8A] mt-2 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Variation
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      defaultValue={editingProduct?.stock || ""}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2" 
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum Order</label>
                    <input 
                      type="number" 
                      defaultValue="1"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2" 
                    rows={3}
                    placeholder="Product description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Product Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Drop images here or click to upload</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => { setShowAddProduct(false); setEditingProduct(null); }}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-[#1E3A8A] text-white py-2 rounded-lg hover:bg-[#1E3A8A]/90 flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}