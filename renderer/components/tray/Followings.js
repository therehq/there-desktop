import React from 'react'
import { Connect, query } from 'urql'

// Utilities
import gql from '../../utils/graphql/gql'
import { sortKeys } from './SortModeContainer'
import { Person, Place } from '../../utils/graphql/fragments'

// Local
import FollowingsWrapper from './FollowingsWrapper'
import FollowingsList from './FollowingsList'

class Followings extends React.Component {
  render() {
    return (
      <Connect query={FollowingList}>
        {({ loaded, data }) => {
          return (
            loaded && (
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
          )
        }}
      </Connect>
    )
  }
}

export default Followings

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
