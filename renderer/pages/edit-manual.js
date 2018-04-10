// Packages
import electron from 'electron'
import React, { Component } from 'react'

// Local
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import ConnectionBar from '../components/window/ConnectionBar'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'

// const objectTypes = {
//   Person: 'ManualPerson',
//   Place: 'ManualPlace',
// }

class Add extends Component {
  remote = electron.remote || false

  render() {
    return (
      <ErrorBoundary>
        <WindowWrapper flex={true}>
          <ConnectionBar />
          <TitleBar />
          <SafeArea>In progress edit page.</SafeArea>
        </WindowWrapper>
      </ErrorBoundary>
    )
  }
}

export default provideTheme(provideUrql(Add))
