'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AddCandidate() {
  const [parties, setParties] = useState<any[]>()

  const [name, setName] = useState<string>('')
  const [partyId, setPartyId] = useState<string>('')

  useEffect(() => {
    axios
      .get('http://localhost:5050/parties')
      .then((res: any) => {
        setPartyId(res.data.payload[0].id)
        setParties(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleCandidateSave = () => {
    console.log({ name, partyId })

    axios
      .post('http://localhost:5050/candidates', { name, partyId })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <label>Name</label>
      <br />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="border-2"
      />
      <br />
      <label>Party</label>
      <br />
      <select
        value={partyId}
        onChange={(value) => setPartyId(value.target.value)}
      >
        {parties ? (
          parties.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))
        ) : (
          <>Loading</>
        )}
      </select>
      <br />
      <p>{partyId}</p>
      <button
        onClick={handleCandidateSave}
        className="bg-blue-500 text-white px-4"
      >
        Save candidate
      </button>
    </div>
  )
}
