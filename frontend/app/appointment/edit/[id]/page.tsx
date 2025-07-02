"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function EditAppointmentPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointment = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      const res = await fetch(`http://localhost:8000/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setServiceId(data.service.id);
        setAppointmentTime(data.appointment_time.slice(0, 16)); // strip seconds
      } else {
        alert("Failed to fetch appointment");
        router.push("/appointment/list");
      }
    };

    const fetchServices = async () => {
      const res = await fetch("http://localhost:8000/services?limit=1000");
      const data = await res.json();
      setServices(data);
    };

    fetchAppointment();
    fetchServices();
  }, [id, router]);

  const updateAppointment = async () => {
    const token = localStorage.getItem("token");
    if (!token || !id || !serviceId || !appointmentTime) {
      console.log("token: ", token)
      console.log("id: ", id)
      alert("Missing data");
      return;
    }

    const res = await fetch(`http://localhost:8000/appointments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service_id: serviceId,
        appointment_time: appointmentTime,
      }),
    });

    if (res.ok) {
      alert("Appointment updated successfully!");
      router.push("/appointment/list");
    } else {
      const err = await res.json();
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Appointment</h1>

      {/* Service Dropdown */}
      <select
        value={serviceId ?? ""}
        onChange={(e) => setServiceId(Number(e.target.value))}
        className="border p-2 w-full bg-orange-300 rounded"
      >
        <option value="">Select Service</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* DateTime Input */}
      <input
        type="datetime-local"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
        className="border p-2 w-full bg-green-300 rounded"
      />

      <button
        onClick={updateAppointment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}