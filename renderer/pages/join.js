// Modules
import React, { Component } from 'react'
import styled from 'styled-components'

import firebase from '../utils/firebase'
import { timezonesList } from '../utils/timezones/list'
import provideTheme from '../utils/styles/provideTheme'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import Desc from '../components/window/Desc'
import { TwitterButton } from '../components/SocialButtons'
import Input from '../components/form/Input'
import Select from '../components/form/Select'
import Button from '../components/form/Button'

/*








timezone










*/

class Join extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    signedIn: false,
    hasTimezone: false,
    enteredEmail: false,
    timezone: '',
  }

  renderSignIn() {
    return (
      <Center>
        <Heading>😊</Heading>
        <Heading>Sign in quickly!</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          Signed in users have features like auto cross platform sync
        </Desc>
        <TwitterButton onClick={this.twitterButtonClicked} />
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
          {timezonesList.entries().map(([name, value], i) => (
            <option key={value + i} value={value}>
              {name}
            </option>
          ))}
        </Select>
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
    const { hasTimezone, enteredEmail, signedIn } = this.state
    if (!signedIn) {
      return this.renderSignIn()
    } else if (!hasTimezone) {
      return this.renderTimezone()
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

  //////////// Actions
  signIn = () => {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  signInSucceeded = results => {
    const { additionalUserInfo: { profile } } = results
    const hasPhoto = !profile.default_profile_image
    const user = {
      displayName: results.user.displayName,
      photoURL: results.user.photoURL,
      hasPhoto,
      twitter: {
        timezone: profile,
      },
    }
  }

  checkRedirectResults = async () => {
    try {
      const result = await firebase.auth().getRedirectResult()
      console.log(result)
      if (result.user) {
        this.signInSucceeded(result)
      }
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log('Sign In failed with code', errorCode, ' ->', errorMessage)
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
