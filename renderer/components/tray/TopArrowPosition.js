// Packages
import electron from 'electron'
import { PureComponent } from 'react'

class TopArrowPosition extends PureComponent {
  state = {
    left: 0,
  }

  remote = electron.remote || false

  componentDidMount() {
    // Calculate top arrow position once in the beginning
    this.tryPosition()

    // And then every 500 milliseconds
    setInterval(() => {
      this.tryPosition()
    }, 500)
  }

  tryPosition() {
    if (!this.remote) {
      return
    }

    if (!this.remote.process || !this.remote.getCurrentWindow) {
      return
    }

    const currentWindow = this.remote.getCurrentWindow()
    const tray = this.remote.getGlobal('tray')

    if (!currentWindow || !tray) {
      return
    }

    // Center the caret unter the tray icon
    const windowBounds = currentWindow.getBounds()
    this.position(tray, windowBounds)
  }

  position(tray, windowBounds) {
    const trayBounds = tray.getBounds()

    const trayCenter = trayBounds.x + trayBounds.width / 2
    const windowLeft = windowBounds.x

    const arrowLeft = trayCenter - windowLeft - 26 / 2

    this.setState({
      left: arrowLeft,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.left === prevState.left) {
      return
    }

    if (!this.remote) {
      return
    }

    const currentWindow = this.remote.getCurrentWindow()
    const size = currentWindow.getSize()

    setTimeout(() => {
      size[1]++
      currentWindow.setSize(...size, true)
    }, 100)

    setTimeout(() => {
      size[1]--
      currentWindow.setSize(...size, true)
    }, 110)
  }

  render() {
    const { children } = this.props
    const { left } = this.state

    return typeof children === 'function' ? children(left) : null
  }
}

export default TopArrowPosition
