import React from "react";

const ServiceCard = ({ title, desc, price }) => (
  <div className="p-6 space-y-3 border border-slate-700 rounded-xl bg-slate-900/60 hover:border-cyan-400/40 transition-all duration-200 hover:-translate-y-1 shadow-[0_18px_45px_-18px_rgba(15,166,233,0.3)]">
    <span className="inline-block text-cyan-400">
      {/* generic icon */}
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    </span>
    <h3 className="text-xl font-semibold text-white font-rubik">{title}</h3>
    <p className="text-slate-300">{desc}</p>
    {price && <div className="text-cyan-400 font-semibold">From ₹{price}</div>}
  </div>
);

export default function Services() {
  return (
    <section id="services" className="container mx-auto px-6 py-12">
      <h3 className="text-2xl font-semibold text-white mb-6 font-rubik">Our Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard title="Oil Change" desc="Fast oil change at home or garage" price="499" />
        <ServiceCard title="Full Service" desc="Comprehensive check and service" price="2499" />
        <ServiceCard title="Tire & Wheel" desc="Balance, alignment and replacement" price="899" />
      </div>
    </section>
  );
}
