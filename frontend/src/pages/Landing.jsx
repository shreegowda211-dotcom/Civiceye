import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Camera, MapPin, Activity, BarChart3,
  Users, Briefcase, ShieldCheck,
} from "lucide-react";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROLE_HOME } from "@/config/navigation.js";

const ROLES = [
  {
    icon: Users,
    title: "Citizens",
    description: "Report issues, track status, and give feedback.",
    points: ["Report new issues", "Track complaint status", "View resolution timeline", "Rate service quality"],
  },
  {
    icon: Briefcase,
    title: "Department Officers",
    description: "Handle assigned issues and update progress.",
    points: ["View assigned issues", "Update issue status", "Add resolution notes", "Manage workload"],
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    description: "Monitor system performance and governance.",
    points: ["Analytics dashboard", "Assign issues", "Manage departments", "Generate reports"],
  },
];

const FEATURES = [
  { icon: Camera, title: "Easy Issue Reporting", description: "Report civic issues like potholes, garbage, and streetlights with photos and location." },
  { icon: MapPin, title: "GPS Location", description: "Automatic location detection with map integration for accuracy." },
  { icon: Activity, title: "Real-time Tracking", description: "Track your complaint status from submission to resolution." },
  { icon: BarChart3, title: "Transparency Dashboard", description: "View department performance and resolution statistics." },
];

const STEPS = [
  { title: "Report", description: "Submit issue with photo & location" },
  { title: "Assign", description: "Auto-routed to department" },
  { title: "Track", description: "Monitor progress in real-time" },
  { title: "Resolve", description: "Get notified when fixed" },
];

export default function Landing() {
  const { user } = useAuth();
  const ctaTo = user ? ROLE_HOME[user.role] : "/register";

  // Sequentially reveal the 4 process steps
  const [visibleStep, setVisibleStep] = useState(0);
  useEffect(() => {
    if (visibleStep <= STEPS.length) {
      const t = setTimeout(() => setVisibleStep((s) => s + 1), 600);
      return () => clearTimeout(t);
    }
  }, [visibleStep]);

  const lineWidth = `${Math.min(visibleStep, STEPS.length) * (100 / STEPS.length)}%`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 size-[600px] rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 size-[500px] rounded-full bg-primary-glow/30 blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
              Government of India Initiative
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              CivicEye
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground mb-4">
              Smart Public Issue Reporting & Resolution System
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Report civic issues, track resolutions, and build better cities through transparent governance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-glow shadow-lg h-12 px-8">
                <Link to={ctaTo}>Report an Issue <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8">
                <Link to="/login">Login to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-center md:text-4xl font-semibold tracking-widest text-primary uppercase mb-3">How CivicEye Works</p>
          <h2 className="text-3xl text-xl font-bold text-center mb-14">Built For Modern Cities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl bg-card border border-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground grid place-items-center mb-4 shadow-md">
                  <f.icon className="size-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-gradient-to-br from-primary/5 to-primary-glow/10 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center md:text-4xl font-semibold tracking-widest text-primary uppercase mb-3">Simple 4-Step Process</p>
            <h2 className="text-3xl text-xl font-bold text-center mb-16">From Report to Resolution</h2>

            <div className="relative">
              {/* Animated connector line */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-700 ease-out"
                  style={{ width: lineWidth }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
                {STEPS.map((step, i) => {
                  const visible = i < visibleStep;
                  return (
                    <div
                      key={step.title}
                      className={`flex flex-col items-center text-center transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-30 translate-y-2"}`}
                    >
                      <div
                        className={`size-16 rounded-full grid place-items-center text-xl font-bold shadow-lg mb-4 transition-all ${
                          visible
                            ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground scale-100"
                            : "bg-card text-muted-foreground scale-90 border border-border"
                        }`}
                        style={visible ? { boxShadow: "0 8px 30px 0 oklch(0.52 0.20 255 / 0.35)" } : undefined}
                      >
                        {i + 1}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground max-w-[200px]">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-center md:text-4xl font-semibold tracking-widest text-primary uppercase mb-3">For Everyone</p>
          <h2 className="text-3xl text-xl font-bold text-center mb-14">One Platform, Every Stakeholder</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ROLES.map((role) => (
              <div key={role.title} className="rounded-2xl bg-card border border-border p-7 shadow-sm hover:shadow-xl transition-shadow">
                <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground grid place-items-center mb-4 shadow-md">
                  <role.icon className="size-6" />
                </div>
                <h3 className="font-semibold text-xl mb-1">{role.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">{role.description}</p>
                <ul className="space-y-2">
                  {role.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-auto mx-auto px-6 pb-20">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-12 md:p-16 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of citizens in building better cities with transparency and accountability.
            </p>
            <Button size="lg" variant="secondary" asChild className="h-12 px-8">
              <Link to={ctaTo}>Get Started Now <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
