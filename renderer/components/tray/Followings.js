import { ipcRenderer } from 'electron'
import React, { Fragment } from 'react'
import { ConnectHOC, query } from 'urql'

// Utitlies
import gql from '../../utils/graphql/gql'
import { isOnline } from '../../utils/online'

// Local
import Following from './Following'
import AddFirstOne from '../AddFirstOne'

class Followings extends React.Component {
  render() {
    const { data, loaded } = this.props
    const showAddFirst = this.shouldShowAddFirst()

    return (
      <Fragment>
        {loaded &&
          data.followingList.map(({ id, photoUrl, ...f }) => (
            <Following key={id} photo={photoUrl} {...f} />
          ))}
        {showAddFirst && <AddFirstOne onAddClick={this.openAddWindow} />}
      </Fragment>
    )
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loaded !== newProps.loaded && isOnline()) {
      this.props.refetch({ skipCache: true })
    }
  }

  shouldShowAddFirst = () => {
    const { data, loaded } = this.props
    if (!loaded) {
      return false
    }

    if (data.followingList.length === 0) {
      return true
    } else if (
      data.followingList.length === 1 &&
      data.followingList[0].id === data.user.id
    ) {
      return true
    }

    return false
  }

  openAddWindow = () => {
    const sender = ipcRenderer || false
    if (!sender) {
      return
    }

    sender.send('open-add')
  }
}

const FollowingList = query(gql`
  query {
    user {
      id
    }
    followingList {
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
      }
      ... on ManualPerson {
        firstName
        lastName
      }
    }
  }
`)

export default ConnectHOC({
  query: FollowingList,
})(Followings)
