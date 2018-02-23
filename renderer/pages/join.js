// Electron
import { shell } from 'electron'

// Modules
import React, { Component } from 'react'
import styled from 'styled-components'

// Local
import { apiUrl } from '../utils/config'
import provideTheme from '../utils/styles/provideTheme'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import Desc from '../components/window/Desc'
import { TwitterButton } from '../components/SocialButtons'
import Input from '../components/form/Input'
import Button from '../components/form/Button'
import LocationPicker from '../components/join/LocationPicker'

class Join extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    signInloading: false,
    signedIn: false,
    hasLocation: false,
    enteredEmail: false,
  }

  renderSignIn() {
    return (
      <Center>
        <Heading>😊</Heading>
        <Heading>Quick Sign in!</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          Signed in users have features like auto cross platform sync
        </Desc>
        {this.state.signInloading ? (
          'Checking...'
        ) : (
          <TwitterButton onClick={this.twitterButtonClicked} />
        )}
      </Center>
    )
  }

  renderLocation() {
    return (
      <Center>
        <Heading>⛺️ + ⏰</Heading>
        <Heading>Where are you?</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          We determine timezone based on your location.<br />You can update it
          later or auto-update when travelling
        </Desc>
        <LocationPicker />
        <FieldWrapper moreTop={true}>
          <Button>Save</Button>
        </FieldWrapper>
      </Center>
    )
  }

  renderEmail() {
    return (
      <Center>
        <Heading>💌</Heading>
        <Heading>How to reach you?</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }} id="email-desc">
          A not-official newsletter for links, huge updates, personal notes. No
          more than once per week. Unsubscribe anytime!
        </Desc>
        <Input
          big={true}
          aria-label="Email"
          aria-describedBy="email-desc"
          type="email"
          style={{ minWidth: 230, textAlign: 'center' }}
          placeholder="name@domain.com"
        />
        <FieldWrapper moreTop={true}>
          <Button>Done</Button>
        </FieldWrapper>
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
    const { hasLocation, enteredEmail, signedIn } = this.state
    if (!signedIn) {
      return this.renderSignIn()
    } else if (!hasLocation) {
      return this.renderLocation()
    } else if (!enteredEmail) {
      return this.renderEmail()
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

  twitterButtonClicked = () => {
    this.signIn()
  }

  signIn = () => {
    shell.openExternal(`${apiUrl}/auth/twitter`)
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

const FieldWrapper = styled.div`
  margin-top: ${p => (p.moreTop ? '22px' : '12px')};
`
