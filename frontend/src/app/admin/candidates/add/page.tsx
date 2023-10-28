'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AddCandidate() {
  const router = useRouter()

  const [parties, setParties] = useState<any[]>()

  const [name, setName] = useState<string>('')
  const [party, setParty] = useState<{ id: string; name: string }>()

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/parties`)
      .then((res: any) => {
        setParty(res.data.payload[0])
        console.log(res.data.payload[0])
        setParties(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleCandidateSave = () => {
    console.log({ name, partyId: party!.id })

    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/candidates`, {
        name,
        partyId: party!.id,
      })
      .then((res) => {
        console.log(res)
        alert('Successfully created a candidate')
        router.push('/admin/candidates')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (!parties) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <label htmlFor="candidateName">Candidate Name</label>
      <br />
      <input
        id="candidateName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-2"
      />
      <br />
      <label htmlFor="partyId">Party</label>
      <select
        onChange={(e) => setParty(JSON.parse(e.target.value))}
        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {parties.map((item, index) => (
          <option key={index} value={JSON.stringify(item)}>
            {item.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleCandidateSave}
        className="bg-blue-500 text-white px-4"
      >
        Save candidate
      </button>
    </div>
  )
}
