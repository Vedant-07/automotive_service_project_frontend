import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* grid: 1 column on mobile, 3 columns on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Vehicles */}
        <div className="card bg-base-100 shadow-md overflow-hidden h-80 md:h-96 flex flex-col">
          <figure className="h-32 md:h-40 w-full">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPCFXBflNIBZ_-p19nhyuwZ5eCO-QiEFNovg&s"
              alt="Manage Vehicles"
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between">
            <div>
              <h2 className="card-title justify-center">Manage Vehicles</h2>
              <p className="text-sm">Add, update, or remove your registered vehicles.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button 
              onClick={() => navigate(`vehicles`)}
              className="btn btn-primary w-full md:w-auto">Go</button>
            </div>
          </div>
        </div>

        {/* Download Invoice */}
        <div className="card bg-base-100 shadow-md overflow-hidden h-80 md:h-96 flex flex-col">
          <figure className="h-32 md:h-40 w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1556742400-b5b7c5128f93.webp"
              alt="Download Invoice"
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between">
            <div>
              <h2 className="card-title justify-center">Download Invoice</h2>
              <p className="text-sm">View your past services and download invoices in one click.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-secondary w-full md:w-auto">Download</button>
            </div>
          </div>
        </div>

        {/* Service Center Helpline */}
        <div className="card bg-base-100 shadow-md overflow-hidden h-80 md:h-96 flex flex-col">
          <figure className="h-32 md:h-40 w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1529626455594-4ff0802cfb7e.webp"
              alt="Service Center"
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between">
            <div>
              <h2 className="card-title justify-center">Service Center Helpline</h2>
              <p className="text-sm">Need help? Reach out to our service support anytime.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-accent w-full md:w-auto">Call Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
