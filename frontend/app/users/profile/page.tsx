"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("User data not loaded.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:8000/users/${user.id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (res.ok) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await res.json();
        alert("Failed to change password: " + errorData.detail);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded: any = jwtDecode(token);
    fetch(`http://localhost:8000/users/email/${decoded.sub}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
      });
  }, []);

  const updateProfile = async () => {
    if (!user) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      alert("Profile updated successfully");
    } else {
      alert("Failed to update profile");
    }
  };

  const deleteAccount = async () => {
    if (!user) return;

    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/users/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Account deleted");
      localStorage.removeItem("token");
      router.push("/login");
    } else {
      alert("Failed to delete account");
    }
  };

  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="space-y-2">
        <label className="block font-semibold">Name:</label>
        <input
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block font-semibold">Email:</label>
        <input
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        onClick={updateProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>

      <button
        onClick={deleteAccount}
        className="bg-red-600 text-white px-4 py-2 rounded ml-2"
      >
        Delete Account
      </button>
      <h2 className="text-xl font-semibold mt-8 mb-4">Change Password</h2>
      <form
        onSubmit={handleChangePassword}
        className="space-y-4 border-t pt-4 mt-4"
      >
        <div>
          <label htmlFor="currentPassword" className="block font-medium">
            Current Password:
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block font-medium">
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
