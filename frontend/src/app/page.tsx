import RequestHelper from '@/utils/helpers/request'
import { RequestObject } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'

// async function getData(): Promise<RequestObject> {
//   const res = await RequestHelper.makeRequest('/config/organisations', 'GET')
//   return res.data as RequestObject
// }

export default async function Home() {
  // const data = await getData()

  return (
    <main>
      <p>Hello</p>
      <a href={'/api/auth/login'}>Login</a>
    </main>
  )
}
