import { Client } from 'urql'

// Local
import { electronStoreCache } from './cache'
import { graphqlEndpoint as url } from '../config'
import { getToken } from '../auth'

export const client = new Client({
  url,
  fetchOptions: () => ({
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  }),
  cache: electronStoreCache(),
})
