import Footer from "../../components/Footer";
import React, { useEffect, useState } from "react";

export default function MechanicDashboard() {
  const [services, setServices] = useState([]);
  const [modalData, setModalData] = useState(null); // which service is being confirmed
  const [actionType, setActionType] = useState(null); // "do" or "complete"

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        vehicleType: "car",
        registration: "MH12AB1234",
        date: "2025-09-05",
        status: "pending",
      },
      {
        id: 2,
        vehicleType: "bike",
        registration: "GJ05XY5678",
        date: "2025-09-06",
        status: "pending",
      },
      {
        id: 3,
        vehicleType: "car",
        registration: "DL01CD7890",
        date: "2025-09-07",
        status: "pending",
      },
    ];
    setServices(dummyData);
  }, []);

  // ✅ handle action after modal confirmation
  const confirmAction = () => {
    if (!modalData) return;

    if (actionType === "do") {
      setServices((prev) =>
        prev.map((s) =>
          s.id === modalData.id ? { ...s, status: "in-progress" } : s
        )
      );
    } else if (actionType === "complete") {
      setServices((prev) => prev.filter((s) => s.id !== modalData.id));
    }

    setModalData(null); // close modal
    setActionType(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fa] font-rubik">
      {/* ✅ Header */}
      <div className="navbar bg-white shadow-sm px-6 border-b border-gray-200">
        <div className="flex-1 text-xl font-bold text-primary">PitStopPro</div>
        <div className="flex gap-4 items-center">
          <div className="avatar placeholder">
            <div className="bg-blue-100 text-primary rounded-full w-16 flex items-center justify-center border border-blue-300">
              <span className="text-xs font-medium text-center">
                Mechanic <br /> Image
              </span>
            </div>
          </div>
          <button className="btn btn-primary">Logout</button>
        </div>
      </div>

      {/* ✅ Service Cards */}
      <div className="p-6 flex flex-col gap-5 flex-1">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between bg-white rounded-xl shadow-md p-5"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-100 text-3xl">
                  {service.vehicleType === "car" ? "🚗" : "🏍️"}
                </div>
                <div className="flex flex-col text-gray-800 font-medium">
                  <span>Reg: {service.registration}</span>
                  <span>Date: {service.date}</span>
                </div>
              </div>

              {/* ✅ Button Logic */}
              <div className="flex gap-3">
                {service.status === "pending" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setModalData(service);
                      setActionType("do");
                    }}
                  >
                    Do Service
                  </button>
                )}
                {service.status === "in-progress" && (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setModalData(service);
                      setActionType("complete");
                    }}
                  >
                    Complete Service
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            🎉 All services completed!
          </p>
        )}
      </div>

      {/* ✅ Footer */}
      <Footer />

      {/* ✅ Modal */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {actionType === "do"
                ? "Do you really want to start this service?"
                : "Do you want to complete this service?"}
            </h3>
            <div className="flex justify-end gap-3">
            <button
                className="btn btn-error"
                onClick={() => {
                setModalData(null);
                setActionType(null);
                }}
            >
                Cancel
            </button>
            <button
                className="btn btn-primary"
                onClick={confirmAction}
            >
                Yes
            </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
