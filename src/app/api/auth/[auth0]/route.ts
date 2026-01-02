import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0'

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      connection: 'wechat', // WeChat connection in Auth0
    },
    returnTo: '/auth/auth0-callback',
  }),
  callback: handleCallback({
    afterCallback: async (req, session) => {
      // Session will be used in our custom callback to sync with Supabase
      return session
    },
  }),
})
