import React from "react";
import { Outlet } from 'react-router-dom'
import Header from "../components/Header";


const ServiceManagerLayout = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-8 md:py-32">
        <Outlet />
      </main>
    </>
  );
};

export default ServiceManagerLayout;
