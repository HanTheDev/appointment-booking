"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  // for pagination
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);

  const fetchUsers = async () => {
    const res = await fetch(
      `http://localhost:8000/users?skip=${skip}&limit=${limit}`
    );
    const data = await res.json();
    setUsers(data);
  };

  const incrementSkip = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  const decrementSkip = () => {
    setSkip((prevSkip) => prevSkip - limit);
  };

  const usersLength = users.length;

  useEffect(() => {
    fetchUsers();
  }, [skip, limit]);

  const deleteUser = async (id: number) => {
    const userConfirmed = confirm("Are you sure you want delete this user?");
    if (userConfirmed) {
      try {
        const res = await fetch(`http://localhost:8000/users/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchUsers();
        } else {
          console.error("failed to delete user", res.statusText);
        }
      } catch (error) {
        console.error("error during deletion", error);
      }
      fetchUsers();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      <select
        className="mb-4 bg-blue-400 rounded"
        onChange={(e) => setLimit(Number(e.target.value))}
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
            <button
              className="mr-2 cursor-pointer text-red-400"
              onClick={() => deleteUser(user.id)}
            >
              Delete
            </button>
            <Link className="ml-2" href={`/users/edit/${user.id}`}>
              Edit
            </Link>
          </li>
        ))}
      </ul>

      {skip > 0 && (
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-4 mb-4 mr-2 rounded cursor-pointer"
          onClick={decrementSkip}
        >
          Prev
        </button>
      )}

      {usersLength === limit && (
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-4 mb-4 ml-2 rounded cursor-pointer"
          onClick={incrementSkip}
        >
          Next
        </button>
      )}
    </div>
  );
}
