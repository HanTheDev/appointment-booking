"use client";

import { useEffect, useState } from "react";

export default function AddAppointmentPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // fetch users
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    // fetch services
    fetch("http://localhost:8000/services")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  const addAppointment = async () => {
    if (!userId || !serviceId || !appointmentTime) {
      alert("Please fill out all fields.");
      return;
    }

    const res = await fetch("http://localhost:8000/appointments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        service_id: serviceId,
        appointment_time: appointmentTime,
      }),
    });

    if (res.ok) {
      alert("Appointment added!");
      setUserId(null);
      setServiceId(null);
      setAppointmentTime("");
    } else {
      const err = await res.json();
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add Appointment</h1>

      {/* User Select */}
      <select
        value={userId ?? ""}
        onChange={(e) => setUserId(Number(e.target.value))}
        className="border p-2 w-full"
      >
        <option value="">Select User</option>
        {users.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Service Select */}
      <select
        value={serviceId ?? ""}
        onChange={(e) => setServiceId(Number(e.target.value))}
        className="border p-2 w-full"
      >
        <option value="">Select Service</option>
        {services.map((service: any) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      {/* DateTime Input */}
      <input
        type="datetime-local"
        value={appointmentTime}
        onChange={(e) => setAppointmentTime(e.target.value)}
        className="border p-2 w-full"
      />

      {/* Submit Button */}
      <button
        onClick={addAppointment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Appointment
      </button>
    </div>
  );
}
