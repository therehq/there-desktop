// Local
import { getToken } from './store'

export const isLoggedIn = () => Boolean(getToken())
export { getToken, setToken, setUser, getUser, setUserAndToken } from './store'
