"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

export default function AddServicePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
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
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setIsAuthenticated(false);
      });
  }, []);

  const addService = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/services/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        alert("Service added!");
        setName("");
        setDescription("");
      } else {
        const errorData = await res.json();
        alert("Failed to add service: " + errorData.detail);
      }
    } catch (err) {
      console.error("Error adding service:", err);
      alert("Something went wrong.");
    }
  };

  // 👇 Access denied for not logged in
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

  // 👇 Access denied for non-admin users
  if (isAuthenticated && role !== "admin") {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to add a service.
        </p>
        <Link href="/" className="mt-4 inline-block text-blue-600 underline">
          Go back to homepage
        </Link>
      </div>
    );
  }

  // ✅ Admin can see the form
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Service</h1>
      <div className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full"
        />
        <button
          onClick={addService}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Service
        </button>
      </div>
    </div>
  );
}
