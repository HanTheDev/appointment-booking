'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Appointment Booking App</h1>
      <p className="mb-6 text-gray-600">
        Manage users, services, and appointments — built with FastAPI and Next.js.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/users" className="bg-blue-600 text-white px-4 py-3 rounded text-center">
          View Users
        </Link>
        <Link href="/services/list" className="bg-green-600 text-white px-4 py-3 rounded text-center">
          View Services
        </Link>
        <Link href="/appointment/list" className="bg-purple-600 text-white px-4 py-3 rounded text-center">
          View Appointments
        </Link>
        <Link href="/appointment/add" className="bg-orange-600 text-white px-4 py-3 rounded text-center">
          Add Appointment
        </Link>
      </div>
    </div>
  )
}
