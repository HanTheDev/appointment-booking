export default function UsersHomePage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">User Management</h1>
      <p className="text-gray-700">Choose an action:</p>
      <div className="space-x-4">
        <a href="/users/add" className="bg-green-600 text-white px-4 py-2 rounded">
          ➕ Add User
        </a>
        <a href="/users/list" className="bg-blue-600 text-white px-4 py-2 rounded">
          📄 View Users
        </a>
      </div>
    </div>
  )
}