'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-blue-700">Welcome to Our App</h1>
        <p className="text-gray-600">Please log in to continue</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}
