import electron from 'electron'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { ConnectHOC, mutation } from 'urql'

// Utitlies
import gql from '../../utils/graphql/gql'
import { Following as FollowingFragment } from '../../utils/graphql/fragments'
import { isOnline } from '../../utils/online'

// Local
import AddFirstOne from '../AddFirstOne'
import SortableFollowings from './SortableFollowings'

class FollowingsList extends React.Component {
  static propTypes = {
    followingsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortKey: PropTypes.string,
    user: PropTypes.object,
  }

  render() {
    const { followingsList, user, sortKey } = this.props
    const showAddFirst = this.shouldShowAddFirst(followingsList, user.id)

    return (
      <Fragment>
        <SortableFollowings
          user={user}
          sortKey={sortKey}
          followingsList={followingsList}
          onItemContextMenu={this.onItemContextMenu}
        />
        {showAddFirst && <AddFirstOne onAddClick={this.openAddWindow} />}
      </Fragment>
    )
  }

  componentDidMount() {
    const ipc = electron.ipcRenderer || false

    if (!ipc) {
      return
    }

    ipc.on('rerender', this.rerender)
    if (ipc.listenerCount('remove-following') === 0) {
      ipc.on('remove-following', this.followingRemoved)
    }
  }

  componentWillUnmount() {
    const ipc = electron.ipcRenderer || false

    if (!ipc) {
      return
    }

    ipc.removeListener('rerender', this.rerender)
    ipc.removeListener('remove-following', this.followingRemoved)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loaded !== newProps.loaded && isOnline()) {
      this.props.refetch({ skipCache: true })
    }
  }

  shouldShowAddFirst = (peopleList, userId) => {
    if (!peopleList) {
      return false
    }

    if (peopleList.length === 0) {
      return true
    } else if (peopleList.length === 1 && peopleList[0].id === userId) {
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

const Unfollow = mutation(gql`
  mutation($userId: ID!) {
    unfollow(userId: $userId) {
      id
    }
  }
`)

const RemoveManualPerson = mutation(gql`
  mutation($id: ID!) {
    removeManualPerson(id: $id) {
      id
    }
  }
  ${FollowingFragment}
`)

const RemoveManualPlace = mutation(gql`
  mutation($id: ID!) {
    removeManualPlace(id: $id) {
      id
    }
  }
`)

export default ConnectHOC({
  mutation: {
    unfollow: Unfollow,
    removeManualPerson: RemoveManualPerson,
    removeManualPlace: RemoveManualPlace,
  },
})(FollowingsList)
