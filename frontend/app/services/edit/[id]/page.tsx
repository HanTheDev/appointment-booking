"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

export default function EditServicePage() {
  const { id } = useParams() as { id: string };
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
        console.error("Failed to fetch user info", err);
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8000/services/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
      })
      .catch((err) => {
        console.error("Failed to fetch service data", err);
      });
  }, [id]);

  const updateService = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!name || !description) {
      alert("Both name and description are required.");
      return;
    }

    const res = await fetch(`http://localhost:8000/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      alert("Service updated!");
      router.push("/services/list");
    } else {
      const errorData = await res.json();
      alert("Failed to update service: " + errorData.detail);
    }
  };

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You must be logged in to view this page.</p>
        <Link href="/login" className="mt-4 inline-block text-blue-600 underline">
          Go to login
        </Link>
      </div>
    );
  }

  // 🔒 Logged in but not admin
  if (isAuthenticated && role !== "admin") {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to edit services.</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 underline">
          Go back to homepage
        </Link>
      </div>
    );
  }

  // ✅ Admin can edit
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Service</h1>
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
          onClick={updateService}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Update Service
        </button>
      </div>
    </div>
  );
}
