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
    photoCloudObject
  }
`

export const Following = gql`
  fragment Following on Following {
    id
    photoUrl
    photoCloudObject
    timezone
    city
    fullLocation
    ... on User {
      firstName
      lastName
      twitterHandle
    }
    ... on ManualPlace {
      name
      countryFlag
    }
    ... on ManualPerson {
      firstName
      lastName
      twitterHandle
    }
  }
`

export const Person = gql`
  fragment Person on Following {
    id
    photoUrl
    photoCloudObject
    timezone
    city
    fullLocation
    ... on User {
      firstName
      lastName
      twitterHandle
    }
    ... on ManualPerson {
      firstName
      lastName
    }
  }
`

export const Place = gql`
  fragment Place on Following {
    id
    photoUrl
    photoCloudObject
    timezone
    city
    fullLocation
    ... on ManualPlace {
      name
      countryFlag
    }
  }
`
