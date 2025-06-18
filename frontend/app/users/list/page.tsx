'use client'
import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
}

export default function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('http://localhost:8000/users')
      const data = await res.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-2">
            <p className="font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}