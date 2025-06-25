"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams() as { id: string };
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:8000/services/${id}`);
      const data = await res.json();
      setName(data.name);
      setDescription(data.description);
    };
    fetchUser();
  }, [id]);

  const updateService = async () => {
    if (!name || !description) {
      alert("Both name and email are required.");
      return;
    }
    const res = await fetch(`http://localhost:8000/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      alert("Services updated!");
      router.push("/services/list");
    } else {
      alert("Failed to update service");
    }
  };

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
          placeholder="Email"
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
