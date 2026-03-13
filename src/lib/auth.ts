import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file')
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: 'google'
}

export const signInWithGoogle = async (): Promise<User> => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please check your environment variables.')
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })

    if (error) throw error

    // The user data will be available after redirect
    window.location.href = data.url
    throw new Error('Redirecting to Google for authentication...')
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const signOut = async () => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return
  }

  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (!supabase) {
    return null
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.email!,
      avatar: user.user_metadata?.avatar_url,
      provider: 'google'
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => { } } } }
  }

  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.full_name || session.user.email!,
        avatar: session.user.user_metadata?.avatar_url,
        provider: 'google'
      }
      callback(user)
    } else {
      callback(null)
    }
  })
}
