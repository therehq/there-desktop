import React from 'react'
import PropTypes from 'prop-types'

// Utitlies
import Following from './Following'

class SortableFollowings extends React.Component {
  static propTypes = {
    followingList: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
    onItemContextMenu: PropTypes.func,
  }

  static defaultProps = {
    onItemContextMenu: () => {},
  }

  render() {
    const { followingList, user, onItemContextMenu } = this.props

    return (
      followingList &&
      followingList.map(({ id, photoUrl, __typename, ...f }, i) => (
        <Following
          key={id}
          index={i}
          photo={photoUrl}
          userCity={user && user.city}
          userTimezone={user && user.timezone}
          onContextMenu={e => onItemContextMenu(id, __typename, e)}
          {...f}
        />
      ))
    )
  }
}

export default SortableFollowings
