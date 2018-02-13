// Modules
import React, { Component } from 'react'
import styled from 'styled-components'

import firebase from '../utils/firebase'
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
        <Heading>Sign in quickly!</Heading>
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

  componentDidMount() {
    this.checkRedirectResults()
  }

  //////////// Event Handleres
  twitterButtonClicked = () => {
    this.signIn()
  }
  //\\\\\\\\\\ Event Handlers

  //////////// Helpers
  normalizeSignInResults = result => {
    const { additionalUserInfo: { profile } } = result
    const hasPhoto = !profile.default_profile_image
    let photoURL = (result.user.photoURL || '').replace('normal', '80x80')

    return {
      displayName: result.user.displayName,
      photoURL,
      hasPhoto,
      twitter: {
        timezone: profile.time_zone,
      },
    }
  }
  //\\\\\\\\\\ Helpers

  //////////// Actions
  signIn = () => {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  signInSucceeded = result => {
    const user = this.normalizeSignInResults(result)
    console.log('Normalized sign in data:', user)
    this.setState({ signedIn: true })
  }

  checkRedirectResults = async () => {
    // Activate loading
    this.setState({ signInloading: true })

    try {
      const result = await firebase.auth().getRedirectResult()
      console.log('Singed In User Details: ', result)

      if (result.user) {
        this.signInSucceeded(result)
      }
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log('Sign In failed with code', errorCode, ' ->', errorMessage)
    } finally {
      this.setState({ signInloading: false })
    }
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
