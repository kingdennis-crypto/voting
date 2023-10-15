'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Param = { params: { id: string } }

export default function AdminCandidateDetail({ params }: Param) {
  const router = useRouter()
  const [candidate, setCandidate] = useState<any>()
  const [parties, setParties] = useState<string[]>([])

  useEffect(() => {
    axios
      .get('http://localhost:5050/parties')
      .then((res: any) => {
        setParties(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })

    axios
      .get(`http://localhost:5050/candidates/${params.id}`)
      .then((res) => {
        setCandidate(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [params.id])

  const handleSave = () => {
    axios
      .put(`http://localhost:5050/candidates/${candidate.id}`, candidate)
      .then((res) => {
        console.log(res)
        alert('Successfully updates the candidate')
        router.push('/admin/candidates')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5050/candidates/${candidate.id}`)
      .then((res) => {
        console.log(res)
        alert('Successfulyl deleted the party')
        router.push('/admin/candidates')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (!candidate) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <p>{candidate.id}</p>
      <input
        value={candidate.name}
        onChange={(e) =>
          setCandidate((prev: any) => ({ ...prev, name: e.target.value }))
        }
        className="border-2"
      />
      <br />
      <select
        onChange={(e) =>
          setCandidate((prev: any) => ({
            ...prev,
            partyId: e.target.value,
          }))
        }
        value={candidate.partyId}
        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {parties.map((item: any, index: number) => (
          <option key={index} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <hr className="my-4" />
      <div className="inline-flex flex-row space-x-2">
        <button onClick={handleSave} className="bg-green-500">
          Save
        </button>
        <button onClick={handleDelete} className="bg-red-500">
          Delete
        </button>
      </div>
    </div>
  )
}
