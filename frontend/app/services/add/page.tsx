'use client'
import { useState } from "react";

export default function AddServicePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const addService = async () => {
    await fetch("http://localhost:8000/services/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    alert("Service added!");
    setName('');
    setDescription('');
  };
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
