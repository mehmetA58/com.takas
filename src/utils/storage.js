const KEYS = {
  users: 'takasla_users',
  session: 'takasla_session',
  listings: 'takasla_listings',
}

const get = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const getUsers    = ()  => get(KEYS.users, [])
export const saveUsers   = (v) => set(KEYS.users, v)

export const getSession  = ()  => get(KEYS.session, null)
export const saveSession = (v) => set(KEYS.session, v)
export const clearSession = () => localStorage.removeItem(KEYS.session)

export const getListings  = ()  => get(KEYS.listings, [])
export const saveListings = (v) => set(KEYS.listings, v)
