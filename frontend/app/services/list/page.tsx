"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type Service = {
  id: number;
  name: string;
  description: string;
};

export default function ListServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchServices = async () => {
    const res = await fetch(
      `http://localhost:8000/services?skip=${skip}&limit=${limit}`
    );
    const data = await res.json();
    setServices(data);
  };

  const deleteService = async (id: number) => {
    const confirmed = confirm("Are you sure you want delete this service?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchServices();
      } else {
        console.error("Failed to delete service", res.statusText);
      }
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    const decoded: any = jwtDecode(token);
    const email = decoded.sub;

    fetch(`http://localhost:8000/users/email/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role);
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setLoading(false);
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    fetchServices();
  }, [skip, limit]);

  const servicesLength = services.length;

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600">
          You must be logged in to view this page.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-blue-600 underline"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services List</h1>

      {role === "admin" && (
        <Link
          href="/services/add"
          className="inline-block bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Service
        </Link>
      )}

      <select
        className="mb-4 bg-blue-400 rounded ml-4"
        onChange={(e) => setLimit(Number(e.target.value))}
        value={limit}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

      <ul className="space-y-2">
        {services.map((service) => (
          <li key={service.id} className="border p-2">
            <p className="font-semibold">{service.name}</p>
            <p className="text-gray-600">{service.description}</p>

            {role === "admin" && (
              <>
                <button
                  className="mr-2 cursor-pointer text-red-400"
                  onClick={() => deleteService(service.id)}
                >
                  Delete
                </button>
                <Link className="ml-2" href={`/services/edit/${service.id}`}>
                  Edit
                </Link>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {skip > 0 && (
          <button
            className="bg-blue-600 text-white px-4 py-2 mr-2 rounded"
            onClick={() => setSkip((prev) => prev - limit)}
          >
            Prev
          </button>
        )}
        {servicesLength === limit && (
          <button
            className="bg-blue-600 text-white px-4 py-2 ml-2 rounded"
            onClick={() => setSkip((prev) => prev + limit)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
