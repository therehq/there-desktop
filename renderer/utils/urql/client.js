import { Client } from 'urql'

// Local
import config from '../../../config'
import { electronStoreCache } from './cache'
import { getToken } from '../auth'

export const client = new Client({
  url: config.graphqlEndpoint,
  fetchOptions: () => {
    const token = getToken()
    return {
      headers: {
        'Content-type': 'application/json',
        Authorization: token && `Bearer ${token}`,
      },
    }
  },
  cache: electronStoreCache(),
})
