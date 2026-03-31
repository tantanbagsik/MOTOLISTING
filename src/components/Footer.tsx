import Link from "next/link";
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-accent" />
              </div>
              <div>
                <span className="font-outfit font-bold text-lg">MOTOLISTING</span>
                <span className="block text-[10px] text-white/60 -mt-1">Auto Marketplace</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Your trusted platform for buying, renting, and financing vehicles. 
              Find your perfect car with flexible options to suit your needs.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-outfit font-semibold mb-4">Browse</h4>
            <ul className="space-y-3">
              <li><Link href="/listings?tab=sale" className="text-white/60 hover:text-white text-sm transition-colors">Cars For Sale</Link></li>
              <li><Link href="/listings?tab=rent" className="text-white/60 hover:text-white text-sm transition-colors">Cars For Rent</Link></li>
              <li><Link href="/listings?tab=installment" className="text-white/60 hover:text-white text-sm transition-colors">Installment Plans</Link></li>
              <li><Link href="/listings" className="text-white/60 hover:text-white text-sm transition-colors">All Vehicles</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-outfit font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/auth/register" className="text-white/60 hover:text-white text-sm transition-colors">Sell Your Car</Link></li>
              <li><Link href="/auth/login" className="text-white/60 hover:text-white text-sm transition-colors">Sign In</Link></li>
              <li><Link href="/auth/register" className="text-white/60 hover:text-white text-sm transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-outfit font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                raypanganiban0825@gmail.com
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                09564804965
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-accent" />
                Metro Manila, Philippines
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} MOTOLISTING by Ray Panganiban Technology. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
