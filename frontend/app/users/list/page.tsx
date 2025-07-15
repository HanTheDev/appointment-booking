"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState<number | null>(null); // Track logged-in user
  const usersLength = users.length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: any = jwtDecode(token);
    fetch(`http://localhost:8000/users/email/${decoded.sub}`)
      .then((res) => res.json())
      .then((data) => {
        setRole(data.role);
        setUserId(data.id);
      });
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `http://localhost:8000/users?skip=${skip}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    // check if the role is admin or not
    if (role === "admin") {
      fetchUsers();
    }
  }, [role, skip, limit]);

  const deleteUser = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      // After deletion, re-fetch users
      const nextPage = async () => {
        const refreshedRes = await fetch(
          `http://localhost:8000/users?skip=${skip}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const refreshed = await refreshedRes.json();

        // If current page is empty after deletion and not the first page
        if (refreshed.length === 0 && skip >= limit) {
          setSkip((prev) => prev - limit);
        } else {
          setUsers(refreshed);
        }
      };

      nextPage();
    }
  };

  const renderAccessDenied = () => (
    <div className="text-center mt-10">
      <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
      <p className="text-gray-600">
        You do not have permission to view this page.
      </p>
      <Link href="/" className="mt-4 inline-block text-blue-600 underline">
        Go back to homepage
      </Link>
    </div>
  );

  const renderAdminUserList = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      <select
        className="mb-4 bg-blue-400 rounded"
        onChange={(e) => setLimit(Number(e.target.value))}
        value={limit}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-2">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>

            {/* Prevent admin from editing/deleting themselves */}
            {user.id !== userId && (
              <>
                <button
                  className="mr-2 cursor-pointer text-red-400"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
                <Link className="ml-2" href={`/users/edit/${user.id}`}>
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
            className="bg-blue-600 text-white px-4 py-2 mr-2 rounded cursor-pointer"
            onClick={() => setSkip((prev) => prev - limit)}
          >
            Prev
          </button>
        )}
        {usersLength === limit && (
          <button
            className="bg-blue-600 text-white px-4 py-2 ml-2 rounded cursor-pointer"
            onClick={() => setSkip((prev) => prev + limit)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );

  return role === "admin" ? renderAdminUserList() : renderAccessDenied();
}
