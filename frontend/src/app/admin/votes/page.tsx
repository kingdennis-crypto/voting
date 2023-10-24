'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

type Data = {
  unusedTokens: number
  voterBalance: number
  totalSupply: number
}

export default function AdminVote() {
  const [data, setData] = useState<Data>()
  const [connection, setConnection] = useState<any>()

  useEffect(() => {
    axios
      .get('http://localhost:5050/votes/data/token')
      .then((res) => {
        console.log(res.data.payload)
        setData(res.data.payload)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:5050/config/connection')
      .then((res) => {
        console.log(res.data.payload.selected)
        setConnection(res.data.payload.selected)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  if (!data || !connection) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <p>Vote selection</p>
      <p>Total supply: {data.totalSupply}</p>
      <p>Unused tokens: {data.unusedTokens}</p>
      <p>
        Voted at{' '}
        <strong>
          {connection.peer}.{connection.organisation}
        </strong>
        : {data.voterBalance}
      </p>
    </div>
  )
}
