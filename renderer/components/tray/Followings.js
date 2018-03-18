import React from 'react'
import { ConnectHOC, query } from 'urql'
import { Subscribe } from 'unstated'

// Utilities
import gql from '../../utils/graphql/gql'
import { isOnline } from '../../utils/online'
import { sortKeys } from './SortModeContainer'
import { Person, Place } from '../../utils/graphql/fragments'

// Local
import SortModeContainer from './SortModeContainer'
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
    console.log('Followings is getting new props', newProps)
    if (
      this.props.fetching !== newProps.fetching &&
      newProps.fetching === false
    ) {
      this.props.sortMode.followingsFetched()
    }

    if (this.props.loaded !== newProps.loaded && isOnline()) {
      this.props.refetch({ skipCache: true })
    }
  }

  shouldComponentUpdate(newProps) {
    if (newProps.fetching === true) {
      return false
    }

    return true
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

const EnhancedFollowing = ConnectHOC({
  query: FollowingList,
  shouldInvalidate(...p) {
    console.log('invlaidate???', ...p)
    return true
  },
})(Followings)

const FollowingsWithSortMode = props => (
  <Subscribe
    to={[SortModeContainer]}
    children={sortMode => <EnhancedFollowing {...props} sortMode={sortMode} />}
  />
)

export default FollowingsWithSortMode
