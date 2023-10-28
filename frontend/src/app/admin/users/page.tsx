'use client'

import axios from 'axios'
import { useState } from 'react'

export default function AdminUsers() {
  const [username, setUsername] = useState<string>()

  const handleUserSave = () => {
    console.log('Username', username)

    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/authentication/user`, {
        userId: username,
        role: 'voter',
      })
      .then((res) => {
        console.log(res)
        alert('Successfully created a voter')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <p>Users</p>
      <div className="flex flex-col">
        <label htmlFor="usernameInput">Username</label>
        <input
          id="usernameInput"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-2"
        />
      </div>

      <button
        onClick={handleUserSave}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Save
      </button>
    </div>
  )
}
