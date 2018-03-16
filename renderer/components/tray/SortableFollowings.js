import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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

    const list =
      followingList &&
      followingList.map(({ id, photoUrl, __typename, ...f }, i) => (
        <Draggable key={i} draggableId={i} index={i}>
          {(provided, snapshot) => (
            <Fragment>
              <Following
                innerRef={provided.innerRef}
                isDragging={snapshot.isDragging}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                key={id}
                index={i}
                photo={photoUrl}
                userCity={user && user.city}
                userTimezone={user && user.timezone}
                noBorder={i === followingList.length - 1}
                onContextMenu={e => onItemContextMenu(id, __typename, e)}
                {...f}
              />
              {provided.placeholder}
            </Fragment>
          )}
        </Draggable>
      ))

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef}>
              {list}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

export default SortableFollowings
