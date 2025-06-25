"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  name: string;
  description: string;
};

export default function ListServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    const res = await fetch("http://localhost:8000/services");
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteService = async (id: number) => {
    const serviceConfirmed = confirm(
      "Are you sure you want delete this service?"
    );
    if (serviceConfirmed) {
      try {
        const res = await fetch(`http://localhost:8000/services/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchServices();
        } else {
          console.error("failed to delete service", res.statusText);
        }
      } catch (error) {
        console.error("error during deletion", error);
      }
      fetchServices();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services List</h1>
      <ul className="space-y-2">
        {services.map((service) => (
          <li key={service.id} className="border p-2">
            <p className="font-semibold">{service.name}</p>
            <p className="text-gray-600">{service.description}</p>
            <button
              className="mr-2 cursor-pointer text-red-400"
              onClick={() => deleteService(service.id)}
            >
              Delete
            </button>
            <Link className="ml-2" href={`/services/edit/${service.id}`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
