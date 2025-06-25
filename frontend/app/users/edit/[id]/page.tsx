"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams() as { id: string };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:8000/users/${id}`);
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
    };
    fetchUser();
  }, [id]);

  const updateUser = async () => {
    if (!name || !email) {
      alert("Both name and email are required.");
      return;
    }
    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) {
      alert("User updated!");
      router.push("/users/list");
    } else {
      alert("Failed to update user");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <div className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 w-full"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full"
        />
        <button
          onClick={updateUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update User
        </button>
      </div>
    </div>
  );
}
