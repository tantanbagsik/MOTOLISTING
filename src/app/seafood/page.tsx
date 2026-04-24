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

const categories: Category[] = [
  { id: "1", name: "Fresh Fish", slug: "fresh-fish", image: "https://images.unsplash.com/photo-1535400255456-1d41c3f8a552?w=400&h=300&fit=crop", itemCount: 45 },
  { id: "2", name: "Shellfish", slug: "shellfish", image: "https://images.unsplash.com/photo-1559742811-d61d5c768ce5?w=400&h=300&fit=crop", itemCount: 32 },
  { id: "3", name: "Frozen Seafood", slug: "frozen-seafood", image: "https://images.unsplash.com/photo-1553247407-23251b9c19e0?w=400&h=300&fit=crop", itemCount: 28 },
  { id: "4", name: "Canned & Preserved", slug: "canned-preserved", image: "https://images.unsplash.com/photo-1574717028049-d3251cd72299?w=400&h=300&fit=crop", itemCount: 56 },
];

const deals = [
  { id: 1, title: "Fresh Salmon", subtitle: "25% OFF", image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&h=400&fit=crop", discount: 25 },
  { id: 2, title: "Premium Lobsters", subtitle: "Buy 1 Get 1", image: "https://images.unsplash.com/photo-1553247407-23251b9c19e0?w=600&h=400&fit=crop", discount: 50 },
  { id: 3, title: "Tuna Special", subtitle: "20% OFF", image: "https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=600&h=400&fit=crop", discount: 20 },
];

const whyChooseUs = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ₱2,000" },
  { icon: Shield, title: "Fresh Quality", desc: "100% guaranteed fresh" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Clock, title: "Fast Delivery", desc: "Same-day delivery" },
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

  useEffect(() => {
    const savedCart = localStorage.getItem("seafood_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedUser = localStorage.getItem("seafood_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem("seafood_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(p => p.featured);
  const newArrivals = [...products].reverse().slice(0, 4);

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
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +63 123 456 7890</span>
            <span className="hidden md:flex items-center gap-1"><Mail className="w-4 h-4" /> support@seafoodmart.com</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-yellow-300"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-yellow-300"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-yellow-300"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-yellow-300"><Youtube className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/seafood" className="text-3xl font-bold text-[#1E3A8A] flex items-center gap-2">
              <span className="text-4xl">🐟</span>
              SeafoodMart
            </Link>

            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fresh seafood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-full px-5 py-3 pl-14 focus:border-[#1E3A8A] focus:outline-none transition-colors"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1E3A8A] text-white px-6 py-2 rounded-full hover:bg-[#1E3A8A]/90 transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{user.name}</span>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 text-gray-700 hover:text-[#1E3A8A]">
                  <User className="w-6 h-6" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
              
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-full md:hidden">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 py-4 border-t border-gray-100 mt-4">
            <Link href="/seafood" className="text-[#1E3A8A] font-semibold">Home</Link>
            <Link href="/seafood?category=fresh-fish" className="text-gray-600 hover:text-[#1E3A8A] font-medium">Fresh Fish</Link>
            <Link href="/seafood?category=shellfish" className="text-gray-600 hover:text-[#1E3A8A] font-medium">Shellfish</Link>
            <Link href="/seafood?category=frozen-seafood" className="text-gray-600 hover:text-[#1E3A8A] font-medium">Frozen</Link>
            <Link href="/seafood?category=canned-preserved" className="text-gray-600 hover:text-[#1E3A8A] font-medium">Canned</Link>
            <Link href="/seafood-admin" className="text-gray-600 hover:text-[#1E3A8A] font-medium">Admin</Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 p-4 bg-white">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <nav className="flex flex-col gap-2">
              {["Fresh Fish", "Shellfish", "Frozen Seafood", "Canned & Preserved"].map((item) => (
                <Link key={item} href={`/seafood?category=${item.toLowerCase().replace(/[^a-z0-9]/g, "-")}`} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">
                🔥 FRESH FROM THE OCEAN
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Premium <span className="text-yellow-400">Seafood</span> <br/>Delivered Fresh
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Discover the finest selection of fresh fish, prawns, crabs, and lobsters. 
                Direct from the ocean to your table.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                  View Catalog
                </button>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-yellow-400" /> Free Shipping</div>
                <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-yellow-400" /> Fresh Guarantee</div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative z-10">
                <img src="https://images.unsplash.com/photo-1559742811-d61d5c768ce5?w=600&h=500&fit=crop" alt="Fresh Seafood" className="rounded-2xl shadow-2xl" />
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-4 rounded-xl shadow-lg">
                  <p className="font-bold text-2xl">50+</p>
                  <p className="text-sm text-gray-500">Fresh Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Shop by Category</h2>
          <p className="text-gray-500 text-center mb-12">Browse our wide selection of fresh seafood</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/seafood?category=${cat.slug}`} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{cat.name}</h3>
                    <p className="text-sm text-gray-300">{cat.itemCount} items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked fresh seafood for you</p>
            </div>
            <Link href="/seafood" className="text-[#1E3A8A] font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative">
                  <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setShowProductModal(product)} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                    <span className="text-xs text-gray-400 ml-1">(5.0)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#1E3A8A]">₱{product.price.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm">/{product.unit}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 bg-[#1E3A8A] text-white py-2 rounded-lg font-medium hover:bg-[#1E3A8A]/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="py-16 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Hot Deals 🔥</h2>
          <p className="text-white/80 text-center mb-12">Limited time offers on premium seafood</p>
          <div className="grid md:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <div key={deal.id} className="relative rounded-2xl overflow-hidden group">
                <img src={deal.image} alt={deal.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">{deal.subtitle}</span>
                  <h3 className="text-2xl font-bold mt-2">{deal.title}</h3>
                  <button className="mt-3 bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">{selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : "All Products"}</h2>
              <p className="text-gray-500 mt-1">{filteredProducts.length} products available</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-[#1E3A8A] text-white" : "bg-gray-100 text-gray-600"}`}>
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-[#1E3A8A] text-white" : "bg-gray-100 text-gray-600"}`}>
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full font-medium ${!selectedCategory ? "bg-[#1E3A8A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={`px-4 py-2 rounded-full font-medium ${selectedCategory === cat.slug ? "bg-[#1E3A8A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {cat.name}
              </button>
            ))}
          </div>

          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${viewMode === "list" ? "flex" : ""}`}>
                <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                  <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      SALE
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1">
                  <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#1E3A8A]">₱{product.price.toLocaleString()}</span>
                      {product.comparePrice && <span className="text-sm text-gray-400 line-through ml-2">₱{product.comparePrice.toLocaleString()}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
                  <button onClick={() => addToCart(product)} disabled={product.stock === 0} className="w-full mt-3 bg-[#1E3A8A] text-white py-2 rounded-lg font-medium hover:bg-[#1E3A8A]/90 disabled:opacity-50">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-md text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">🐟</span> SeafoodMart
              </h3>
              <p className="text-gray-400 mb-4">Your trusted source for fresh, premium seafood delivered to your doorstep.</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/seafood" className="hover:text-white">About Us</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Shop</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Contact</Link></li>
                <li><Link href="/seafood-admin" className="hover:text-white">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/seafood" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Shipping Info</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Returns</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2"><MapPin className="w-5 h-5 text-yellow-400" /> Manila, Philippines</li>
                <li className="flex items-center gap-2"><Phone className="w-5 h-5 text-yellow-400" /> +63 123 456 7890</li>
                <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-yellow-400" /> support@seafoodmart.com</li>
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
                <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ShoppingCart className="w-20 h-20 text-gray-200 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-[#1E3A8A] hover:underline">Continue Shopping</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={`${item.product.id}-${item.variation}-${idx}`} className="flex gap-4 pb-4 border-b border-gray-100 mb-4">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-gray-500 text-sm">{item.variation || item.product.unit}</p>
                          <p className="text-[#1E3A8A] font-bold mt-1">₱{item.product.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.product.id, -1, item.variation)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">-</button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1, item.variation)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">+</button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id, item.variation)}><Trash2 className="w-5 h-5 text-red-400" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2"><span>Subtotal</span><span>₱{cartTotal.toLocaleString()}</span></div>
                    <div className="flex justify-between mb-2"><span>Shipping</span><span>{shippingFee === 0 ? "FREE" : `₱${shippingFee}`}</span></div>
                    <div className="flex justify-between font-bold text-lg mb-4"><span>Total</span><span className="text-[#1E3A8A]">₱{grandTotal.toLocaleString()}</span></div>
                    <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-bold hover:bg-[#1E3A8A]/90">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
                  <div className="space-y-2 mb-6 max-h-40 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                        <span className="font-medium">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2"><span>Total</span><span className="font-bold">₱{grandTotal.toLocaleString()}</span></div>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-bold mt-6">Continue to Shipping</button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div>
                  <h4 className="font-semibold mb-4">Shipping Information</h4>
                  <div className="space-y-4">
                    <input type="text" placeholder="Full Name" value={shippingInfo.name} onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    <input type="tel" placeholder="Phone" value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    <input type="text" placeholder="Address" value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                    <input type="text" placeholder="City" value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  </div>
                  <button onClick={handleCheckout} disabled={!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address} className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-bold mt-6 disabled:opacity-50">
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
                <input type="text" placeholder="Full Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              )}
              <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
              <input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
              <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-bold disabled:opacity-50">
                {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              {authMode === "login" ? (
                <>Don&apos;t have an account? <button onClick={() => setAuthMode("register")} className="text-[#1E3A8A] font-bold">Sign Up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode("login")} className="text-[#1E3A8A] font-bold">Sign In</button></>
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
              <img src={showProductModal.images[0]} alt={showProductModal.name} className="w-full h-64 object-cover rounded-xl" />
              <div>
                <button onClick={() => setShowProductModal(null)} className="absolute top-4 right-4"><X className="w-6 h-6" /></button>
                <p className="text-sm text-gray-500 mb-1">{showProductModal.category.name}</p>
                <h3 className="text-2xl font-bold mb-2">{showProductModal.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                  <span className="text-sm text-gray-500">(5.0)</span>
                </div>
                <p className="text-gray-600 mb-4">{showProductModal.description}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#1E3A8A]">₱{showProductModal.price.toLocaleString()}</span>
                  <span className="text-gray-400">/{showProductModal.unit}</span>
                  {showProductModal.comparePrice && (
                    <span className="text-lg text-gray-400 line-through">₱{showProductModal.comparePrice.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">Vendor: {showProductModal.vendor.name}</p>
                <p className="text-sm text-gray-500 mb-4">{showProductModal.stock > 0 ? `${showProductModal.stock} in stock` : "Out of stock"}</p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Select Size:</label>
                  <div className="flex gap-2">
                    {["500g", "1kg", "2kg"].map((v) => (
                      <button key={v} onClick={() => setSelectedVariation(v)} className={`px-4 py-2 rounded-lg border ${selectedVariation === v ? "border-[#1E3A8A] bg-[#1E3A8A] text-white" : "border-gray-300"}`}>{v}</button>
                    ))}
                  </div>
                </div>
                
                <button onClick={() => { addToCart(showProductModal, selectedVariation); setShowProductModal(null); }} disabled={showProductModal.stock === 0} className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-bold hover:bg-[#1E3A8A]/90 disabled:opacity-50">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeafoodPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div></div>}>
      <SeafoodContent />
    </Suspense>
  );
}