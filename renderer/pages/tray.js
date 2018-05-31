import React, { Component } from 'react'
import styled from 'styled-components'
import { Provider as UnstatedProvider } from 'unstated'

// Local
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import Popover from '../components/Popover'
import Toolbar from '../components/Toolbar'
import ErrorBoundary from '../components/ErrorBoundary'
import { LoggedInProvider } from '../components/LoggedIn'
import Followings from '../components/tray/Followings'
import DetectTimezone from '../components/DetectTimezone'

class Tray extends Component {
  render() {
    return (
      <ErrorBoundary>
        <LoggedInProvider>
          <UnstatedProvider>
            <Popover>
              <Layout>
                <Followings />
                <Toolbar />
              </Layout>
            </Popover>
            <DetectTimezone />
          </UnstatedProvider>
        </LoggedInProvider>
      </ErrorBoundary>
    )
  }
}

export default provideTheme(provideUrql(Tray))

// Styles
const Layout = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
`
