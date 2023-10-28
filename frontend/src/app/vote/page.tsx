'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Candidate = {
  id: string
  name: string
  partyId: string
}

export default function VotePage() {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelected] = useState<string>()

  useEffect(() => {
    axios
      .get('${process.env.NEXT_PUBLIC_SERVER_URL}/candidates/')
      .then((res) => {
        setLoading(false)
        setCandidates(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleVote = () => {
    console.log(selectedCandidate)
    axios
      .post('${process.env.NEXT_PUBLIC_SERVER_URL}/votes/', {
        candidateId: selectedCandidate,
      })
      .then((res) => {
        console.log(res)
        alert('Successfully voted')
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <p>Vote</p>
      <p>Candidates:</p>
      <div className="flex flex-col gap-2">
        {candidates.length === 0 ? (
          <p>There are no candidates available...</p>
        ) : (
          <>
            {candidates.map((candidate, index) => (
              <div key={index} className="flex items-center">
                <input
                  id={candidate.id}
                  value={candidate.id}
                  type="radio"
                  onChange={(e) => setSelected(e.target.value)}
                  checked={selectedCandidate === candidate.id}
                />
                <label htmlFor={candidate.id}>{candidate.name}</label>
              </div>
            ))}
            <button
              onClick={handleVote}
              className="bg-blue-500 text-white py-2 px-4"
            >
              Vote
            </button>
          </>
        )}
      </div>
    </div>
  )
}
