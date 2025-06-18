'use client'
import { useState } from 'react'

export default function AddUserPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const addUser = async () => {
    await fetch('http://localhost:8000/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    alert('User added!')
    setName('')
    setEmail('')
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
        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>
    </div>
  )
}