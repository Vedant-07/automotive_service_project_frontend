import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header';

const PrivateLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout