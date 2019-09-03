import electron from 'electron'
import { Component } from 'react'
import styled from 'styled-components'

// Local
import PinnedFollowing from '../Following/PinnedFollowing'

export default class Pinneds extends Component {
  ipc = electron.ipcRenderer || false

  render() {
    const { pinnedList, user } = this.props

    if (!pinnedList || pinnedList.length === 0) {
      return null
    }

    return (
      <Wrapper>
        {pinnedList.map((pinned, index) => (
          <PinnedWrapper key={pinned.id}>
            <PinnedFollowing
              {...pinned}
              index={index}
              userCity={user && user.city}
              userTimezone={user && user.timezone}
              onContextMenu={e =>
                this.onItemContextMenu(pinned.id, pinned.__typename, e)
              }
            />
          </PinnedWrapper>
        ))}
      </Wrapper>
    )
  }

  componentDidMount() {
    if (!this.ipc) {
      return
    }

    this.ipc.on('rerender', this.rerender)
  }

  componentWillUnmount() {
    if (!this.ipc) {
      return
    }

    this.ipc.removeListener('rerender', this.rerender)
  }

  rerender = () => {
    this.forceUpdate()
  }

  onItemContextMenu = (id, __typename, event) => {
    const { clientX: x, clientY: y } = event

    if (!this.ipc) {
      return
    }

    this.ipc.send(
      'open-following-menu',
      { id, __typename, pinned: true },
      { x, y }
    )
  }
}

// Styles
const Wrapper = styled.div`
  flex: 0 0 auto;

  display: flex;
  justify-content: center;
  padding: 10px ${p => p.theme.sizes.sidePadding + 2}px 10px;
  box-sizing: border-box;

  border-radius: 5px 5px 0 0;
  border-bottom: 1px solid ${p => p.theme.colors.lighter};
  background: ${p => p.theme.colors.light};
`

const PinnedWrapper = styled.div`
  min-width: 66px;
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }
`
