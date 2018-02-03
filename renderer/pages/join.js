// Modules
import React, { Component } from 'react'
import styled from 'styled-components'

import provideTheme from '../utils/provideTheme'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import Desc from '../components/window/Desc'
import { TwitterButton } from '../components/SocialButtons'
import Select from '../components/form/Select'
import Button from '../components/form/Button'

class Join extends Component {
  state = {
    signedIn: true,
    hasTimezone: false,
  }

  renderSignIn() {
    return (
      <Center>
        <Heading>😊</Heading>
        <Heading>Sign in quickly!</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          Signed in users have features like auto cross platform sync
        </Desc>
        <TwitterButton />
      </Center>
    )
  }

  renderTimezone() {
    return (
      <Center>
        <Heading>⏰</Heading>
        <Heading>Select your timezone</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          You can update it later or auto-update when travelling
        </Desc>
        <Select style={{ minWidth: 230 }}>
          <option>+3:30 UTC - Tehran</option>
        </Select>
        {/* <Button>Done</Button> */}
      </Center>
    )
  }

  renderAlreadyIn() {
    return (
      <Center>
        <Heading>🙌</Heading>
        <Heading>You're already in, my friend!</Heading>
      </Center>
    )
  }

  renderContent() {
    const { hasTimezone, signedIn } = this.state
    if (!signedIn) {
      return this.renderSignIn()
    } else if (signedIn && !hasTimezone) {
      return this.renderTimezone()
    } else {
      return this.renderAlreadyIn()
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <WindowWrapper flex={true}>
          <TitleBar />
          <SafeArea>
            <FlexWrapper>{this.renderContent()}</FlexWrapper>
          </SafeArea>
        </WindowWrapper>
      </ErrorBoundary>
    )
  }
}

export default provideTheme(Join)

const FlexWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`

const Center = styled.div`
  text-align: center;

  svg {
    fill: blue;
  }
`
