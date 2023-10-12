import RequestHelper from '@/utils/helpers/request'
import { RequestObject } from '@/utils/types'
import Image from 'next/image'

async function getData(): Promise<RequestObject> {
  const res = await RequestHelper.makeRequest('/config/organisations', 'GET')
  return res.data as RequestObject
}

export default async function Home() {
  const data = await getData()

  return (
    <main>
      <p>Hello</p>
      <p>{JSON.stringify(data.payload)}</p>
    </main>
  )
}
