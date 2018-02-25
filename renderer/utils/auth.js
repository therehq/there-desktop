// Local
import { getToken } from './store'

export const isLoggedIn = () => getToken() !== null
export { getToken, setToken, setUser, getUser, setUserAndToken } from './store'
