"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, FileText, CheckCircle, Bell, CreditCard } from "lucide-react";

const mockVehicle = {
  id: "2",
  make: "Honda",
  model: "Civic",
  year: 2023,
  price: 3500,
  image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400&h=300&fit=crop",
};

const agreementRules = [
  { title: "Insurance", content: "Basic insurance is included. Comprehensive coverage available at ₱500/day extra." },
  { title: "Fuel Policy", content: "Vehicle must be returned with the same fuel level. Missing fuel charged at ₱65/liter." },
  { title: "Mileage Limit", content: "100 km/day included. Additional km charged at ₱8/km." },
  { title: "Late Return", content: "Late returns charged at ₱200/hour. After 4 hours, full day rate applies." },
  { title: "Damage Liability", content: "Customer responsible for first ₱10,000 of damage. Collision damage waiver available for ₱300/day." },
];

export default function RentalBookingPage() {
  const params = useParams();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [durationType, setDurationType] = useState<"hours" | "days" | "weeks">("days");
  const [duration, setDuration] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [showSignature, setShowSignature] = useState(false);

  const calculateTotal = () => {
    const basePrice = mockVehicle.price;
    let total = basePrice * duration;
    if (durationType === "hours") total = total * 0.5;
    if (durationType === "weeks") total = total * 6;
    return total;
  };

  const handleBooking = () => {
    if (!agreementAccepted) {
      alert("Please accept the agreement terms");
      return;
    }
    setShowSignature(true);
  };

  const confirmBooking = () => {
    alert("Booking confirmed! Confirmation email sent.");
    setShowSignature(false);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/listings?tab=rent" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" /> Back to Listings
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s ? "bg-primary text-white" : "bg-background text-text-secondary"
                    }`}>
                      {s}
                    </div>
                    {s < 3 && <div className={`w-16 h-1 ${step > s ? "bg-primary" : "bg-background"}`}></div>}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-outfit text-2xl font-bold text-text-primary">Select Date & Time</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Pickup Time</label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Return Time</label>
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Duration Type</label>
                    <div className="flex gap-3">
                      {(["hours", "days", "weeks"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setDurationType(type)}
                          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                            durationType === type
                              ? "bg-primary text-white"
                              : "bg-background text-text-secondary hover:bg-primary/10"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Duration ({durationType === "hours" ? "Hours" : durationType === "days" ? "Days" : "Weeks"})
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Pickup Location</label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select location</option>
                      <option value="main">Main Office - 123 Main St</option>
                      <option value="airport">Airport Branch - Terminal 2</option>
                      <option value="downtown">Downtown - 456 Center Ave</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Continue to Agreement
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-outfit text-2xl font-bold text-text-primary">Agreement Terms</h2>

                  <div className="space-y-4">
                    {agreementRules.map((rule, index) => (
                      <div key={index} className="bg-background p-4 rounded-xl">
                        <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4" /> {rule.title}
                        </h3>
                        <p className="text-text-secondary text-sm">{rule.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                    <input
                      type="checkbox"
                      id="agreement"
                      checked={agreementAccepted}
                      onChange={(e) => setAgreementAccepted(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="agreement" className="text-text-primary cursor-pointer">
                      I have read and agree to the rental agreement terms and conditions
                    </label>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-xl">
                    <input
                      type="checkbox"
                      id="reminder"
                      checked={reminderEnabled}
                      onChange={(e) => setReminderEnabled(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="reminder" className="text-text-primary cursor-pointer flex items-center gap-2">
                      <Bell className="w-4 h-4" /> Enable booking reminders (24h and 1h before pickup)
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-background text-text-secondary py-4 rounded-xl font-semibold hover:bg-primary/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBooking}
                      className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="font-outfit text-2xl font-bold text-text-primary mb-2">Booking Confirmed!</h2>
                  <p className="text-text-secondary mb-6">Your booking has been successfully confirmed.</p>
                  <div className="bg-background p-4 rounded-xl text-left max-w-md mx-auto mb-6">
                    <p className="font-semibold text-text-primary">Booking Details:</p>
                    <p className="text-text-secondary text-sm mt-2">
                      {mockVehicle.make} {mockVehicle.model}<br />
                      {startDate} - {endDate}<br />
                      {pickupTime} - {returnTime}<br />
                      {duration} {durationType}
                    </p>
                  </div>
                  <Link
                    href="/listings"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Browse More Vehicles
                  </Link>
                </div>
              )}
            </div>

            {showSignature && (
              <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-in">
                <h2 className="font-outfit text-2xl font-bold text-text-primary mb-4">Digital Signature</h2>
                <p className="text-text-secondary mb-4">Please sign below to confirm your booking</p>
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex items-center justify-center mb-4 bg-background">
                  <p className="text-text-secondary">Sign here...</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSignature(false)}
                    className="flex-1 bg-background text-text-secondary py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="flex-1 bg-success text-white py-3 rounded-xl font-semibold hover:bg-success/90"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
              <img
                src={mockVehicle.image}
                alt={`${mockVehicle.make} ${mockVehicle.model}`}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="font-outfit text-xl font-semibold text-text-primary">
                {mockVehicle.make} {mockVehicle.model}
              </h3>
              <p className="text-text-secondary text-sm mb-4">{mockVehicle.year}</p>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-text-secondary">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
                  <span className="text-text-primary">{startDate || "-"} to {endDate || "-"}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Time</span>
                  <span className="text-text-primary">{pickupTime} - {returnTime}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                  <span className="text-text-primary">{pickupLocation || "Not selected"}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-text-secondary mb-2">
                  <span>Rate ({duration} {durationType})</span>
                  <span>₱{mockVehicle.price.toLocaleString()}/day</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₱{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-text-secondary text-sm">
                <CreditCard className="w-4 h-4" /> Secure payment via Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
