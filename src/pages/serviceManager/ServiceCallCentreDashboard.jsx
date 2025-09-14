import React from "react";

const ServiceCallCentreDashboard = () => {
  const complaints = [
    {
      id: 1,
      vehicleImg: "https://via.placeholder.com/60x40",
      regNo: "GJ05AB1234",
      customer: "John Doe",
    },
    {
      id: 2,
      vehicleImg: "https://via.placeholder.com/60x40",
      regNo: "MH12XY9876",
      customer: "Priya Shah",
    },
  ];

  const viewComplaint = (id) => {
    alert(`Viewing complaint for ID ${id}`);
  };

  const acceptComplaint = (id) => {
    alert(`Complaint ${id} accepted & response sent`);
  };

  const closeComplaint = (id) => {
    alert(`Complaint ${id} closed`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 border-b shadow-sm">
        <div className="flex-1">
          <span className="text-xl font-bold text-primary">PitStopPro</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-14">
              <span className="text-xs text-center leading-tight">
                Service Call<br />Centre
              </span>
            </div>
          </div>
          <button className="btn btn-error btn-sm">Logout</button>
        </div>
      </div>

      {/* Complaints Section */}
      <main className="flex-1 p-6 flex flex-col items-center">
        {complaints.map((c) => (
          <div
            key={c.id}
            className="card bg-base-100 shadow-md w-full max-w-5xl mb-4 p-4 flex flex-row items-center justify-between"
          >
            <div className="flex items-center gap-6 flex-wrap">
              <figure>
                <img
                  src={c.vehicleImg}
                  alt="Vehicle"
                  className="rounded-md border w-[60px] h-[40px] object-cover"
                />
              </figure>
              <div className="text-base font-medium">Reg. No: {c.regNo}</div>
              <div className="text-base font-medium">Customer: {c.customer}</div>
              <button
                className="btn btn-outline btn-primary btn-sm"
                onClick={() => viewComplaint(c.id)}
              >
                View Complaint
              </button>
            </div>
            <div className="flex gap-3">
              <button
                className="btn btn-success btn-sm"
                onClick={() => acceptComplaint(c.id)}
              >
                Accept & Respond
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => closeComplaint(c.id)}
              >
                Close
              </button>
            </div>
          </div>
        ))}

        <p className="text-sm text-gray-600 mt-4">
          Only active complaints will be displayed here.
        </p>
      </main>

      {/* Footer */}
      <footer className="footer footer-center bg-base-100 p-4 border-t">
        <p className="text-sm text-gray-600">About, Terms and Conditions</p>
      </footer>
    </div>
  );
};

export default ServiceCallCentreDashboard;
