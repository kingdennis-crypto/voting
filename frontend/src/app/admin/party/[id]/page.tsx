'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

type Param = { params: { id: string } }

export default function AdminPartyDetail({ params }: Param) {
  const [party, setParties] = useState<any>()

  useEffect(() => {
    axios
      .get(`http://localhost:5050/parties/${params.id}`)
      .then((res) => {
        setParties(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [params.id])

  return (
    <div>
      {party ? (
        <>
          <p>{party.id}</p>
          <p>{party.name}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
