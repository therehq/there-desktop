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
    countryFlagIcon
    ... on User {
      firstName
      lastName
      twitterHandle
    }
    ... on ManualPlace {
      name
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
    countryFlagIcon
    ... on User {
      firstName
      lastName
      twitterHandle
    }
    ... on ManualPerson {
      firstName
      lastName
      twitterHandle
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
    countryFlagIcon
    ... on ManualPlace {
      name
      countryFlag
    }
  }
`
