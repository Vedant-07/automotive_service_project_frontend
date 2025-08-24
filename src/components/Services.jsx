import React from "react";

const ServiceCard = ({ title, desc, price }) => (
  <div className="p-6 space-y-3 border-2 border-primary/30 rounded-xl bg-base-100">
    <span className="inline-block text-primary">
      {/* generic icon */}
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    </span>
    <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
    <p className="text-gray-300">{desc}</p>
    {price && <div className="text-primary font-semibold">From ₹{price}</div>}
  </div>
);

export default function Services() {
  return (
    <section id="services" className="container mx-auto px-6 py-12 bg-info-content">
      <h3 className="text-2xl font-semibold text-gray-100 mb-6">Our Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard title="Oil Change" desc="Fast oil change at home or garage" price="499" />
        <ServiceCard title="Full Service" desc="Comprehensive check and service" price="2499" />
        <ServiceCard title="Tire & Wheel" desc="Balance, alignment and replacement" price="899" />
      </div>
    </section>
  );
}
