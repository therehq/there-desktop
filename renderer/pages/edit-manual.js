// Packages
import electron from 'electron'
import React, { Component } from 'react'
import styled from 'styled-components'

// Local
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import ConnectionBar from '../components/window/ConnectionBar'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'

// Pages
import Place from '../components/edit/Place'
import Person from '../components/edit/Person'

const objectTypes = {
  Person: 'ManualPerson',
  Place: 'ManualPlace',
}

class Add extends Component {
  remote = electron.remote || false
  currentWindow = this.remote && this.remote.getCurrentWindow()
  customData = this.currentWindow ? this.currentWindow.customData : {}
  objectType = this.customData.__typename
  objectId = this.customData.id

  render() {
    return (
      <ErrorBoundary>
        <WindowWrapper flex={true}>
          <ConnectionBar />
          <TitleBar highlight="light">Edit</TitleBar>
          <SafeArea>
            <Aligner>{this.renderPage()}</Aligner>
          </SafeArea>
        </WindowWrapper>
      </ErrorBoundary>
    )
  }

  renderPage() {
    console.log(this.objectId)
    if (this.objectType === objectTypes.Person) {
      return <Person objectId={this.objectId} />
    } else if (this.objectType === objectTypes.Place) {
      return <Place objectId={this.objectId} />
    }

    return <div />
  }
}

export default provideTheme(provideUrql(Add))

const Aligner = styled.div`
  margin-top: 30px;
`
