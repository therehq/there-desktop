import { Client } from 'urql'

// Local
import config from '../../../config'
import { electronStoreCache } from './cache'
import { getToken } from '../auth'

export const client = new Client({
  url: config.graphqlEndpoint,
  fetchOptions: () => ({
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  }),
  cache: electronStoreCache(),
})
