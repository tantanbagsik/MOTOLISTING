"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car, Upload, X, ArrowLeft, Camera, Check, AlertCircle, Loader2
} from "lucide-react";

const carMakes = [
  "Toyota", "Honda", "Mitsubishi", "Nissan", "Ford", "Mazda", "Hyundai",
  "Kia", "Suzuki", "Subaru", "Isuzu", "Geely", "Changan", "BYD", "BMW",
  "Mercedes", "Audi", "Tesla", "Volkswagen", "Chevrolet", "Other"
];

export default function AddListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    priceType: "sale",
    mileage: "",
    color: "",
    transmission: "Automatic",
    engine: "",
    fuelType: "Petrol",
    condition: "Used",
    description: "",
  });

  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push("/auth/login");
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push("/auth/login"));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addImage = () => {
    if (imageInput.trim() && images.length < 10) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (images.length === 0) {
      setError("Please add at least one image of your vehicle");
      setLoading(false);
      return;
    }

    if (!formData.make || !formData.model || !formData.price) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year.toString()),
          price: parseFloat(formData.price),
          priceType: formData.priceType,
          mileage: formData.mileage ? parseInt(formData.mileage) : null,
          color: formData.color,
          transmission: formData.transmission,
          engine: formData.engine,
          fuelType: formData.fuelType,
          condition: formData.condition,
          description: formData.description,
          images: images,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create listing");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-2xl shadow-lg p-8 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Listing Submitted!</h2>
          <p className="text-text-secondary mb-4">
            Your vehicle listing has been submitted for review. It will appear on the marketplace once approved.
          </p>
          <p className="text-sm text-text-secondary">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-outfit text-xl font-bold text-text-primary">
                List Your Vehicle
              </h1>
              <p className="text-sm text-text-secondary">
                Fill in the details to list your car for sale or rent
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Step {step}/3</span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-2">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Images & Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-outfit text-lg font-semibold text-text-primary mb-1">
                  Vehicle Photos
                </h2>
                <p className="text-sm text-text-secondary mb-4">
                  Add up to 10 photos. First photo will be the cover image.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={img}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-lg">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    placeholder="Paste image URL and press Enter"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    disabled={!imageInput.trim() || images.length >= 10}
                    className="px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-outfit text-lg font-semibold text-text-primary mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Make <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select make</option>
                      {carMakes.map((make) => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. Camry, Civic, Fortuner"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. Pearl White, Black"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!formData.make || !formData.model) {
                    setError("Please fill in make and model");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
              >
                Continue to Pricing
              </button>
            </div>
          )}

          {/* Step 2: Pricing */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-outfit text-lg font-semibold text-text-primary mb-4">
                  Pricing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Listing Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "sale", label: "For Sale" },
                        { value: "rent", label: "For Rent" },
                        { value: "installment", label: "Installment" },
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, priceType: type.value })}
                          className={`py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                            formData.priceType === type.value
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Price (₱) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder={formData.priceType === "rent" ? "2500 per day" : "1,500,000"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-lg font-semibold"
                      required
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      {formData.priceType === "rent" ? "Price per day in PHP" :
                       formData.priceType === "installment" ? "Total price in PHP" :
                       "Total selling price in PHP"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setError(""); setStep(1); }}
                  className="flex-1 py-4 border border-gray-200 rounded-xl font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.price) {
                      setError("Please enter a price");
                      return;
                    }
                    setError("");
                    setStep(3);
                  }}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Specifications & Description */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-outfit text-lg font-semibold text-text-primary mb-4">
                  Vehicle Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Mileage (km)
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="Petrol">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="New">Brand New</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Engine
                    </label>
                    <input
                      type="text"
                      name="engine"
                      value={formData.engine}
                      onChange={handleChange}
                      placeholder="e.g. 2.5L 4-Cylinder, 1.5L Turbo"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-outfit text-lg font-semibold text-text-primary mb-4">
                  Description
                </h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your vehicle's features, condition, history, and any modifications..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <p className="text-xs text-text-secondary mt-2">
                  A good description helps buyers understand your vehicle better.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Review Notice:</strong> Your listing will be reviewed by our team before it appears on the marketplace. This usually takes 1-2 hours.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setError(""); setStep(2); }}
                  className="flex-1 py-4 border border-gray-200 rounded-xl font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Listing"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
