'use client'
import { useEffect, useState } from "react"

type User = {
    id: number,
    name: string,
    email: string
}

export default function UsersPage(){
    const [users, setUsers] = useState<User[]>([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const fetchUsers = async () => {
        const res = await fetch('http://localhost:8000/users')
        const data = await res.json()
        setUsers(data)
    }

    const addUser = async () => {
        await fetch('http://localhost:8000/users', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ name, email })
        })
        setName('')
        setEmail('')
        fetchUsers()
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Users</h1>

            <div className="mb-4 space-y-2">
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

