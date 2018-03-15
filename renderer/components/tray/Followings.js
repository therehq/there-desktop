import electron from 'electron'
import React, { Fragment } from 'react'
import { ConnectHOC, query, mutation } from 'urql'

// Utitlies
import gql from '../../utils/graphql/gql'
import { Following as FollowingFragment } from '../../utils/graphql/fragments'
import Following from './Following'
import { isOnline } from '../../utils/online'

// Local
import AddFirstOne from '../AddFirstOne'

class Followings extends React.Component {
  render() {
    const { data, loaded } = this.props
    const showAddFirst = this.shouldShowAddFirst()

    return (
      <Fragment>
        {loaded &&
          data.followingList.map(({ id, photoUrl, __typename, ...f }, i) => (
            <Following
              key={id}
              index={i}
              photo={photoUrl}
              userCity={data.user && data.user.city}
              userTimezone={data.user && data.user.timezone}
              onContextMenu={e => this.showContextMenu(id, __typename, e)}
              {...f}
            />
          ))}
        {showAddFirst && <AddFirstOne onAddClick={this.openAddWindow} />}
      </Fragment>
    )
  }

  componentDidMount() {
    const ipc = electron.ipcRenderer || false

    if (!ipc) {
      return
    }

    ipc.on('remove-following', (event, following) => {
      this.followingRemoved(following)
    })
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
    const sender = electron.ipcRenderer || false
    if (!sender) {
      return
    }

    sender.send('open-add')
  }

  followingRemoved = following => {
    const { id, __typename } = following

    switch (__typename) {
      case 'User':
        this.props.unfollow({ userId: id })
        return

      case 'ManualPerson':
        this.props.removeManualPerson({ id })
        return

      case 'ManualPlace':
        this.props.removeManualPlace({ id })
        return
    }
  }

  showContextMenu = (id, __typename, event) => {
    const { clientX: x, clientY: y } = event
    const sender = electron.ipcRenderer || false

    if (!sender) {
      return
    }

    sender.send('open-following-menu', { id, __typename }, { x, y })
  }
}

const FollowingList = query(gql`
  query {
    user {
      id
      city
      timezone
    }
    followingList {
      ...Following
    }
  }
  ${FollowingFragment}
`)

const Unfollow = mutation(gql`
  mutation($userId: ID!) {
    unfollow(userId: $userId) {
      ...Following
    }
  }
  ${FollowingFragment}
`)

const RemoveManualPerson = mutation(gql`
  mutation($id: ID!) {
    removeManualPerson(id: $id) {
      ...Following
    }
  }
  ${FollowingFragment}
`)

const RemoveManualPlace = mutation(gql`
  mutation($id: ID!) {
    removeManualPlace(id: $id) {
      ...Following
    }
  }
  ${FollowingFragment}
`)

export default ConnectHOC({
  query: FollowingList,
  mutation: {
    unfollow: Unfollow,
    removeManualPerson: RemoveManualPerson,
    removeManualPlace: RemoveManualPlace,
  },
})(Followings)
