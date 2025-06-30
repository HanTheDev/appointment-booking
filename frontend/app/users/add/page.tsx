"use client";
import Link from "next/link";
import { useState } from "react";

export default function AddUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  const addUser = async () => {
    await fetch("http://localhost:8000/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    alert("User added!");
    setName("");
    setEmail("");
    setPassword("")
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
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
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="border p-2 w-full"
        />

        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-4 py-2 mr-2 rounded cursor-pointer"
        >
          Add User
        </button>

        <Link href={"/users/list"}>
          <button className="bg-orange-600 text-white px-4 py-2 ml-2 rounded cursor-pointer">
            View Users
          </button>
        </Link>
      </div>
    </div>
  );
}
