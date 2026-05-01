"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight,
  Star, Trash2, ArrowRight, Heart, Eye, Truck, Shield, Clock,
  CreditCard, Gift, RefreshCw, Phone, Mail, MapPin, Facebook,
  Instagram, Twitter, Youtube, Filter, Grid3X3, List
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  unit: string;
  images: string[];
  stock: number;
  minOrder: number;
  featured: boolean;
  category: { name: string; slug: string };
  vendor: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

const products: Product[] = [
  { id: "1", name: "Fresh Atlantic Salmon", slug: "fresh-atlantic-salmon", description: "Premium quality Atlantic salmon, rich in omega-3", price: 450, comparePrice: 520, unit: "kg", images: ["https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&h=400&fit=crop"], stock: 50, minOrder: 1, featured: true, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Ocean Fresh Market" } },
  { id: "2", name: "Tiger Prawns Large", slug: "tiger-prawns-large", description: "Large tiger prawns, perfect for grilling", price: 680, comparePrice: 750, unit: "kg", images: ["https://images.unsplash.com/photo-1565680018434-b55ea4dd0b70?w=600&h=400&fit=crop"], stock: 30, minOrder: 1, featured: true, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Seafood Direct" } },
  { id: "3", name: "Blue Swimming Crab", slug: "blue-swimming-crab", description: "Fresh blue swimming crabs, meaty and sweet", price: 350, comparePrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&h=400&fit=crop"], stock: 25, minOrder: 1, featured: true, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Coastal Catch" } },
  { id: "4", name: "Fresh Tuna Steak", slug: "fresh-tuna-steak", description: "Fresh yellowfin tuna steaks", price: 520, comparePrice: 650, unit: "kg", images: ["https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=600&h=400&fit=crop"], stock: 20, minOrder: 1, featured: true, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Ocean Fresh Market" } },
  { id: "5", name: "Jumbo Lobster", slug: "jumbo-lobster", description: "Premium jumbo lobsters from cold waters", price: 1200, comparePrice: 1350, unit: "kg", images: ["https://images.unsplash.com/photo-1553247407-23251b9c19e0?w=600&h=400&fit=crop"], stock: 10, minOrder: 1, featured: true, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Premium Seafoods" } },
  { id: "6", name: "Fresh Grouper", slug: "fresh-grouper", description: "Fresh grouper fish, excellent for sinigang", price: 480, comparePrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop"], stock: 15, minOrder: 1, featured: false, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Coastal Catch" } },
  { id: "7", name: "Giant Squid", slug: "giant-squid", description: "Fresh giant squid, perfect for calamari", price: 280, comparePrice: 350, unit: "kg", images: ["https://images.unsplash.com/photo-1559742811-d61d5c768ce5?w=600&h=400&fit=crop"], stock: 40, minOrder: 1, featured: false, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Seafood Direct" } },
  { id: "8", name: "Fresh Red Snapper", slug: "fresh-red-snapper", description: "Premium red snapper, ideal for steam boat", price: 420, comparePrice: 480, unit: "kg", images: ["https://images.unsplash.com/photo-1535400255456-1d41c3f8a552?w=600&h=400&fit=crop"], stock: 18, minOrder: 1, featured: true, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Ocean Fresh Market" } },
  { id: "9", name: "Green Mussels", slug: "green-mussels", description: "Fresh green mussels from Ilocos", price: 180, comparePrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1598511797334-455af26ecf89?w=600&h=400&fit=crop"], stock: 60, minOrder: 1, featured: false, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Coastal Catch" } },
  { id: "10", name: "Fresh Milkfish (Bangus)", slug: "fresh-milkfish-bangus", description: "Local fresh milkfish from Dagupan", price: 220, comparePrice: 260, unit: "kg", images: ["https://images.unsplash.com/photo-1623664507298-09d5f2a72da2?w=600&h=400&fit=crop"], stock: 35, minOrder: 1, featured: true, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Local Fisherfolk" } },
  { id: "11", name: "Shrimp Paste (Bagoong)", slug: "shrimp-paste-bagoong", description: "Traditional fermented shrimp paste", price: 85, comparePrice: null, unit: "500g", images: ["https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=600&h=400&fit=crop"], stock: 100, minOrder: 1, featured: false, category: { name: "Canned & Preserved", slug: "canned-preserved" }, vendor: { name: "Traditional Foods" } },
  { id: "12", name: "Canned Tuna in Oil", slug: "canned-tuna-in-oil", description: "Premium chunk tuna in vegetable oil", price: 65, comparePrice: 75, unit: "can", images: ["https://images.unsplash.com/photo-1574717028049-d3251cd72299?w=600&h=400&fit=crop"], stock: 200, minOrder: 1, featured: false, category: { name: "Canned & Preserved", slug: "canned-preserved" }, vendor: { name: "Ocean Premium" } },
];

// Filter out products without images
const productsWithImages = products.filter(p => p.images && p.images.length > 0);

const categories: Category[] = [
  { id: "1", name: "Fresh Fish", slug: "fresh-fish", image: "https://images.unsplash.com/photo-1535400255456-1d41c3f8a552?w=400&h=300&fit=crop", itemCount: 45 },
  { id: "2", name: "Shellfish", slug: "shellfish", image: "https://images.unsplash.com/photo-1559742811-d61d5c768ce5?w=400&h=300&fit=crop", itemCount: 32 },
  { id: "3", name: "Frozen Seafood", slug: "frozen-seafood", image: "https://images.unsplash.com/photo-1553247407-23251b9c19e0?w=400&h=300&fit=crop", itemCount: 28 },
  { id: "4", name: "Canned & Preserved", slug: "canned-preserved", image: "https://images.unsplash.com/photo-1574717028049-d3251cd72299?w=400&h=300&fit=crop", itemCount: 56 },
];

interface CartItem {
  product: Product;
  quantity: number;
  variation?: string;
}

function SeafoodContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showProductModal, setShowProductModal] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState("1kg");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", email: "", address: "" });

  useEffect(() => {
    const savedCart = localStorage.getItem("seafood_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedUser = localStorage.getItem("seafood_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setProfileForm({
        name: parsedUser.name || "",
        phone: parsedUser.phone || "",
        email: parsedUser.email || "",
        address: parsedUser.address || ""
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("seafood_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = productsWithImages.filter(product => {
    const matchesSearch = searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = productsWithImages.filter(p => p.featured);

  const addToCart = (product: Product, variation?: string) => {
    const existing = cart.find(item => item.product.id === product.id && item.variation === variation);
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id && item.variation === variation
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, variation }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variation?: string) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.variation === variation)));
  };

  const updateQuantity = (productId: string, delta: number, variation?: string) => {
    setCart(cart.map(item => {
      if (item.product.id === productId && item.variation === variation) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = cartTotal > 2000 ? 0 : 150;
  const grandTotal = cartTotal + shippingFee;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newUser = { id: "user_" + Date.now(), name: authForm.name || authForm.email.split("@")[0], email: authForm.email };
      setUser(newUser);
      localStorage.setItem("seafood_user", JSON.stringify(newUser));
      setShowAuth(false);
      setLoading(false);
    }, 1000);
  };

  const handleCheckout = async () => {
    if (!user && checkoutStep === 1) { setShowAuth(true); return; }
    if (checkoutStep === 1) { setCheckoutStep(2); }
    else if (checkoutStep === 2) {
      setLoading(true);
      setTimeout(() => {
        alert(`Order placed! Total: ₱${grandTotal.toLocaleString()}`);
        setCart([]);
        setCheckoutStep(1);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/seafood" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🐟</span>
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">Seafood</span>
                <span className="font-bold text-xl text-blue-600">Mart</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search fresh seafood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setShowUserDropdown(false); setIsCartOpen(true); }}
                          className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          My Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                        </button>
                        <button className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4" />
                          Order History
                        </button>
                        <button
                          onClick={() => { setShowUserDropdown(false); setShowProfileModal(true); }}
                          className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </button>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => { setUser(null); setShowUserDropdown(false); localStorage.removeItem("seafood_user"); }}
                          className="w-full px-4 py-2.5 text-left text-red-500 hover:bg-red-50 flex items-center gap-3 text-sm"
                        >
                          <X className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Sign In</span>
                </button>
              )}

              <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-xl md:hidden">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 pb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="p-4 space-y-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5"
              />
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Fresh from the Ocean</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Premium <span className="text-blue-300">Seafood</span>
                <br />Delivered Fresh
              </h1>

              <p className="text-lg text-blue-100 mb-8 max-w-lg leading-relaxed">
                Discover the finest selection of fresh fish, prawns, crabs, and lobsters.
                Direct from the ocean to your table.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-900 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur">
                  View Catalog
                </button>
              </div>

              <div className="flex items-center gap-6 mt-10">
                {[
                  { icon: Truck, text: "Free Shipping" },
                  { icon: Shield, text: "100% Fresh" },
                  { icon: Clock, text: "Same Day Delivery" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-blue-300" />
                    <span className="text-sm text-blue-100">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1559742811-d61d5c768ce5?w=600&h=500&fit=crop"
                  alt="Fresh Seafood"
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-5 rounded-2xl shadow-xl">
                  <p className="font-bold text-3xl text-blue-600">50+</p>
                  <p className="text-sm text-gray-500">Fresh Products</p>
                </div>
                <div className="absolute -top-6 -right-6 bg-blue-600 text-white p-4 rounded-2xl shadow-xl">
                  <p className="text-xs font-medium text-blue-100">Starting from</p>
                  <p className="text-2xl font-bold">₱180/kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked fresh seafood for you</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {featuredProducts.map((product) => (
              <div key={product.id} className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
                <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${viewMode === "list" ? "h-full" : "h-48"}`}
                  />
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setShowProductModal(product)} className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-md hover:bg-white transition-colors">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-md hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">(5.0)</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-bold text-blue-600">₱{product.price.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm">/{product.unit}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : "All Products"}
              </h2>
              <p className="text-gray-500 mt-1">{filteredProducts.length} products available</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                      SALE
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-blue-600">₱{product.price.toLocaleString()}</span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-400 line-through">₱{product.comparePrice.toLocaleString()}</span>
                    )}
                    <span className="text-gray-400 text-sm">/{product.unit}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🐟</span>
                </div>
                <div>
                  <span className="font-bold text-xl text-white">Seafood</span>
                  <span className="font-bold text-xl text-blue-400">Mart</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6">Your trusted source for fresh, premium seafood delivered to your doorstep.</p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Quick Links", links: ["About Us", "Shop", "Contact", "Admin"] },
              { title: "Customer Service", links: ["Help Center", "Shipping Info", "Returns", "Track Order"] }
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href="/seafood" className="text-gray-400 hover:text-white transition-colors text-sm">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" /> Manila, Philippines</li>
                <li className="flex items-center gap-2"><Phone className="w-5 h-5 text-blue-400" /> +63 123 456 7890</li>
                <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> support@seafoodmart.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 SeafoodMart. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Shopping Cart ({cart.length})</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-6 h-6" /></button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ShoppingCart className="w-20 h-20 text-gray-200 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-blue-600 hover:underline font-medium">Continue Shopping</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={`${item.product.id}-${item.variation}-${idx}`} className="flex gap-4 pb-4 border-b border-gray-100 mb-4">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-gray-500 text-sm">{item.variation || item.product.unit}</p>
                          <p className="text-blue-600 font-bold mt-1">₱{item.product.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.product.id, -1, item.variation)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1, item.variation)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id, item.variation)}><Trash2 className="w-5 h-5 text-red-400" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between"><span>Subtotal</span><span>₱{cartTotal.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : `₱${shippingFee}`}</span></div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span className="text-blue-600">₱{grandTotal.toLocaleString()}</span></div>
                    </div>
                    <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4 shadow-sm">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* [Rest of modals remain the same - Checkout, Auth, Profile, Product Quick View] */}
      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsCheckoutOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Checkout</h3>
                <button onClick={() => setIsCheckoutOpen(false)}><X className="w-6 h-6" /></button>
              </div>

              {checkoutStep === 1 && (
                <div>
                  <h4 className="font-semibold mb-4">Order Summary</h4>
                  <div className="space-y-3 mb-6 max-h-40 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                        <span className="font-medium">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span className="text-blue-600">₱{grandTotal.toLocaleString()}</span></div>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">Continue to Shipping</button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div>
                  <h4 className="font-semibold mb-4">Shipping Information</h4>
                  <div className="space-y-4">
                    {[
                      { type: "text", placeholder: "Full Name", value: shippingInfo.name, field: "name" },
                      { type: "tel", placeholder: "Phone", value: shippingInfo.phone, field: "phone" },
                      { type: "text", placeholder: "Address", value: shippingInfo.address, field: "address" },
                      { type: "text", placeholder: "City", value: shippingInfo.city, field: "city" },
                    ].map((input, i) => (
                      <input
                        key={i}
                        type={input.type}
                        placeholder={input.placeholder}
                        value={input.value}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, [input.field]: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50 shadow-sm"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAuth(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{authMode === "login" ? "Sign In" : "Create Account"}</h3>
              <button onClick={() => setShowAuth(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "register" && (
                <input type="text" placeholder="Full Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
              )}
              <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" required />
              <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" required />
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm">
                {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              {authMode === "login" ? (
                <>Don&apos;t have an account? <button onClick={() => setAuthMode("register")} className="text-blue-600 font-bold hover:underline">Sign Up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode("login")} className="text-blue-600 font-bold hover:underline">Sign In</button></>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Product Quick View Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowProductModal(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <img src={showProductModal.images[0]} alt={showProductModal.name} className="w-full h-64 md:h-full object-cover rounded-xl" />
              <div>
                <button onClick={() => setShowProductModal(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl"><X className="w-6 h-6" /></button>
                <p className="text-sm text-gray-500 mb-1">{showProductModal.category.name}</p>
                <h3 className="text-2xl font-bold mb-2">{showProductModal.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                  <span className="text-sm text-gray-500">(5.0)</span>
                </div>
                <p className="text-gray-600 mb-4">{showProductModal.description}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-blue-600">₱{showProductModal.price.toLocaleString()}</span>
                  <span className="text-gray-400">/{showProductModal.unit}</span>
                  {showProductModal.comparePrice && (
                    <span className="text-lg text-gray-400 line-through">₱{showProductModal.comparePrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Size:</label>
                  <div className="flex gap-2">
                    {["500g", "1kg", "2kg"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariation(v)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedVariation === v ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-300 hover:border-gray-400"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => { addToCart(showProductModal, selectedVariation); setShowProductModal(null); }}
                  disabled={showProductModal.stock === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">My Profile</h3>
                <button onClick={() => setShowProfileModal(false)}><X className="w-6 h-6" /></button>
              </div>
              <form className="space-y-4">
                {[
                  { label: "Full Name", type: "text", value: profileForm.name, field: "name" },
                  { label: "Email", type: "email", value: profileForm.email, field: "email" },
                  { label: "Phone Number", type: "tel", value: profileForm.phone, field: "phone" },
                  { label: "Address", type: "text", value: profileForm.address, field: "address" },
                ].map((input, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{input.label}</label>
                    <input
                      type={input.type}
                      value={input.value}
                      onChange={(e) => setProfileForm({ ...profileForm, [input.field]: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updatedUser = { ...user, ...profileForm };
                    setUser(updatedUser);
                    localStorage.setItem("seafood_user", JSON.stringify(updatedUser));
                    setShowProfileModal(false);
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeafoodPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <SeafoodContent />
    </Suspense>
  );
}
