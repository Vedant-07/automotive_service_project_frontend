import React from "react";
import { Outlet } from 'react-router-dom'
import Header from "../components/Header";


const ServiceManagerLayout = () => {
  return (
    <>
      <Header />
      <div>
        ServiceManagerLayout
        <Outlet />
      </div>
    </>
  );
};

export default ServiceManagerLayout;
