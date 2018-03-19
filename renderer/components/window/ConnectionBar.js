import { Component } from 'react'
import styled, { keyframes } from 'styled-components'

const onLine = typeof navigator !== 'undefined' ? navigator.onLine : true

class ConnectionBar extends Component {
  state = {
    online: onLine,
    show: onLine ? false : true,
  }

  render() {
    const { online, show } = this.state

    return (
      <div>
        {show && (
          <Bar danger={!online} hide={online === true}>
            {online ? ` Connected!` : `You're not online 👀`}
          </Bar>
        )}
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('online', this.onlineStatusChanged)
    window.addEventListener('offline', this.onlineStatusChanged)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.onlineStatusChanged)
    window.removeEventListener('offline', this.onlineStatusChanged)
  }

  onlineStatusChanged = () => {
    this.setState({ online: navigator.onLine, show: true })
  }
}

export default ConnectionBar

const goOut = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -38px, 0); }
`

const comeIn = keyframes`
  to { transform: translate3d(0, 0, 0); }
  from { transform: translate3d(0, -38px, 0); }
`

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  width: 100vw;
  height: 38px;

  text-align: center;
  line-height: 38px;
  font-size: 15px;

  color: white;
  background: ${p => (p.danger ? `#e83365` : '#00c775')};

  animation: ${p =>
    p.hide
      ? `${goOut} 200ms 700ms forwards ease`
      : `${comeIn} 200ms forwards ease`};
`
