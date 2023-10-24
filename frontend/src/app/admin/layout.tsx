'use client'

import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

export default withPageAuthRequired(function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-4 w-full max-w-screen-lg mx-auto">
      <div className="border-2 border-gray-400 mb-2 p-2 inline-flex flex-row justify-between w-full">
        <a href={'/api/auth/logout'}>Logout</a>
        <div className="space-x-2">
          <a href="/admin">Admin Home</a>
          <a href="/admin/users">Users</a>
          <a href="/admin/votes">Votes</a>
          <a href="/admin/parties">Parties</a>
          <a href="/admin/candidates">Candidates</a>
        </div>
      </div>
      <div className="bg-white rounded-md p-6 shadow-sm">{children}</div>
    </div>
  )
})
