import electron from 'electron'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { ConnectHOC, mutation } from 'urql'

// Utitlies
import config from '../../../config'
import { isOnline } from '../../utils/online'

// Local
import SortableFollowings from './SortableFollowings'

class FollowingsList extends React.Component {
  static propTypes = {
    followingsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortKey: PropTypes.string,
    user: PropTypes.object,
  }

  render() {
    const { followingsList, user, sortKey } = this.props

    return (
      <Fragment>
        <SortableFollowings
          user={user}
          sortKey={sortKey}
          followingsList={followingsList}
          onItemContextMenu={this.onItemContextMenu}
        />
      </Fragment>
    )
  }

  componentDidMount() {
    const ipc = electron.ipcRenderer || false

    if (!ipc) {
      return
    }

    ipc.on('rerender', this.rerender)

    // Listen for followings removal
    ipc.listenerCount('remove-following') === 0 &&
      ipc.on('remove-following', this.followingRemoved)

    ipc.listenerCount('pin-following') === 0 &&
      ipc.on('pin-following', this.followingPinned)

    ipc.listenerCount('unpin-following') === 0 &&
      ipc.on('unpin-following', this.followingUnpinned)
  }

  componentWillUnmount() {
    const ipc = electron.ipcRenderer || false

    if (!ipc) {
      return
    }

    ipc.removeListener('rerender', this.rerender)
    ipc.removeListener('remove-following', this.followingRemoved)
    ipc.removeListener('pin-following', this.followingPinned)
    ipc.removeListener('unpin-following', this.followingUnpinned)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loaded !== newProps.loaded && isOnline()) {
      this.props.refetch({ skipCache: true })
    }
  }

  followingRemoved = (event, following) => {
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

  followingPinned = (event, following) => {
    const { id, __typename } = following

    const limitError = `Sorry, you can pin no more than ${
      config.maxPinLimit
    } people or places to the top.`

    let mutationPromise

    switch (__typename) {
      case 'User':
        mutationPromise = this.props.pinUser({ userId: id })
        break

      case 'ManualPerson':
        mutationPromise = this.props.pinManualPerson({ id })
        break

      case 'ManualPlace':
        mutationPromise = this.props.pinManualPlace({ id })
        break
    }

    mutationPromise.then(data => {
      if (
        !data ||
        !(data.pinUser || data.pinManualPerson || data.pinManualPlace)
      ) {
        alert(limitError)
      }
    })
  }

  followingUnpinned = (event, following) => {
    const { id, __typename } = following

    switch (__typename) {
      case 'User':
        this.props.unpinUser({ userId: id })
        return

      case 'ManualPerson':
        this.props.unpinManualPerson({ id })
        return

      case 'ManualPlace':
        this.props.unpinManualPlace({ id })
        return
    }
  }

  rerender = () => {
    this.forceUpdate()
  }

  onItemContextMenu = (id, __typename, event) => {
    const { clientX: x, clientY: y } = event
    const sender = electron.ipcRenderer || false

    if (!sender) {
      return
    }

    sender.send('open-following-menu', { id, __typename }, { x, y })
  }
}

const Unfollow = mutation(`#graphql
  mutation($userId: ID!) {
    unfollow(userId: $userId) {
      id
    }
  }
`)

const RemoveManualPerson = mutation(`#graphql
  mutation($id: ID!) {
    removeManualPerson(id: $id) {
      id
    }
  }
`)

const RemoveManualPlace = mutation(`#graphql
  mutation($id: ID!) {
    removeManualPlace(id: $id) {
      id
    }
  }
`)

const PinUser = mutation(`#graphql
  mutation($userId: ID!) {
    pinUser(userId: $userId) {
      userId 
    }
  }
`)

const PinManualPerson = mutation(`#graphql
  mutation($id: ID!) {
    pinManualPerson(id: $id) {
      pinned
    }
  }
`)

const PinManualPlace = mutation(`#graphql
  mutation($id: ID!) {
    pinManualPlace(id: $id) {
      pinned
    }
  }
`)

const UnpinUser = mutation(`#graphql
  mutation($userId: ID!) {
    unpinUser(userId: $userId) {
      userId 
    }
  }
`)

const UnpinManualPerson = mutation(`#graphql
  mutation($id: ID!) {
    unpinManualPerson(id: $id) {
      pinned
    }
  }
`)

const UnpinManualPlace = mutation(`#graphql
  mutation($id: ID!) {
    unpinManualPlace(id: $id) {
      pinned
    }
  }
`)

export default ConnectHOC({
  mutation: {
    unfollow: Unfollow,
    removeManualPerson: RemoveManualPerson,
    removeManualPlace: RemoveManualPlace,

    pinUser: PinUser,
    pinManualPerson: PinManualPerson,
    pinManualPlace: PinManualPlace,

    unpinUser: UnpinUser,
    unpinManualPerson: UnpinManualPerson,
    unpinManualPlace: UnpinManualPlace,
  },
})(FollowingsList)
