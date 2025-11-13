import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const CustomerLayout = () => {
  return (
    <>
      <Header />
      <div>
        CustomerLayout
        <Outlet />
      </div>
    </>
  );
};

export default CustomerLayout;
