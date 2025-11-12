import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-rubik">
      <Header />
      <main className="flex-1 container mx-auto p-8 md:py-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
