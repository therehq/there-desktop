// Native
import { ipcRenderer } from 'electron'

// Modules
import React, { Component } from 'react'
import styled from 'styled-components'

import { checkIsAuthorized, anonymousSignIn, getToken } from '../utils/auth'
import provideTheme from '../utils/styles/provideTheme'
import Popover from '../components/Popover'
import Toolbar from '../components/Toolbar'
import ErrorBoundary from '../components/ErrorBoundary'
import AddFirstOne from '../components/AddFirstOne'

class Index extends Component {
  state = {
    isAuthorized: false,
  }

  async componentDidMount() {
    const isAuthorized = checkIsAuthorized()
    this.setState({ isAuthorized: isAuthorized })

    // Sign in anonymously
    if (!isAuthorized) {
      anonymousSignIn()
    }
  }

  render() {
    const { isAuthorized } = this.state
    return (
      <ErrorBoundary>
        <Popover>
          <Layout>
            <AddFirstOne />
            <Toolbar
              isAuthorized={isAuthorized}
              onHelpClick={this.helpClicked}
            />
          </Layout>
        </Popover>
      </ErrorBoundary>
    )
  }

  helpClicked = () => {
    ipcRenderer.send('open-chat')
  }
}

export default provideTheme(Index)

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
