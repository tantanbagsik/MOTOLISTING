"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight, Star, Trash2, ArrowRight } from "lucide-react";

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
  image: string | null;
  children: { id: string; name: string; slug: string }[];
}

const defaultProducts: Product[] = [
  { id: "1", name: "Fresh Atlantic Salmon", slug: "fresh-atlantic-salmon", description: "Premium quality Atlantic salmon, rich in omega-3", price: 450, comparePrice: 520, unit: "kg", images: ["https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop"], stock: 50, minOrder: 1, featured: true, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Ocean Fresh Market" } },
  { id: "2", name: "Tiger Prawns Large", slug: "tiger-prawns-large", description: "Large tiger prawns, perfect for grilling", price: 680, comparePrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1565680018434-b55ea4dd0b70?w=400&h=300&fit=crop"], stock: 30, minOrder: 1, featured: true, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Seafood Direct" } },
  { id: "3", name: "Blue Swimming Crab", slug: "blue-swimming-crab", description: "Fresh blue swimming crabs, meaty and sweet", price: 350, comparePrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=400&h=300&fit=crop"], stock: 25, minOrder: 1, featured: false, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Coastal Catch" } },
  { id: "4", name: "Fresh Tuna Steak", slug: "fresh-tuna-steak", description: "Fresh yellowfin tuna steaks", price: 520, comparePrice: 650, unit: "kg", images: ["https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=400&h=300&fit=crop"], stock: 20, minOrder: 1, featured: true, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Ocean Fresh Market" } },
  { id: "5", name: "Jumbo Lobster", slug: "jumbo-lobster", description: "Premium jumbo lobsters from cold waters", price: 1200, comparePrice: 1350, unit: "kg", images: ["https://images.unsplash.com/photo-1553247407-23251b9c19e0?w=400&h=300&fit=crop"], stock: 10, minOrder: 1, featured: true, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Premium Seafoods" } },
  { id: "6", name: "Fresh Grouper", slug: "fresh-grouper", description: "Fresh grouper fish, excellent for sinigang", price: 480, comparePrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop"], stock: 15, minOrder: 1, featured: false, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Coastal Catch" } },
  { id: "7", name: "Giant Squid", slug: "giant-squid", description: "Fresh giant squid, perfect for calamari", price: 280, comparePrice: 350, unit: "kg", images: ["https://images.unsplash.com/photo-1559742811-d61d5c768ce5?w=400&h=300&fit=crop"], stock: 40, minOrder: 1, featured: false, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Seafood Direct" } },
  { id: "8", name: "Fresh Red Snapper", slug: "fresh-red-snapper", description: "Premium red snapper, ideal for steam boat", price: 420, comparePrice: 480, unit: "kg", images: ["https://images.unsplash.com/photo-1535400255456-1d41c3f8a552?w=400&h=300&fit=crop"], stock: 18, minOrder: 1, featured: true, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Ocean Fresh Market" } },
  { id: "9", name: "Green Mussels", slug: "green-mussels", description: "Fresh green mussels from Ilocos", price: 180, comparePrice: null, unit: "kg", images: ["https://images.unsplash.com/photo-1598511797334-455af26ecf89?w=400&h=300&fit=crop"], stock: 60, minOrder: 1, featured: false, category: { name: "Shellfish", slug: "shellfish" }, vendor: { name: "Coastal Catch" } },
  { id: "10", name: "Fresh Milkfish (Bangus)", slug: "fresh-milkfish-bangus", description: "Local fresh milkfish from Dagupan", price: 220, comparePrice: 260, unit: "kg", images: ["https://images.unsplash.com/photo-1623664507298-09d5f2a72da2?w=400&h=300&fit=crop"], stock: 35, minOrder: 1, featured: false, category: { name: "Fresh Fish", slug: "fresh-fish" }, vendor: { name: "Local Fisherfolk" } },
  { id: "11", name: "Shrimp Paste (Bagoong)", slug: "shrimp-paste-bagoong", description: "Traditional fermented shrimp paste", price: 85, comparePrice: null, unit: "500g", images: ["https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop"], stock: 100, minOrder: 1, featured: false, category: { name: "Canned & Preserved", slug: "canned-preserved" }, vendor: { name: "Traditional Foods" } },
  { id: "12", name: "Canned Tuna in Oil", slug: "canned-tuna-in-oil", description: "Premium chunk tuna in vegetable oil", price: 65, comparePrice: 75, unit: "can", images: ["https://images.unsplash.com/photo-1574717028049-d3251cd72299?w=400&h=300&fit=crop"], stock: 200, minOrder: 1, featured: false, category: { name: "Canned & Preserved", slug: "canned-preserved" }, vendor: { name: "Ocean Premium" } },
];

const defaultCategories: Category[] = [
  { id: "1", name: "Fresh Fish", slug: "fresh-fish", image: null, children: [{ id: "1-1", name: "Salmon", slug: "salmon" }, { id: "1-2", name: "Tuna", slug: "tuna" }, { id: "1-3", name: "Mahi-Mahi", slug: "mahi-mahi" }, { id: "1-4", name: "Groupers", slug: "groupers" }, { id: "1-5", name: "Snapper", slug: "snapper" }, { id: "1-6", name: "Bangus", slug: "bangus" }] },
  { id: "2", name: "Shellfish", slug: "shellfish", image: null, children: [{ id: "2-1", name: "Shrimp", slug: "shrimp" }, { id: "2-2", name: "Prawns", slug: "prawns" }, { id: "2-3", name: "Crab", slug: "crab" }, { id: "2-4", name: "Lobster", slug: "lobster" }, { id: "2-5", name: "Squid", slug: "squid" }, { id: "2-6", name: "Mussels", slug: "mussels" }] },
  { id: "3", name: "Frozen Seafood", slug: "frozen-seafood", image: null, children: [{ id: "3-1", name: "Frozen Fish", slug: "frozen-fish" }, { id: "3-2", name: "Frozen Shrimp", slug: "frozen-shrimp" }, { id: "3-3", name: "IQF Fillets", slug: "iqf-fillets" }] },
  { id: "4", name: "Canned & Preserved", slug: "canned-preserved", image: null, children: [{ id: "4-1", name: "Canned Tuna", slug: "canned-tuna" }, { id: "4-2", name: "Dried Fish", slug: "dried-fish" }, { id: "4-3", name: "Fish Sauce", slug: "fish-sauce" }, { id: "4-4", name: "Bagoong", slug: "bagoong" }] },
];

const banners = [
  { id: 1, title: "Big Sale Up to 25% Off", subtitle: "Fresh Salmon", image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&h=400&fit=crop", link: "/seafood?category=fresh-fish" },
  { id: 2, title: "Premium Lobsters", subtitle: "Up to 15% Off", image: "https://images.unsplash.com/photo-1553247407-23251b9c19e0?w=800&h=400&fit=crop", link: "/seafood?category=shellfish" },
];

interface CartItem {
  product: Product;
  quantity: number;
}

function SeafoodContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
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

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("seafood_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedUser = localStorage.getItem("seafood_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("seafood_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
      product.category.slug === selectedCategory ||
      product.category.name.toLowerCase().includes(selectedCategory?.toLowerCase() || "");
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(p => p.featured);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
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
    
    // Simulate auth (would connect to real API)
    setTimeout(() => {
      const newUser = { 
        id: "user_" + Date.now(), 
        name: authForm.name || authForm.email.split("@")[0],
        email: authForm.email 
      };
      setUser(newUser);
      localStorage.setItem("seafood_user", JSON.stringify(newUser));
      setShowAuth(false);
      setLoading(false);
    }, 1000);
  };

  const handleCheckout = async () => {
    if (!user && checkoutStep === 1) {
      setShowAuth(true);
      return;
    }
    
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      setLoading(true);
      // Simulate order creation
      setTimeout(() => {
        alert(`Order placed! Total: ₱${grandTotal.toLocaleString()}\nShipping to: ${shippingInfo.address}, ${shippingInfo.city}`);
        setCart([]);
        setCheckoutStep(1);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setLoading(false);
      }, 1500);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("seafood_user");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-[#1a1a1a] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>+88012 3456 7894</span>
            <span className="hidden sm:inline">support@seafoodmart.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Language:</span>
            <select className="bg-transparent text-white text-sm focus:outline-none">
              <option value="en">English</option>
              <option value="tl">Filipino</option>
            </select>
            <span className="ml-2">🇵🇭</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/seafood" className="text-2xl font-bold text-[#1E3A8A] flex items-center gap-2">
              <span className="text-3xl">🐟</span>
              SeafoodMart
            </Link>

            <div className="flex-1 max-w-xl hidden md:block mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for fresh seafood, fish, shrimp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-full px-4 py-2.5 pl-12 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:block">Hi, {user.name}</span>
                  <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} className="p-2 hover:bg-gray-100 rounded-full flex items-center gap-1">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700 hidden sm:inline">Sign In</span>
                </button>
              )}
              
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-full md:hidden">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 py-4 border-t border-gray-100 mt-4">
            <Link href="/seafood" className="text-[#1E3A8A] font-medium">Home</Link>
            <Link href="/seafood" className="text-gray-600 hover:text-[#1E3A8A]">Fresh Fish</Link>
            <Link href="/seafood" className="text-gray-600 hover:text-[#1E3A8A]">Shellfish</Link>
            <Link href="/seafood" className="text-gray-600 hover:text-[#1E3A8A]">Frozen</Link>
            <Link href="/seafood" className="text-gray-600 hover:text-[#1E3A8A]">Canned</Link>
            <Link href="/seafood" className="text-gray-600 hover:text-[#1E3A8A]">Contact</Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="p-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              />
            </div>
            <nav className="flex flex-col">
              {["Fresh Fish", "Shellfish", "Frozen Seafood", "Canned & Preserved"].map((item) => (
                <Link 
                  key={item} 
                  href="/seafood"
                  className="px-4 py-3 border-t border-gray-100 text-gray-600 hover:bg-gray-50"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Banners */}
      <section className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block bg-[#F59E0B] text-[#1a1a1a] px-4 py-1 rounded-full text-sm font-semibold mb-4">
                BIG SALE UP TO 25% OFF
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Fresh Seafood <br/>Direct from Ocean
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Premium quality seafood delivered fresh to your doorstep. 
                Handcrafted from the finest catches.
              </p>
              <button className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1a1a1a] px-8 py-3 rounded-full font-semibold text-lg transition-colors">
                SHOP NOW
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1559742811-d61d5c768ce5?w=500&h=400&fit=crop" 
                alt="Fresh Seafood" 
                className="rounded-2xl shadow-2xl max-w-sm md:max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow ${
                selectedCategory === cat.slug ? "ring-2 ring-[#1E3A8A]" : ""
              }`}
            >
              <div className="text-3xl mb-2">
                {cat.slug === "fresh-fish" ? "🐟" : cat.slug === "shellfish" ? "🦐" : cat.slug === "frozen-seafood" ? "🧊" : "🥫"}
              </div>
              <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.children.length} items</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center justify-between">
                Categories
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(selectedCategory === category.slug ? null : category.slug)}
                      className={`w-full flex items-center justify-between py-2 text-left font-medium ${
                        selectedCategory === category.slug ? "text-[#1E3A8A]" : "text-gray-700"
                      } hover:text-[#1E3A8A]`}
                    >
                      {category.name}
                      <ChevronRight className={`w-4 h-4 ${selectedCategory === category.slug ? "rotate-90" : ""}`} />
                    </button>
                    {selectedCategory === category.slug && (
                      <div className="ml-2 mt-1 space-y-2 border-l-2 border-gray-100 pl-3">
                        {category.children.map((sub) => (
                          <button
                            key={sub.slug}
                            onClick={() => setSelectedCategory(sub.slug)}
                            className="block w-full text-left text-sm text-gray-500 hover:text-[#1E3A8A] py-1"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Banner Ad */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-2">Fresh Salmon</h4>
              <p className="text-white/80 text-sm mb-4">Get 20% off on all salmon products this week!</p>
              <button className="bg-white text-[#1E3A8A] px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100">
                Shop Now
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Category Title */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory 
                    ? categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
                    : "All Seafood Products"}
                </h2>
                <p className="text-gray-500 mt-1">Showing {filteredProducts.length} products</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm hidden sm:block">Sort by:</span>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3A8A]">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="absolute top-3 left-3 bg-[#EF4444] text-white px-2 py-1 rounded-full text-sm font-medium">
                        {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                      </span>
                    )}
                    {product.featured && (
                      <span className="absolute top-3 right-3 bg-[#F59E0B] text-white px-2 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 flex gap-1">
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-[#1E3A8A] hover:text-white transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                      <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                      <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                      <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                      <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                      <span className="text-xs text-gray-400 ml-1">(5.0)</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Vendor: {product.vendor.name}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      {product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-500">Out of stock</span>}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-[#1E3A8A]">
                          ₱{product.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">/{product.unit}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A8A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Products Section */}
            {!selectedCategory && featuredProducts.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                  <Link href="/seafood" className="text-[#1E3A8A] hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <div 
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-[#1E3A8A]">₱{product.price.toLocaleString()}</span>
                          <button 
                            onClick={() => addToCart(product)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1E3A8A] hover:text-[#1E3A8A]">
                &lt;
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center">1</button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]">2</button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]">3</button>
              <span className="px-2">...</span>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]">11</button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1E3A8A] hover:text-[#1E3A8A]">
                &gt;
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Shopping Cart ({cart.length})</h3>
                <button onClick={() => setIsCartOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-[#1E3A8A] hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-4 pb-4 border-b border-gray-100 mb-4">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-gray-500 text-sm">{item.product.category.name}</p>
                          <p className="text-[#1E3A8A] font-bold mt-1">₱{item.product.price}/{item.product.unit}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)}>
                          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-lg font-semibold">₱{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-lg font-semibold">
                        {shippingFee === 0 ? "FREE" : `₱${shippingFee}`}
                      </span>
                    </div>
                    {cartTotal < 2000 && (
                      <p className="text-xs text-green-600 mb-2">
                        Add ₱{(2000 - cartTotal).toLocaleString()} more for free shipping!
                      </p>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-900 font-semibold">Total</span>
                      <span className="text-2xl font-bold text-[#1E3A8A]">
                        ₱{grandTotal.toLocaleString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                      className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#1E3A8A]/90 transition-colors"
                    >
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
                <button onClick={() => setIsCheckoutOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className={`flex items-center gap-2 ${checkoutStep >= 1 ? "text-[#1E3A8A]" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep >= 1 ? "bg-[#1E3A8A] text-white" : "bg-gray-200"}`}>1</div>
                  <span className="text-sm">Cart</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-2">
                  <div className={`h-full bg-[#1E3A8A] transition-all ${checkoutStep >= 2 ? "w-full" : "w-0"}`} />
                </div>
                <div className={`flex items-center gap-2 ${checkoutStep >= 2 ? "text-[#1E3A8A]" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep >= 2 ? "bg-[#1E3A8A] text-white" : "bg-gray-200"}`}>2</div>
                  <span className="text-sm">Shipping</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-2">
                  <div className={`h-full bg-[#1E3A8A] transition-all ${checkoutStep >= 3 ? "w-full" : "w-0"}`} />
                </div>
                <div className={`flex items-center gap-2 ${checkoutStep >= 3 ? "text-[#1E3A8A]" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep >= 3 ? "bg-[#1E3A8A] text-white" : "bg-gray-200"}`}>3</div>
                  <span className="text-sm">Payment</span>
                </div>
              </div>

              {checkoutStep === 1 && (
                <div>
                  <h4 className="font-semibold mb-4">Order Summary</h4>
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span className="text-gray-600">{item.product.name} x {item.quantity}</span>
                        <span className="font-medium">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>₱{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span>{shippingFee === 0 ? "FREE" : `₱${shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₱{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold mt-6 hover:bg-[#1E3A8A]/90"
                  >
                    Continue to Shipping
                  </button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div>
                  <h4 className="font-semibold mb-4">Shipping Information</h4>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                        placeholder="Juan dela Cruz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                        placeholder="Manila"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                      <textarea
                        value={shippingInfo.notes}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                        rows={2}
                        placeholder="Special instructions..."
                      />
                    </div>
                  </form>
                  <button 
                    onClick={handleCheckout}
                    disabled={!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city}
                    className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold mt-6 hover:bg-[#1E3A8A]/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <h3 className="text-xl font-bold">
                {authMode === "login" ? "Sign In" : "Create Account"}
              </h3>
              <button onClick={() => setShowAuth(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                    placeholder="Juan dela Cruz"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                  placeholder="juan@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1E3A8A]"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#1E3A8A]/90 disabled:opacity-50"
              >
                {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              {authMode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setAuthMode("register")} className="text-[#1E3A8A] font-medium">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setAuthMode("login")} className="text-[#1E3A8A] font-medium">
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🐟</span>
                SeafoodMart
              </h3>
              <p className="text-gray-400 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id et, in gravida.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/seafood" className="hover:text-white">About Us</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Contact</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/seafood" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/seafood" className="hover:text-white">How to Order</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Track Order</Link></li>
                <li><Link href="/seafood" className="hover:text-white">Returns & Refunds</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>70 Seafood Market, Manila</li>
                <li>Email: support@seafoodmart.com</li>
                <li>Phone: +63 123 456 7890</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function SeafoodPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
      </div>
    }>
      <SeafoodContent />
    </Suspense>
  );
}