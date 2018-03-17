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
    followingList: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
    onItemContextMenu: PropTypes.func,
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
      <Subscribe
        to={[SortModeContainer]}
        children={sortMode => this.renderContent(sortMode)}
      />
    )
  }

  renderList() {
    const { user, onItemContextMenu } = this.props
    // We are not directly using followingList from props,
    // It is updated in state whenever necessary
    const { followingList } = this.state

    return (
      followingList &&
      followingList.map(({ id, __typename, ...f }, i) => {
        const itemProps = {
          key: id,
          index: i,
          userCity: user && user.city,
          userTimezone: user && user.timezone,
          noBorder: i === followingList.length - 1,
          onContextMenu: e => onItemContextMenu(id, __typename, e),
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
    return (
      <DragDropContext onDragEnd={this.dragEnded} onDragStart={sortMode.enable}>
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef} style={{ paddingTop: 0 }}>
              {this.renderList()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  dragEnded = result => {
    // Dropped outside the list
    if (!result.destination) {
      // Later, we can prompt for remove
      return
    }

    const reorderedList = this.reorder(
      this.state.followingList,
      result.source.index,
      result.destination.index
    )

    // Persist the change locally for opimistic update
    this.setState({ followingList: reorderedList })
  }

  componentWillReceiveProps(newProps) {
    const { followingList: comingList } = newProps
    this.setState({ followingList: comingList })
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }
}

export default SortableFollowings
