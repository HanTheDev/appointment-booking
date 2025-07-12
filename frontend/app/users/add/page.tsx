"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole("unauthenticated");
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      fetch(`http://localhost:8000/users/email/${decoded.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRole(data.role);
        })
        .catch(() => {
          setRole("unauthenticated");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setRole("unauthenticated");
      setLoading(false);
    }
  }, []);

  const addUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }

    const res = await fetch("http://localhost:8000/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      alert("User added!");
      setName("");
      setEmail("");
      setPassword("");
    } else {
      const errorData = await res.json();
      alert("Failed to add user: " + errorData.detail);
    }
  };

  if (loading) {
    return <div className="p-6">Checking access...</div>;
  }

  if (role !== "admin") {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 underline"
        >
          Go back to homepage
        </Link>
      </div>
    );
  }

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
