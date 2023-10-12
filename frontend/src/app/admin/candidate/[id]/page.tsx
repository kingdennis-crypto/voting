'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

type Param = { params: { id: string } }

export default function AdminCandidateDetail({ params }: Param) {
  const [candidate, setCandidates] = useState<any>()

  useEffect(() => {
    axios
      .get(`http://localhost:5050/candidates/${params.id}`)
      .then((res) => {
        setCandidates(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [params.id])

  return (
    <div>
      {candidate ? (
        <>
          <p>{candidate.id}</p>
          <p>{candidate.name}</p>
          <p>{candidate.partyId}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
