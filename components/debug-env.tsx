"use client"

export default function DebugEnv() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs z-50">
      <div>API_URL: {process.env.NEXT_PUBLIC_API_URL || 'MISSING'}</div>
      <div>NextAuth URL: {process.env.NEXTAUTH_URL || 'MISSING'}</div>
    </div>
  )
}