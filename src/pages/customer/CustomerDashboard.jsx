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

        {/* Service Status */}
        <div className="card bg-base-100 shadow-md overflow-hidden h-80 md:h-96 flex flex-col">
          <figure className="h-32 md:h-40 w-full">
            <img
              src="https://content.jdmagicbox.com/v2/comp/delhi/v3/011pxx11.xx11.150609094838.g5v3/catalogue/crossroads-helpline-roadside-assistance--okhla-industrial-area-phase-2-delhi-24-hours-car-repair-and-services-ijxhzjmx9k.jpg"
              alt="Service Status"
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between">
            <div>
              <h2 className="card-title justify-center">Service Status</h2>
              <p className="text-sm">View the status of your service bookings and track progress.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button 
                onClick={() => navigate(`service-status`)}
                className="btn btn-secondary w-full md:w-auto"
              >
                View Status
              </button>
            </div>
          </div>
        </div>

        {/* Feedbacks & Complaints */}
        <div className="card bg-base-100 shadow-md overflow-hidden h-80 md:h-96 flex flex-col">
          <figure className="h-32 md:h-40 w-full">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeuIyXqv_H3thfvuOz9DeTDx6JcVTkaTe1jA&s"
              alt="Feedbacks"
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between">
            <div>
              <h2 className="card-title justify-center">Feedbacks & Complaints</h2>
              <p className="text-sm">Submit feedback or complaints and view responses from agents.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button 
                onClick={() => navigate(`feedbacks`)}
                className="btn btn-accent w-full md:w-auto"
              >
                View Feedbacks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
