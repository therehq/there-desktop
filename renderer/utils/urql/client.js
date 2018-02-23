import { Client } from 'urql'

// Local
import { electronStoreCache } from './cache'
import { graphqlEndpoint as url } from '../config'

export const client = new Client({
  url,
  cache: electronStoreCache(),
})
