// Native
import { ipcRenderer } from 'electron'

// Modules
import React, { Component } from 'react'
import styled from 'styled-components'

import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import Popover from '../components/Popover'
import Toolbar from '../components/Toolbar'
import ErrorBoundary from '../components/ErrorBoundary'
import AddFirstOne from '../components/AddFirstOne'
import { LoggedInProvider } from '../components/LoggedIn'

class Index extends Component {
  state = {}

  async componentDidMount() {}

  render() {
    const {} = this.state
    return (
      <ErrorBoundary>
        <LoggedInProvider>
          <Popover>
            <Layout>
              <AddFirstOne />
              <Toolbar
                onHelpClick={this.helpClicked}
                onSettingsClick={this.settingsClicked}
                settingsRef={ref => (this.menu = ref)}
              />
            </Layout>
          </Popover>
        </LoggedInProvider>
      </ErrorBoundary>
    )
  }

  openMenu = () => {
    // The menu toggler element has children
    // we have the ability to prevent the event from
    // bubbling up from those, but we need to
    // use `this.menu` to make sure the menu always gets
    // bounds to the parent
    const { bottom, left, height, width } = this.menu.getBoundingClientRect()
    const sender = ipcRenderer || false

    if (!sender) {
      return
    }

    sender.send('open-menu', { x: left, y: bottom, height, width })
  }

  helpClicked = () => {
    ipcRenderer.send('open-chat')
  }

  settingsClicked = () => {
    this.openMenu()
  }
}

export default provideTheme(provideUrql(Index))

//////////// Styles
const Layout = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
`

const PeopleScrollWrapper = styled.div`
  flex: 1 1 auto;
  width: 100%;
  overflow: auto;
  border-radius: 4px 4px 0 0;

  > *:first-child {
    padding-top: 3px;
  }
`
