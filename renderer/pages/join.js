// Packages
import electron from 'electron'
import React, { Component, Fragment } from 'react'
import { ConnectHOC, mutation, query } from 'urql'
import styled, { keyframes } from 'styled-components'
import compose from 'just-compose'
import compare from 'just-compare'
import io from 'socket.io-client'
import Raven from 'raven-js'

// Utilities
import config from '../../config'
import { isLoggedIn, setUserAndToken } from '../utils/auth'
import {
  closeWindowAndShowMain,
  showMainWhenReady,
  closeWindow,
} from '../utils/windows/helpers'
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import { User } from '../utils/graphql/fragments'
import gql from '../utils/graphql/gql'

// Local
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import ConnectionBar from '../components/window/ConnectionBar'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import Desc from '../components/window/Desc'
import Input from '../components/form/Input'
import Button from '../components/form/Button'
import Space from '../components/Space'
import ErrorText from '../components/form/ErrorText'
import LocationPicker from '../components/LocationPicker'
import { FieldWrapper } from '../components/form/Field'
import {
  TwitterButton,
  EmailButton,
  ButtonsStack,
} from '../components/SocialButtons'

class Join extends Component {
  constructor(props) {
    super(props)
    this.io = null
  }

  state = {
    signInMethod: null,
    signInError: null,
    signInLoading: false,
    signedIn: false,
    hasLocation: false,
    submittedEmail: false,
    enteredEmail: false,
    socketReady: false,
    signingUp: false,
    // Data
    showWhySignIn: false,
    skippedLocation: false,
    emailError: null,
    email: '',
    place: null,

    // Email Login
    sendingEmail: false,
    sendEmailError: null,
    emailSent: null,
  }

  renderSignInMethods() {
    return (
      <div>
        {this.state.signInError && (
          <p>There was an issue in sign in. 🙏 Try again please!</p>
        )}
        {this.state.signInLoading ? (
          <div>
            <StatusMessage>
              {this.state.signingUp ? (
                'Preparing your account...'
              ) : (
                <span>
                  Waiting for Twitter... (<TinyLink
                    onClick={this.twitterButtonClicked}
                  >
                    reload
                  </TinyLink>)
                </span>
              )}
            </StatusMessage>
          </div>
        ) : this.state.socketReady ? (
          <ButtonsStack>
            <TwitterButton center onClick={this.twitterButtonClicked} />
            <Space height={10} />
            <EmailButton center onClick={this.emailButtonClicked} />
          </ButtonsStack>
        ) : (
          <ButtonsStack>
            <Button style={{ padding: '10px 15px' }} disabled={true}>
              Connecting to server...
            </Button>
          </ButtonsStack>
        )}
      </div>
    )
  }

