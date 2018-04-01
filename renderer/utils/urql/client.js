import { Client } from 'urql'

// Local
import config from '../../../config'
import { electronStoreCache } from './cache'
import { getToken } from '../auth'

export const client = new Client({
  url: config.graphqlEndpoint,
  fetchOptions: () => {
    const headers = {
      'Content-type': 'application/json',
    }

    // Set authorization token if authorized
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return { headers }
  },
  cache: electronStoreCache(),
})
