import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-6 py-24 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold uppercase font-rubik">We keep your vehicle running</h1>
        <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">Book trusted mechanics and get service at your doorstep or at partner garages — fast and reliable.</p>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/signup" className="btn bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400">Get Started</Link>
          <a href="#services" className="btn btn-outline border-slate-600 text-slate-300 hover:bg-slate-800/50">Explore Services</a>
        </div>

        <div className="mt-10">
          <a href="#about" className="inline-block animate-bounce">
            <svg width="53" height="53" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="27" cy="26" r="18" stroke="white" strokeWidth="2" />
              <path d="M22.41 23.2875L27 27.8675L31.59 23.2875L33 24.6975L27 30.6975L21 24.6975L22.41 23.2875Z" fill="white" />
            </svg>
          </a>
        </div>
      </div>
      {/* wave */}
      {/* <svg className="fill-info-content" viewBox="0 0 1440 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1440 0H0V57C720 0 1440 57 1440 57V0Z" /></svg> */}
    </section>
  );
}
