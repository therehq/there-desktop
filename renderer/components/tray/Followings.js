import React from 'react'
import { ConnectHOC, query } from 'urql'

// Utitlies
import gql from '../../utils/graphql/gql'
import { isOnline } from '../../utils/online'

// Local
import Following from './Following'

class Followings extends React.Component {
  render() {
    const { data, loaded } = this.props
    console.log('rerendered.')
    return (
      loaded &&
      data.followingList.map(({ id, photoUrl, ...f }) => (
        <Following key={id} photo={photoUrl} {...f} />
      ))
    )
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loaded !== newProps.loaded && isOnline()) {
      this.props.refetch({ skipCache: true })
      console.log('refetch')
    }
  }
}

const FollowingList = query(gql`
  query {
    followingList {
      id
      photoUrl
      timezone
      city
      ... on User {
        firstName
        lastName
      }
    }
  }
`)

export default ConnectHOC({
  query: FollowingList,
})(Followings)
