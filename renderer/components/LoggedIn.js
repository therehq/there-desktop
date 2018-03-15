// Native
import electron from 'electron'

// Packages
import React from 'react'
import createReactContext from 'create-react-context'

// Local
import { getToken } from '../utils/store'

const isLoggedInDefault = Boolean(getToken())

const LOGGED_IN_CHANGED_CHANNEL = 'logged-in-changed'

const LoggedInContext = createReactContext(isLoggedInDefault)

class LoggedInProvider extends React.Component {
  mounted = true
  state = { isLoggedIn: isLoggedInDefault }

  componentDidMount() {
    const sender = electron.ipcRenderer || false

    if (!sender) {
      return
    }

    sender.on(LOGGED_IN_CHANGED_CHANNEL, (event, isLoggedIn) => {
      // Prevent preforming setState on the unmounted component
      if (this.mounted) {
        this.setState(() => ({ isLoggedIn }))
      }
    })
  }

  componentWillUnmount() {
    // Flag if we're unmounting
    this.mounted = false
  }

  render() {
    return (
      // Pass the current context value to the Provider's `value` prop.
      // Changes are detected using strict comparison (Object.is)
      <LoggedInContext.Provider value={this.state.isLoggedIn}>
        {this.props.children}
      </LoggedInContext.Provider>
    )
  }
}

const LoggedIn = LoggedInContext.Consumer

export { LoggedInProvider, LoggedIn }
