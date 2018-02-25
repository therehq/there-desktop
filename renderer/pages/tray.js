import React, { Component } from 'react'
import styled from 'styled-components'

// Local
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import Popover from '../components/Popover'
import Toolbar from '../components/Toolbar'
import ErrorBoundary from '../components/ErrorBoundary'
import { LoggedInProvider } from '../components/LoggedIn'
import FollowingsWrapper from '../components/tray/FollowingsWrapper'
import Followings from '../components/tray/Followings'

class Tray extends Component {
  render() {
    return (
      <ErrorBoundary>
        <LoggedInProvider>
          <Popover>
            <Layout>
              <FollowingsWrapper>
                <Followings />
              </FollowingsWrapper>
              <Toolbar />
            </Layout>
          </Popover>
        </LoggedInProvider>
      </ErrorBoundary>
    )
  }
}

export default provideTheme(provideUrql(Tray))

//////////// Styles
const Layout = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
`
