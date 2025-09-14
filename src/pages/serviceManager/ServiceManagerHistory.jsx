import React from "react";

const ServiceManagerHistory = () => {
  const history = [
    {
      id: 1,
      regNo: "GJ05AB1234",
      date: "2025-08-15",
      img: "https://via.placeholder.com/70x45",
    },
    {
      id: 2,
      regNo: "MH12CD5678",
      date: "2025-08-30",
      img: "https://via.placeholder.com/70x45",
    },
  ];

  const viewDetails = (id) => {
    alert(`Opening details for history ID: ${id}`);
    // Later: Navigate to details page or open modal
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
              <img src="https://via.placeholder.com/45" alt="SM" />
            </div>
          </div>
          <button className="btn btn-error btn-sm">Logout</button>
        </div>
      </div>

      {/* History Section */}
      <div className="flex-1 p-6 space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 shadow-md p-4 flex flex-row items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <figure>
                <img
                  src={item.img}
                  alt="Vehicle"
                  className="rounded-md border w-[70px] h-[45px] object-cover"
                />
              </figure>
              <div className="flex flex-col text-base font-medium text-gray-700">
                <span>Reg. No: {item.regNo}</span>
                <span>Service Date: {item.date}</span>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => viewDetails(item.id)}
            >
              View Details
            </button>
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

export default ServiceManagerHistory;
