import { createClient } from '@supabase/supabase-js'

let supabaseClient = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured')
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Export a getter function instead of the client directly
export const getSupabase = getSupabaseClient

// Auth helpers
export const signUp = async (email, password) => {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const supabase = getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const onAuthStateChange = (callback) => {
  const supabase = getSupabase()
  return supabase.auth.onAuthStateChange(callback);
}

// Real-time subscriptions
export const subscribeToChannel = (channelName, callback) => {
  const supabase = getSupabase()
  return supabase
    .channel(channelName)
    .on('broadcast', { event: '*' }, callback)
    .subscribe();
}

export const broadcastToChannel = async (channelName, event, payload) => {
  const supabase = getSupabase()
  return await supabase
    .channel(channelName)
    .send({
      type: 'broadcast',
      event: event,
      payload: payload,
    });
}

// Real-time PDF processing status
export const subscribeToPdfProcessing = (userId, callback) => {
  const supabase = getSupabase()
  return supabase
    .channel(`pdf-processing-${userId}`)
    .on('broadcast', { event: 'processing-update' }, callback)
    .subscribe();
}

export const sendProcessingUpdate = async (userId, status, message) => {
  return await broadcastToChannel(`pdf-processing-${userId}`, 'processing-update', {
    status,
    message,
    timestamp: new Date().toISOString()
  });
}
