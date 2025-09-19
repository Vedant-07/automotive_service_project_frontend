// src/pages/customer/CustomerVehicle.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // added for Back button

const { VITE_API_HOST } = import.meta.env;

// TODO: move VehicleCard to components folder
const VehicleCard = ({ v, onEdit, onDelete }) => {
  return (
    <div className="card bg-base-100 shadow-sm overflow-hidden p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        {/* Left: circular image */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border">
            <img
              src={
                v.imageUrl ||
                "https://img.daisyui.com/images/stock/photo-1524499982521-1ffd58dd89ea.jpg"
              }
              alt={v.make ?? "vehicle"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Middle: info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full">
            <div className="flex-shrink-0">
              <div className="text-sm text-gray-500">Reg. No</div>
              <div className="font-medium">{v.registrationNumber ?? "—"}</div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-sm text-gray-500">Year</div>
              <div className="font-medium">{v.yearOfRegistration ?? "—"}</div>
            </div>
            <div className="flex-1 min-w-[120px]">
              <div className="text-sm text-gray-500">Make / Model</div>
              <div className="text-base font-semibold">
                {v.make ?? "Unknown"} {v.model ?? ""}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-sm text-gray-500">Insured</div>
              <div className="font-medium">
                {v.insured ? "✅ Yes" : "❌ No"}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Book service + Edit/Delete */}
        <div className="mt-3 md:mt-0 md:ml-4 flex-shrink-0 flex flex-col gap-2">
          <button className="btn btn-outline btn-primary">Book service</button>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => onEdit(v)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => onDelete(v)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal - reused for Add + Edit
const VehicleModal = ({ open, onClose, onSubmit, initialData, saving }) => {
  const [form, setForm] = useState({
    vin: "",
    make: "",
    model: "",
    registrationNumber: "",
    insured: false,
    yearOfRegistration: new Date().getFullYear(),
  });

  useEffect(() => {
    if (open) {
      setForm(
        initialData || {
          vin: "",
          make: "",
          model: "",
          registrationNumber: "",
          insured: false,
          yearOfRegistration: new Date().getFullYear(),
        }
      );
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.vin || !form.registrationNumber) {
      alert("VIN and registration number are required.");
      return;
    }
    onSubmit(form);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 max-w-md w-full p-6">
        <h2 className="text-xl mb-4">
          {initialData ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <div className="text-sm mb-1">VIN *</div>
            <input
              name="vin"
              value={form.vin ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <label className="block">
            <div className="text-sm mb-1">Registration number *</div>
            <input
              name="registrationNumber"
              value={form.registrationNumber ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <label className="block">
            <div className="text-sm mb-1">Make</div>
            <input
              name="make"
              value={form.make ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <label className="block">
            <div className="text-sm mb-1">Model</div>
            <input
              name="model"
              value={form.model ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <label className="block">
            <div className="text-sm mb-1">Year of Registration</div>
            <input
              name="yearOfRegistration"
              type="number"
              value={form.yearOfRegistration ?? ""}
              onChange={handleChange}
              className="input input-bordered w-40"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </label>
          <div className="flex items-center gap-3">
            <input
              id="insured"
              name="insured"
              type="checkbox"
              checked={form.insured ?? false}
              onChange={handleChange}
              className="checkbox"
            />
            <label htmlFor="insured" className="text-sm">
              Insured
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CustomerVehicle() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);
  const customerId = user?.userId;
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // fetch
  useEffect(() => {
    if (!customerId) return;
    const controller = new AbortController();
    const url = `${VITE_API_HOST}:9004/api/customers/${customerId}/vehicles`;
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(url, {
          signal: controller.signal, // TODO: whats this for have a look , of not needed then remove it
          withCredentials: true,
        });
        setVehicles(resp.data || []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to fetch vehicles:", err);
          alert("Failed to load vehicles. Check console for details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
    return () => controller.abort();
  }, [customerId]);

  // create/update
  const saveVehicle = async (payload) => {
    if (!customerId) return;
    setSaving(true);
    try {
      if (editingVehicle) {
        const url = `${VITE_API_HOST}:9004/api/customers/${customerId}/vehicles/${editingVehicle.vehicleId}`;
        const resp = await axios.put(url, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const updated = resp.data;
        setVehicles((p) =>
          p.map((v) => (v.vehicleId === updated.vehicleId ? updated : v))
        );
      } else {
        const url = `${VITE_API_HOST}:9004/api/customers/${customerId}/vehicles`;
        const resp = await axios.post(url, payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setVehicles((p) => [resp.data, ...p]);
      }
      setModalOpen(false);
      setEditingVehicle(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save vehicle.");
    } finally {
      setSaving(false);
    }
  };

  // delete
  const deleteVehicle = async (v) => {
    if (!customerId || !v?.vehicleId) return;
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const url = `${VITE_API_HOST}:9004/api/customers/${customerId}/vehicles/${v.vehicleId}`;
      await axios.delete(url, { withCredentials: true });
      setVehicles((p) => p.filter((x) => x.vehicleId !== v.vehicleId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete vehicle.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back to Dashboard button above the vehicle view */}
      <div className="mb-4">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => navigate("/customer")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Your Vehicles</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingVehicle(null);
            setModalOpen(true);
          }}
        >
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <div className="p-6 border rounded text-center">
          No vehicles yet. Add your first vehicle.
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.vehicleId}
              v={v}
              onEdit={(veh) => {
                setEditingVehicle(veh);
                setModalOpen(true);
              }}
              onDelete={deleteVehicle}
            />
          ))}
        </div>
      )}

      {/* TODO: move VehicleModal to new components in this folder itself */}
      <VehicleModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={saveVehicle}
        initialData={editingVehicle}
        saving={saving}
      />
    </div>
  );
}
