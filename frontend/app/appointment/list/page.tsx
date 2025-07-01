"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Form from "next/form";

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

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Service = {
  id: number;
  name: string;
  description: string;
};

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filters, setFilters] = useState({
    userId: "",
    serviceId: "",
    date: "",
  });

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const appointmentLength = appointments.length;
  const [role, setRole] = useState("user");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const decoded: any = jwtDecode(token);
    fetch(`http://localhost:8000/users/email/${decoded.sub}`)
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        setRole(data.role);
      });
  }, []);

  const loadAppointments = async () => {
    const query = new URLSearchParams();

    if (filters.userId) {
      query.append("user_id", filters.userId);
    } else if (role !== "admin" && userId) {
      query.append("user_id", userId.toString());
    }

    if (filters.serviceId) query.append("service_id", filters.serviceId);
    if (filters.date) query.append("date", filters.date);

    query.append("skip", skip.toString());
    query.append("limit", limit.toString());

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/appointments/?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setAppointments(data);
  };

  const incrementSkip = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  const decrementSkip = () => {
    setSkip((prevSkip) => prevSkip - limit);
  };

  useEffect(() => {
    loadAppointments();
  }, [skip, limit]);

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
          loadAppointments();
        } else {
          console.error("failed to delete appointment", res.statusText);
        }
      } catch (error) {
        console.error("error during deletion", error);
      }
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/users?limit=1000", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Users data:", data);

    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      console.error("Expected an array of users, got:", data);
      setUsers([]);
    }
  };
  useEffect(() => {
    if (role === "admin") {
      fetchUsers();
    }
  }, [role]);

  const fetchServices = async () => {
    fetch("http://localhost:8000/services/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Services data: ", data);
        setServices(data);
      });
  };
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Appointments</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          loadAppointments();
        }}
        className="space-y-4"
      >
        {role === "admin" && (
          <select
            name="user"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            className="border p-2 bg-blue-500 rounded mr-2"
          >
            <option value="">-- All Users --</option>
            {users
              .filter((user) => user.role !== "admin")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        )}

        <select
          name="service"
          value={filters.serviceId}
          onChange={(e) =>
            setFilters({ ...filters, serviceId: e.target.value })
          }
          className="border p-2 bg-orange-500 rounded ml-2 mr-2"
        >
          <option value="">-- All Services --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 bg-green-500 rounded ml-2 mr-2"
        />

        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 mr-2 rounded cursor-pointer"
          onClick={() => {
            loadAppointments();
          }}
        >
          Filter
        </button>

        <button
          type="button"
          className="bg-red-500 text-white px-4 py-2 ml-2 rounded cursor-pointer"
          onClick={() => {
            setFilters({ userId: "", serviceId: "", date: "" });
            setSkip(0);
            loadAppointments();
          }}
        >
          Reset
        </button>
      </form>

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

      {skip > 0 && (
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-4 mb-4 mr-2 rounded cursor-pointer"
          onClick={decrementSkip}
        >
          Prev
        </button>
      )}

      {appointmentLength === limit && (
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-4 mb-4 ml-2 rounded cursor-pointer"
          onClick={incrementSkip}
        >
          Next
        </button>
      )}
    </div>
  );
}
