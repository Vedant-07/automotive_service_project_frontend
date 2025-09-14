import React from "react";

const MechanicDashboard = () => {
  const jobs = [
    {
      id: 1,
      regNo: "GJ05AB1234",
      date: "2025-09-15",
      img: "https://via.placeholder.com/70x45",
    },
    {
      id: 2,
      regNo: "MH12XY9876",
      date: "2025-09-17",
      img: "https://via.placeholder.com/70x45",
    },
  ];

  const startService = (id) => {
    alert(`Service started for job ${id}`);
  };

  const completeService = (id) => {
    alert(`Service marked complete for job ${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm border-b">
        <div className="flex-1">
          <span className="text-xl font-bold text-primary">PitStopPro</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://via.placeholder.com/45" alt="Mechanic" />
            </div>
          </div>
          <button className="btn btn-error btn-sm">Logout</button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="flex-1 p-6 space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="card bg-base-100 shadow-md p-4 flex flex-row items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <figure>
                <img
                  src={job.img}
                  alt="Vehicle"
                  className="rounded-md border w-[70px] h-[45px] object-cover"
                />
              </figure>
              <div className="flex flex-col text-base font-medium text-gray-700">
                <span>Reg. No: {job.regNo}</span>
                <span>Booking Date: {job.date}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="btn btn-primary btn-circle btn-sm"
                onClick={() => startService(job.id)}
              >
                Do
              </button>
              <button
                className="btn btn-success btn-circle btn-sm"
                onClick={() => completeService(job.id)}
              >
                ✔
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer footer-center bg-base-100 p-4 border-t">
        <p className="text-sm text-gray-600">About, Terms and Conditions</p>
      </footer>
    </div>
  );
};

export default MechanicDashboard;