  renderSignIn() {
    const { showWhySignIn } = this.state
    return (
      <Fragment>
        {showWhySignIn ? (
          <Center>
            <Heading>💡 Why accounts?</Heading>
            <Desc style={{ marginTop: 25 }}>
              Our abition is more than a simple timezone app, and for the extra
              functionality, we have to have cloud authorization.
            </Desc>
            <Desc style={{ marginTop: 10, marginBottom: 10 }}>
              There uses secure servers to keep your followings time up to date.
              (that enables ✈️ auto-update of people's time) There will be a
              mobile app soon as well.
            </Desc>
            <Desc style={{ marginTop: 10, marginBottom: 40 }}>
              We DO NOT store any other data from your account like Twitter
              followings or your tweets, as we don't need them at all.
            </Desc>
            <Button
              onClick={() => {
                this.setState({ showWhySignIn: false })
              }}
            >
              ← Back
            </Button>
          </Center>
        ) : (
          <Center>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                margin: '40px auto',
              }}
            >
              <div style={{ marginLeft: -12, marginRight: 17 }}>
                <ScreenshotImage
                  src="/static/photos/screenshot.png"
                  style={{ display: 'block', width: 240, height: 320.5 }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  minHeight: 270,
                  marginBottom: 27,
                }}
              >
                <Heading style={{ marginTop: 20 }}>Hey There!</Heading>
                <Desc style={{ marginTop: 10, marginBottom: 30 }}>
                  To start using the app, sign in by Twitter or enter your
                  email:{' '}
                </Desc>
                <Space fillVertically />
                {this.renderSignInMethods()}
                <Space height={8} />
                <Agreement>
                  By using There you agree to our{' '}
                  <TinyLink
                    href="#"
                    onClick={() =>
                      electron.shell.openExternal('https://there.pm/terms')
                    }
                  >
                    Terms
                  </TinyLink>
                </Agreement>
                <LinksStack>
                  <TinyLink
                    href="#"
                    onClick={() => this.setState({ showWhySignIn: true })}
                  >
                    Why sign up?
                  </TinyLink>
                  <TinyCircle />
                  <TinyLink
                    href="#"
                    onClick={() =>
                      electron.shell.openExternal('https://there.pm/privacy')
                    }
                  >
                    Privacy
                  </TinyLink>
                </LinksStack>
              </div>
            </div>
          </Center>
        )}
      </Fragment>
    )
  }

  renderLocation() {
    const { fetching } = this.props
    const { place } = this.state
    const placePicked = place !== null
    return (
      <Center>
        <Heading>⏰</Heading>
        <Heading>Time</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          We determine timezone based on your location.<br />You can update it
          or auto-update when travelling, and change privacy settings later in
          the app.
        </Desc>
        <div>
          {placePicked ? (
            <FieldWrapper moreTop={true}>
              <p onClick={this.clearPlace}>{place.description}</p>
            </FieldWrapper>
          ) : (
            <Fragment>
              <FieldWrapper moreTop={true}>
                <LocationPicker
                  grabFocusOnRerender={true}
                  onPick={this.placePicked}
                />
              </FieldWrapper>
            </Fragment>
          )}
        </div>
        {placePicked && (
          <FieldWrapper moreTop={true}>
            <Button onClick={this.clearPlace} disabled={fetching}>
              Edit
            </Button>&nbsp;
            <Button onClick={this.saveLocation} disabled={fetching}>
              {fetching ? '...' : 'Save'}
            </Button>
          </FieldWrapper>
        )}
      </Center>
    )
  }

  renderEmail() {
    const { fetching } = this.props
    const { emailError } = this.state
    return (
      <Center>
        <Heading>💌</Heading>
        <Heading>Email</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }} id="email-desc">
          I may email you rarely for important security notes. (This isn't the
          newsletter)
        </Desc>
        <form onSubmit={this.emailFormSubmitted}>
          <Input
            big={true}
            required={true}
            aria-label="Email"
            aria-describedby="email-desc"
            style={{ minWidth: 230, textAlign: 'center' }}
            placeholder="name@domain.com"
            value={this.state.email}
            onChange={this.emailChanged}
          />
          {emailError && (
            <p>
              <ErrorText>{emailError}</ErrorText>
            </p>
          )}
          <FieldWrapper moreTop={true}>
            <Button disabled={fetching}>{fetching ? '...' : 'Done'}</Button>
          </FieldWrapper>
        </form>
      </Center>
    )
  }

  renderAlreadyIn() {
    return (
      <Center>
        <Heading>🙌</Heading>
        <Heading>You're in, my friend!</Heading>
        <FieldWrapper moreTop={true}>
          <Button onClick={this.closeWindow}>Close this window</Button>
        </FieldWrapper>
      </Center>
    )
  }

  renderContent() {
    const { hasLocation, enteredEmail, signedIn, skippedLocation } = this.state

    if (!signedIn) {
      return <Fragment>{this.renderSignIn()}</Fragment>
    } else if (!hasLocation && !skippedLocation) {
      return <Fragment>{this.renderLocation()}</Fragment>
    } else if (!enteredEmail) {
      return <Fragment>{this.renderEmail()}</Fragment>
    } else {
      return <Fragment>{this.renderAlreadyIn()}</Fragment>
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <WindowWrapper flex={true}>
          <ConnectionBar />
          <TitleBar>Welcome to There!</TitleBar>
          <SafeArea>
            <FlexWrapper>{this.renderContent()}</FlexWrapper>
          </SafeArea>
        </WindowWrapper>
      </ErrorBoundary>
    )
  }

  componentWillMount() {
    this.setState({ signedIn: isLoggedIn() })
  }

  componentDidMount() {
    this.socket = io(config.apiUrl, {
      secure: true,
      rejectUnauthorized: false,
      transports: ['websocket', 'polling'],
    })
    this.socket.on('connect', () => this.setState({ socketReady: true }))
    this.socket.on('error', err => {
      console.log('Socket for Twitter auth disconnected:', err)
      Raven.captureException(err)
    })
    this.socket.on('signingup', () => {
      this.setState({ signingUp: true })
      console.log('Signing you up for the first time')
    })
  }

  componentWillReceiveProps({ loaded, data }) {
    if (data && data.user) {
      const sender = electron.ipcRenderer || false

      if (!sender) {
        return
      }

      if (
        this.state.signInMethod === 'twitter' &&
        this.props.data &&
        this.props.loaded === loaded &&
        this.props.data.user.email !== data.user.email
      ) {
        // Email mututation finished and it is
        // successfully submitted. Only for Twitter method, since
        // in the email method, we set email in the 1st step, not last
        this.setState({ enteredEmail: true })
        closeWindowAndShowMain()
        return
      }

      if (this.props.data && !compare(data.user, this.props.data.user)) {
        sender.send('reload-main')
      }

      this.setState(this.getNewStateBasedOnUser(data.user))
    }
  }

  componentDidUpdate() {
    const { hasLocation, enteredEmail, signedIn, skippedLocation } = this.state

    // Close window automatically if it's just a login
    if (signedIn && (hasLocation || skippedLocation) && enteredEmail) {
      showMainWhenReady()
      closeWindow()
    }
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  getNewStateBasedOnUser = user => {
    return {
      enteredEmail: !!user.email,
      hasLocation:
        Boolean(user.city) &&
        Boolean(user.timezone) &&
        Boolean(user.fullLocation),
    }
  }

  closeWindow = () => {
    closeWindowAndShowMain()
  }

  twitterButtonClicked = () => {
    if (this.socket) {
      this.setState({ signInMethod: 'twitter' })
      this.signInByTwitter()
    }
  }

  emailButtonClicked = () => {
    if (this.socket) {
      this.setState({ signInMethod: 'email' })
      // this.signInByEmail()
    }
  }

  emailChanged = e => {
    this.setState({ email: e.target.value, emailError: null })
  }

  emailFormSubmitted = async e => {
    e.preventDefault()
    const { email } = this.state

    // Validate email
    if (!email || !email.includes('@') || !email.includes('.')) {
      this.setState({
        emailError: 'Please use a real email! 🙂',
      })
      return false
    }

    await this.props.updateEmail({ newEmail: email })
    this.setState({ submittedEmail: true })
    return false
  }

  placePicked = place => {
    this.setState({ place })
  }

  clearPlace = () => {
    this.setState({ place: null })
  }

  skipLocation = () => {
    this.setState({ skippedLocation: true })
  }

  saveLocation = () => {
    const { place } = this.state
    if (place && place.placeId) {
      this.props.updateLocation({ placeId: place.placeId })
    }
  }

  signInByEmail = async () => {
    // Let's send the email
    this.setState({ sendingEmail: true })

    try {
      // TODO: check these variables
      const { sent, message } = await this.props.sendLoginEmail({
        email: this.state.email,
      })

      if (!sent) {
        this.setState({ sendEmailError: new Error(message) })
      }

      this.setState({ emailSent: true }) // it was successful
    } catch (err) {
      this.setState({ sendEmailError: err })
    }
  }

  signInByTwitter = () => {
    this.setState({
      signInLoading: true,
      signingUp: false,
      signInError: false,
    })
    // Open sign in by Twitter
    electron.shell.openExternal(
      `${config.apiUrl}/auth/twitter?socketId=${this.socket.id}`
    )
    // Listen for the token
    this.socket.on('signin-succeeded', ({ jwtToken: token, user }) => {
      // Save user
      setUserAndToken({ user, token })
      this.props.refetch({ skipCache: true })
      this.setState({
        signedIn: true,
        signInLoading: false,
        signingUp: false,
        // Skip email and location steps if
        // user has already filled them in
        ...this.getNewStateBasedOnUser(user),
      })
    })
    // Or failure!
    this.socket.on('signin-failed', () => {
      console.log('SignIn failed :(')
      this.setState({
        signInLoading: false,
        signingUp: false,
        signInError: true,
      })
    })
    // Or disconnected?
    this.socket.on('disconnect', () => {
      this.setState({
        signInLoading: false,
        signingUp: false,
        socketReady: false,
      })
    })
  }
}

