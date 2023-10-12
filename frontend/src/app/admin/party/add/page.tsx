'use client'

import axios from 'axios'
import { useState } from 'react'

export default function AddParty() {
  const [name, setName] = useState<string>('')

  const handleAddParty = () => {
    console.log(name)

    axios
      .post('http://localhost:5050/parties', { name })
      .then((res) => {
        console.log(res)
        alert('Successfully created a party')
      })
      .catch((err) => {
        console.log(err)
        alert('Something went wrong')
      })
  }

  return (
    <div>
      <label htmlFor="partyName">Party name</label>
      <br />
      <input
        id="partyName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-2"
      />
      <br />
      <button onClick={handleAddParty} className="text-white bg-blue-500 px-4">
        Add
      </button>
    </div>
  )
}
