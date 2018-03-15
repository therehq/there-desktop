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

export const Following = gql`
  fragment Following on Following {
    id
    photoUrl
    timezone
    city
    ... on User {
      firstName
      lastName
    }
    ... on ManualPlace {
      name
      countryFlag
    }
    ... on ManualPerson {
      firstName
      lastName
    }
  }
`
