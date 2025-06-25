"use client";

import { useState, useEffect } from "react";

type Appointment = {
  id: number;
  appointment_time: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
  service: {
    id: number;
    name: string;
    description: string;
  };
};

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    fetch("http://localhost:8000/appointments/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Appointments data: ", data);
        setAppointments(data);
      });
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const deleteAppointment = async (id: number) => {
    const appointmentConfirmed = confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (appointmentConfirmed) {
      try {
        const res = await fetch(`http://localhost:8000/appointments/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchAppointments();
        } else {
          console.error("failed to delete appointment", res.statusText);
        }
      } catch (error) {
        console.error("error during deletion", error);
      }
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.id} className="border p-4 rounded">
              <p>
                <strong>User:</strong> {appt.user.name}
              </p>
              <p>
                <strong>Service:</strong> {appt.service.name}
              </p>
              <p>
                <strong>Service details: </strong> {appt.service.description}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(appt.appointment_time).toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">
                Created at: {new Date(appt.created_at).toLocaleString()}
              </p>
              <button
                className="mr-2 cursor-pointer text-red-400"
                onClick={() => deleteAppointment(appt.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
