import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Subscribe } from 'unstated'

// Utitlies
import Following from './Following'

// Local
import SortModeContainer from './SortModeContainer'

class SortableFollowings extends React.Component {
  static propTypes = {
    followingsList: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
    sortKey: PropTypes.string.isRequired,
    onItemContextMenu: PropTypes.func,
  }

  static defaultProps = {
    onItemContextMenu: () => {},
  }

  render() {
    return (
      <Subscribe
        to={[SortModeContainer]}
        children={sortMode => this.renderContent(sortMode)}
      />
    )
  }

  renderList(sortedFollowingList, sortModeEnabled) {
    const { followingsList, user, onItemContextMenu } = this.props
    // We will not directly use followingsList from props
    // in sort mode, it is sorted in the state
    const list = sortedFollowingList || followingsList

    return (
      list &&
      list.map(({ id, __typename, ...f }, i) => {
        const itemProps = {
          key: id,
          index: i,
          userCity: user && user.city,
          userTimezone: user && user.timezone,
          isUserItSelf: user && user.id === id,
          noBorder: i === followingsList.length - 1,
          sortMode: sortModeEnabled,
          // Don't allow actions while sorting,
          // cause we won't update the temperary list
          // in the SortModeContainer
          onContextMenu: sortModeEnabled
            ? undefined
            : e => onItemContextMenu(id, __typename, e),
          ...f,
        }

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
                  {...itemProps}
                />
                {provided.placeholder}
              </Fragment>
            )}
          </Draggable>
        )
      })
    )
  }

  renderContent(sortMode) {
    const { sortKey } = this.props

    return (
      <DragDropContext
        onDragEnd={(...p) => this.dragEnded(sortMode, sortKey, ...p)}
      >
        <Droppable droppableId="droppable">
          {provided => (
            <div
              ref={provided.innerRef}
              style={{ paddingTop: 0, flex: '1 1 auto' }}
            >
              {this.renderList(
                sortMode.getList(sortKey),
                sortMode.state.enabled
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  dragEnded = (sortMode, sortKey, result) => {
    // Dropped outside the list
    if (!result.destination) {
      // Later, we can prompt for remove
      return
    }

    // Enable sortMode state to change
    // the toolbar buttons below
    sortMode.enable()

    const reorderedList = this.reorder(
      sortMode.getList(sortKey) || this.props.followingsList,
      result.source.index,
      result.destination.index
    )

    // Persist the change locally for opimistic update
    sortMode.setList(sortKey, reorderedList)
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }
}

export default SortableFollowings
