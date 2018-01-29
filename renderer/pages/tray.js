// Native
import { ipcRenderer } from 'electron'

// Modules
import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'

import theme from '../utils/theme'
import Popover from '../components/Popover'
import Toolbar from '../components/Toolbar'
import Person from '../components/Person'
import JoinBox from '../components/JoinBox'
import ErrorBoundary from '../components/ErrorBoundary'

class Index extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <Popover>
            <Layout>
              <PeopleScrollWrapper>
                <Person />
                <Person
                  photo="/static/demo/phil.jpg"
                  hour={1}
                  minute={10}
                  timezone="GMT +1:00"
                  name="Phil"
                  city="London"
                  day="Tue"
                />
                <Person noBorder={true} />
              </PeopleScrollWrapper>
              <JoinBox />
              <Toolbar onHelpClick={this.helpClicked} />
            </Layout>
          </Popover>
        </ErrorBoundary>
      </ThemeProvider>
    )
  }

  helpClicked = () => {
    ipcRenderer.send('open-chat')
  }
}

export default Index

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
