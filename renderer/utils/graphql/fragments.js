import gql from './gql'

export const User = gql`
  fragment User on User {
    id
    email
    city
    firstName
    lastName
    twitterHandle
  }
`
