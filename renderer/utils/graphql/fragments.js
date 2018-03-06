import gql from './gql'

export const User = gql`
  fragment User on User {
    id
    email
    city
    timezone
    fullLocation
    firstName
    lastName
    twitterHandle
    photoUrl
  }
`
