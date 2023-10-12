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

  return (
    <div>
      <p>Parties</p>
      <div>
        {parties ? (
          parties.map((item, index) => <p key={index}>{item.name}</p>)
        ) : (
          <p>Loading</p>
        )}
      </div>
    </div>
  )
}
