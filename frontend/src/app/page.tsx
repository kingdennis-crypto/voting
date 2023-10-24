'use client'

import { useConfig } from '@/utils/context/config.context'
import RequestHelper from '@/utils/helpers/request'
import { RequestObject } from '@/utils/types'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { getSession } from '@auth0/nextjs-auth0'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const { user } = useUser()
  const { isInitialised } = useConfig()

  const [amount, setAmount] = useState<number>(10_000)

  const initialiseData = () => {
    axios
      .post('http://localhost:5050/config/initialized', { amount })
      .then((res) => {
        console.log(res.data.payload)
        alert('Successfully initialised the blockchain')
        router.refresh()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <main>
      {isInitialised ? (
        <>
          <p>Hello</p>
          <div className="flex flex-col gap-2">
            {user ? (
              <a className="px-4 py-2 border-2 border-gray-500" href="/admin">
                Go to admin page
              </a>
            ) : (
              <a
                className="px-4 py-2 border-2 border-gray-500"
                href={'/api/auth/login'}
              >
                Login
              </a>
            )}
            <a className="px-4 py-2 border-2 border-gray-500" href="/vote">
              Vote
            </a>
          </div>
        </>
      ) : (
        <>
          <p>Initialise data</p>
          <button onClick={initialiseData}>Initialize</button>
        </>
      )}
    </main>
  )
}
