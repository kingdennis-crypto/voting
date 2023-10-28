'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState<any[]>()

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/candidates`)
      .then((res) => {
        setCandidates(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  if (!candidates) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <div className="inline-flex justify-between w-full">
        <p className="text-2xl">Candidates</p>
        <a href="/admin/candidates/add">Add candidate</a>
      </div>
      <ul className="w-full text-gray-900 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {candidates.map((item, index) => (
          <li
            key={index}
            className="w-full px-4 py-2 border-b last:border-b-0 border-gray-200 inline-flex justify-between items-center"
          >
            <p>{item.name}</p>
            <a
              href={`/admin/candidates/${item.id}`}
              className="bg-blue-500 text-white"
            >
              Edit
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
