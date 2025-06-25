export default function AppointmentHomePage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Appointments Management</h1>
      <p className="text-gray-700">Choose an action:</p>
      <div className="space-x-4">
        <a href="/appointment/add" className="bg-green-600 text-white px-4 py-2 rounded">
          ➕ Add Appointment
        </a>
        <a href="/appointment/list" className="bg-blue-600 text-white px-4 py-2 rounded">
          📄 View Appointments
        </a>
      </div>
    </div>
  )
}