"use client";

import { useEffect, useState } from "react";
import { decodeJWT } from "@/app/utils/jwt";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AddAppointmentPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState([]);
  const [role, setRole] = useState<string>("user");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirect to login if no token
      return;
    }

    const decoded: any = jwtDecode(token);
    console.log("Decoded JWT:", decoded);

    if (decoded.sub) {
      fetch(`http://localhost:8000/users/email/${decoded.sub}`)
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.id);
          setRole(data.role);

          // Only fetch users if admin
          if (data.role === "admin") {
            fetch("http://localhost:8000/users?limit=1000", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => res.json())
              .then((userData) => {
                const filteredUsers = userData.filter(
                  (user: any) => user.role !== "admin"
                );
                setUsers(filteredUsers);
              });
          }
        });
    }

    // Fetch services (public, no role check needed)
    fetch("http://localhost:8000/services?limit=1000")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  const addAppointment = async () => {
    if (!serviceId || !appointmentTime) {
      alert("Please fill out all fields.");
      return;
    }

    const payload: any = {
      service_id: serviceId,
      appointment_time: appointmentTime,
    };

    if (role === "admin") payload.user_id = userId;

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/appointments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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

      {/* Show User Select only for Admin */}
      {role === "admin" && (
        <select
          value={userId ?? ""}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="border p-2 w-full bg-blue-500 rounded"
        >
          <option value="">Select User</option>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      )}

      {/* Service Select */}
      <select
        value={serviceId ?? ""}
        onChange={(e) => setServiceId(Number(e.target.value))}
        className="border p-2 w-full bg-orange-500 rounded"
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
        className="border p-2 w-full bg-green-500 rounded"
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