const SendLoginEmail = mutation(gql`
  mutation($email: String) {
    sendLoginEmail(email: $email) {
      sent
      message
    }
  }
`)

const UpdateEmail = mutation(gql`
  mutation($newEmail: String) {
    updateUser(email: $newEmail) {
      ...User
    }
  }
  ${User}
`)

const UpdateLocation = mutation(gql`
  mutation($placeId: ID!) {
    updateLocationAndTimezone(placeId: $placeId) {
      ...User
    }
  }
  ${User}
`)

const GetUser = query(gql`
  query {
    user {
      ...User
    }
  }
  ${User}
`)

export default compose(
  ConnectHOC({
    query: GetUser,
    mutation: {
      updateEmail: UpdateEmail,
      updateLocation: UpdateLocation,
      sendLoginEmail: SendLoginEmail,
    },
  }),
  provideUrql,
  provideTheme
)(Join)

// STYLES
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

const TinyLink = styled.a`
  display: inline-block;
  font-size: inherit;
  color: #668;
  text-decoration: none;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    text-decoration: underline #abc;
    text-decoration-skip: ink;
  }
`

const TinyCircle = styled.span`
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
  margin: 0 5px;
  vertical-align: middle;
`

const LinksStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  opacity: 0.7;
`

const Agreement = styled.div`
  display: inline-block;
  font-size: 11px;
  color: #777;
  text-decoration: none;
  text-align: center;
  margin-bottom: 7px;
  margin-top: 1px;
  opacity: 0.7;
`

const StatusMessage = styled(Desc)`
  color: #666;
`

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const ScreenshotImage = styled.img`
  opacity: 0;
  animation: ${fadeIn} forwards 700ms 100ms ease-out;
`
