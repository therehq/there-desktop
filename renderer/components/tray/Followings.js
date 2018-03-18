import React from 'react'
import { ConnectHOC, query } from 'urql'

// Utilities
import gql from '../../utils/graphql/gql'
import { isOnline } from '../../utils/online'
import { sortKeys } from './SortModeContainer'
import { Person, Place } from '../../utils/graphql/fragments'

// Local
import FollowingsWrapper from './FollowingsWrapper'
import FollowingsList from './FollowingsList'
import Loading from './Loading'

class Followings extends React.Component {
  render() {
    const { loaded, data } = this.props

    if (!loaded) {
      return <Loading />
    }

    return (
      <FollowingsWrapper>
        <FollowingsList
          user={data.user}
          sortKey={sortKeys.People}
          followingsList={data.followingList.people}
        />
        <FollowingsList
          user={data.user}
          sortKey={sortKeys.Places}
          followingsList={data.followingList.places}
        />
      </FollowingsWrapper>
    )
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loaded !== newProps.loaded && isOnline()) {
      this.props.refetch({ skipCache: true })
    }
  }
}

const FollowingList = query(gql`
  query {
    followingList {
      people {
        ...Person
      }
      places {
        ...Place
      }
    }
    user {
      id
      city
      timezone
    }
  }
  ${Person}
  ${Place}
`)

export default ConnectHOC({
  query: FollowingList,
  shouldInvalidate() {
    return true
  },
})(Followings)
