import React from "react";

const ServiceCard = ({ title, desc, price, accent = "from-cyan-500 to-blue-500", icon }) => (
  <div className="group p-6 space-y-4 border border-white/10 rounded-2xl bg-slate-900/60 shadow-[0_18px_45px_-18px_rgba(15,166,233,0.6)] transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40">
    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${accent} text-4xl shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-slate-300">{desc}</p>
    {price && <div className="text-cyan-300 font-semibold text-lg">From ₹{price}</div>}
  </div>
);

export default function Services() {
  return (
    <section id="services" className="container mx-auto px-6 py-16">
      <p className="uppercase tracking-[0.35em] text-sm text-slate-400 mb-2">
        What we do
      </p>
      <h3 className="text-3xl md:text-4xl font-semibold text-white mb-8">
        Our Services
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard 
          title="Oil Change" 
          desc="Fast oil change at home or garage" 
          price="499" 
          accent="from-cyan-500 to-blue-500"
          icon="🛢️"
        />
        <ServiceCard 
          title="Full Service" 
          desc="Comprehensive check and service" 
          price="2499" 
          accent="from-emerald-500 to-teal-400"
          icon="🔧"
        />
        <ServiceCard 
          title="Tire & Wheel" 
          desc="Balance, alignment and replacement" 
          price="899" 
          accent="from-amber-500 to-orange-500"
          icon="🛞"
        />
      </div>
    </section>
  );
}
