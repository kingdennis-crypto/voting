import { handleAuth, getAccessToken,  } from '@auth0/nextjs-auth0'

export const GET = async function token(req: Request) {
  const token = await getAccessToken()
  console.log(token.accessToken)
  return Response.json({ token: token.accessToken })
}
