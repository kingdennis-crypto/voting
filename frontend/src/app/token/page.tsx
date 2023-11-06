import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function TokenPage() {
  const { accessToken } = await getAccessToken()

  return (
    <div>
      <p>TOKEN!</p>

      <p>{accessToken ? accessToken : 'null'}</p>
    </div>
  )
}
