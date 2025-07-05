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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const email = decoded.sub;

    fetch(`http://localhost:8000/users/email/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role); // this should now work!
      })
      .catch((err) => console.error("Failed to fetch user role:", err));
  }, []);

  const fetchServices = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/services?skip=${skip}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const servicesLength = services.length;

  useEffect(() => {
    fetchServices();
  }, [skip, limit]);

  const deleteService = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmed = confirm("Are you sure you want to delete this service?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8000/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Refetch after delete to fill up the list
        const newSkip = services.length === 1 && skip > 0 ? skip - limit : skip;
        setSkip(newSkip);
        setTimeout(fetchServices, 100); // small delay to let DB update
      } else {
        console.error("Failed to delete service", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting service", error);
    }
  };

  console.log(role);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services List</h1>

      <select
        className="mb-4 bg-blue-400 rounded"
        onChange={(e) => setLimit(Number(e.target.value))}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

      {role === "admin" && (
        <Link
          href="/services/add"
          className="inline-block ml-4 mb-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Service
        </Link>
      )}

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
                <Link
                  className="ml-2 text-blue-500"
                  href={`/services/edit/${service.id}`}
                >
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
            className="bg-blue-600 text-white px-4 py-2 mt-4 mb-4 mr-2 rounded cursor-pointer"
            onClick={() => setSkip((prev) => prev - limit)}
          >
            Prev
          </button>
        )}

        {servicesLength === limit && (
          <button
            className="bg-blue-600 text-white px-4 py-2 mt-4 mb-4 ml-2 rounded cursor-pointer"
            onClick={() => setSkip((prev) => prev + limit)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
