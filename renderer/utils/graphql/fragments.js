import gql from './gql'

export const User = gql`
  fragment User on User {
    id
    email
    city
    timezone
    firstName
    lastName
    twitterHandle
    photoUrl
  }
`
