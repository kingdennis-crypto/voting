'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AdminParty() {
  const [parties, setParties] = useState<any[]>()

  useEffect(() => {
    axios
      .get('http://localhost:5050/parties')
      .then((res) => {
        setParties(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  if (!parties) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <div className="inline-flex justify-between w-full">
        <p className="text-2xl">Parties</p>
        <a href="/admin/parties/add">Add party</a>
      </div>
      <ul className="w-full text-gray-900 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {parties.map((item, index) => (
          <li
            key={index}
            className="w-full px-4 py-2 border-b last:border-b-0 border-gray-200 inline-flex justify-between items-center"
          >
            <p>{item.name}</p>
            <a
              href={`/admin/parties/${item.id}`}
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
