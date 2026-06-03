import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="size-9 rounded-lg bg-primary-foreground/15 grid place-items-center">
              <ShieldCheck className="size-5" />
            </div>
            <span className="font-bold text-lg">CivicEye</span>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            Smart Public Issue Reporting & Resolution System for transparent urban governance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/citizen/complaints/new" className="hover:opacity-100 hover:underline">Report Issue</Link></li>
            <li><Link to="/citizen/complaints" className="hover:opacity-100 hover:underline">Track Status</Link></li>
            <li><Link to="/admin/analytics" className="hover:opacity-100 hover:underline">Transparency Dashboard</Link></li>
            <li><a href="#contact" className="hover:opacity-100 hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Departments */}
        <div>
          <h4 className="font-semibold mb-3">Departments</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Roads & Infrastructure</li>
            <li>Sanitation</li>
            <li>Electrical</li>
            <li>Water Supply</li>
          </ul>
        </div>

        {/* Contact */}
        <div id="contact">
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Helpline: 1800-XXX-XXXX</li>
            <li>Email: support@civiceye.gov</li>
            <li>Municipal Corporation</li>
            <li>Mon-Sat: 9:00 AM - 6:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-6 py-5 text-sm opacity-90 text-center">
          © {new Date().getFullYear()} CivicEye. A Government of India Initiative. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
