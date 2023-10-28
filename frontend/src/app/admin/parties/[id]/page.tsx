'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Param = { params: { id: string } }

export default function AdminPartyDetail({ params }: Param) {
  const router = useRouter()
  const [party, setParty] = useState<any>()

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/parties/${params.id}`)
      .then((res) => {
        setParty(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [params.id])

  const handleSave = () => {
    axios
      .put(`${process.env.NEXT_PUBLIC_SERVER_URL}/parties/${params.id}`, party)
      .then((res) => {
        console.log(res)
        alert('Successfully updated the party')
        router.push('/admin/parties')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleDelete = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/parties/${params.id}`)
      .then((res) => {
        console.log(res)
        alert('Successfully deleted the party')
        router.push('/admin/parties')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (!party) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <p>{party.id}</p>
      <input
        value={party.name}
        onChange={(e) =>
          setParty((prev: any) => ({ ...prev, name: e.target.value }))
        }
        className="border-2"
      />
      <br />
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
