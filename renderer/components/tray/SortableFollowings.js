import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Subscribe } from 'unstated'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// Utitlies
import Following from './Following'

// Local
import SortModeContainer from './SortModeContainer'
import FollowingsWrapper from './FollowingsWrapper'

class SortableFollowings extends React.Component {
  static propTypes = {
    followingList: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
    onItemContextMenu: PropTypes.func,
    onSort: PropTypes.func,
  }

  static defaultProps = {
    onItemContextMenu: () => {},
    onSort: () => {},
  }

  state = {
    followingList: this.props.followingList,
  }

  render() {
    return (
      <FollowingsWrapper>
        <Subscribe
          to={[SortModeContainer]}
          children={sortMode => this.renderContent(sortMode.state.enabled)}
        />
      </FollowingsWrapper>
    )
  }

  renderList(sortMode = false) {
    const { user, onItemContextMenu } = this.props
    // We are not directly using followingList from props,
    // It is updated in state whenever necessary
    const { followingList } = this.state

    return (
      followingList &&
      followingList.map(({ id, __typename, ...f }, i) => {
        const commonProps = {
          key: id,
          index: i,
          userCity: user && user.city,
          userTimezone: user && user.timezone,
          noBorder: i === followingList.length - 1,
          onContextMenu: e => onItemContextMenu(id, __typename, e),
          ...f,
        }

        if (sortMode) {
          // Should be sortable/draggable
          return (
            <Draggable
              disableInteractiveElementBlocking={true}
              key={i}
              draggableId={i}
              index={i}
            >
              {(provided, snapshot) => (
                <Fragment>
                  <Following
                    innerRef={provided.innerRef}
                    isDragging={snapshot.isDragging}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    {...commonProps}
                  />
                  {provided.placeholder}
                </Fragment>
              )}
            </Draggable>
          )
        } else {
          // Without sorting logic
          return <Following {...commonProps} />
        }
      })
    )
  }

  renderContent(sortMode = false) {
    if (sortMode) {
      return (
        <DragDropContext onDragEnd={this.dragEnded}>
          <Droppable droppableId="droppable">
            {provided => (
              <div ref={provided.innerRef} style={{ paddingTop: 0 }}>
                {this.renderList(sortMode)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )
    } else {
      // Normal static list (no dragging)
      return this.renderList(sortMode)
    }
  }

  dragEnded = result => {
    // Dropped outside the list
    if (!result.destination) {
      return
    }

    const reorderedList = this.reorder(
      this.state.followingList,
      result.source.index,
      result.destination.index
    )

    // Call onSort with the reorder list to
    // persist the new order on server
    this.props.onSort(reorderedList)

    // Persist the change locally for opimistic update
    this.setState({ followingList: reorderedList })
  }

  componentWillReceiveProps(newProps) {
    const { followingList: comingList } = newProps
    this.setState({ followingList: comingList })
  }

  isSameFollowingListOrder(list, newList) {
    // Compare two list ids to be in the exact same order
    return newList.reduce((prev, val, i) => prev && val.id === list[i].id, true)
  }

  shouldAcceptComingList = comingList => {
    const { followingList: listInProps } = this.props
    const { followingList: localList } = this.state

    if (!comingList) {
      // Everything is cleared, we have to accept
      // and clear everything
      return true
    }

    if (
      !listInProps ||
      comingList.length !== listInProps.length ||
      comingList.length !== localList.length
    ) {
      // If an item is deleted or added, we should accept and
      // it'd undo any sorting we haven't persisted on the server
      return true
    }

    const hasSameIdsWithLocal = this.isSameFollowingListOrder(
      localList,
      comingList
    )

    console.log('hasSameIdsWithLocal (true) =', hasSameIdsWithLocal)

    if (hasSameIdsWithLocal) {
      // Only update our list if it's order has been changed,
      // in other words, we recieved a new list from the server
      // AND it matches our local change. (as we don't wanna undo
      // user sortings, bad UX)
      return true
      // Otherwise, do not change our list in state which user
      // might have reordered, and hasn't been saved on server yet
    }

    return false
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }
}

export default SortableFollowings
