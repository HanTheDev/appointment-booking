"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AppointmentDetailPage() {
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchAppointment = async () => {
      try {
        const res = await fetch(`http://localhost:8000/appointments/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          setError("You are not authorized to view this appointment.");
        } else if (res.status === 404) {
          setError("Appointment not found.");
        } else if (!res.ok) {
          setError("Failed to fetch appointment.");
        } else {
          const data = await res.json();
          setAppointment(data);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      }
    };

    fetchAppointment();
  }, [params.id, token, router]);

  if (error) {
    return <div className="p-6 text-red-500 font-bold">{error}</div>;
  }

  if (!appointment) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Appointment Detail</h1>
      <p><strong>User:</strong> {appointment.user.name}</p>
      <p><strong>Email:</strong> {appointment.user.email}</p>
      <p><strong>Service:</strong> {appointment.service.name}</p>
      <p><strong>Description:</strong> {appointment.service.description}</p>
      <p><strong>Time:</strong> {new Date(appointment.appointment_time).toLocaleString()}</p>
      <p className="text-gray-500 text-sm">
        Created at: {new Date(appointment.created_at).toLocaleString()}
      </p>
    </div>
  );
}