import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from './env'
import { z } from 'zod'

const loginPath = '/auth/login'

const refreshTokenSchema = z.object({
  refreshToken: z.object({
    token: z.string(),
    expiresAt: z.string().transform((value) => new Date(value)),
  }),
  accessToken: z.object({
    token: z.string(),
    expiresAt: z.string().transform((value) => new Date(value)),
  }),
})
type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>
const handleRefreshToken = async (refreshToken: string) => {
  const res = await fetch(`${env.SERVER_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token: refreshToken}),
  })
  const data = await res.json()
  return refreshTokenSchema.parse(data)
}
const clearCookies = (request: NextRequest) => {
  request.cookies.delete('access-token')
  request.cookies.delete('refresh-token')
  request.cookies.delete('expires-at')
}
const setCookies = (response: NextResponse, tokens: RefreshTokenSchema) => {
  response.cookies.set('access-token', tokens.accessToken.token, { expires: tokens.accessToken.expiresAt })
  response.cookies.set('refresh-token', tokens.refreshToken.token, { expires: tokens.refreshToken.expiresAt })
  response.cookies.set('expires-at', tokens.accessToken.expiresAt.toISOString(), { expires: tokens.accessToken.expiresAt })
}
export async function middleware(request: NextRequest) {
  console.log(`middleware: ${new Date().toISOString()}`);
  
  const accessToken = request.cookies.get('access-token')
  const refreshToken = request.cookies.get('refresh-token')
  const expiresAt = request.cookies.get('expires-at')
  const response = NextResponse.next()
  // não tem  access token
  if (!accessToken?.value) {
    // verifica se tem refresh token
    if (!refreshToken?.value) {
      clearCookies(request)
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
    // tem refresh token
    try {
      const tokens = await handleRefreshToken(refreshToken?.value)
      setCookies(response, tokens)
      return response
    } catch {
      clearCookies(request)
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
  }

  // // tem access token, mas expirou
  if (!expiresAt?.value || new Date(expiresAt.value) < new Date()) {
    // verifica se tem refresh token
    if (!refreshToken?.value) {
      clearCookies(request)
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
    try {
      const tokens = await handleRefreshToken(refreshToken?.value)
      setCookies(response, tokens)
      return response
    } catch {
      clearCookies(request)
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
  }
  return response
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ], 
}
