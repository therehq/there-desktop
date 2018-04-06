import { Client } from 'urql'

// Local
import config from '../../../config'
import { electronStoreCache } from './cache'
import { getHeaders } from '../api'

export const client = new Client({
  url: config.graphqlEndpoint,
  fetchOptions: () => ({ headers: getHeaders(`application/json`) }),
  cache: electronStoreCache(),
})
