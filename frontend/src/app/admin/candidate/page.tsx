'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState<any[]>()

  useEffect(() => {
    axios
      .get('http://localhost:5050/candidates')
      .then((res) => {
        setCandidates(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      <p>Candidates</p>
      <div>
        {candidates ? (
          candidates.map((item, index) => <p key={index}>{item.name}</p>)
        ) : (
          <p>Loading</p>
        )}
      </div>
    </div>
  )
}
