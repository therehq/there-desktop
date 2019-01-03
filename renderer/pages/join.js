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
import { getPhotoUrl } from '../utils/photo'
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
import FormRow from '../components/form/Row'
import Button from '../components/form/Button'
import Space from '../components/Space'
import ErrorText from '../components/form/ErrorText'
import LocationPicker from '../components/LocationPicker'
import PhotoSelector from '../components/PhotoSelector'
import { FieldWrapper } from '../components/form/Field'
import {
  TwitterButton,
  EmailButton,
  ButtonsStack,
} from '../components/SocialButtons'
import {
  loginByEmail,
  uploadManualPhotoFile,
  loginAnonymously,
} from '../utils/api'
import ButtonWrapper from '../components/form/ButtonWrapper'

class Join extends Component {
  constructor(props) {
    super(props)
    this.io = null
  }

  state = {
    signInMethod: null, // twitter | email | anonymous
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
    emailSecurityCode: '',
    emailVerified: null,

    // Anonymous Login
    loggingInAnonymously: false,
    anonymousLoginDone: null,

    // Profile
    firstName: null,
    lastName: null,
    photo: null,
  }

  renderSignInMethods() {
    const { sendingEmail, sendEmailError, emailError } = this.state

    return (
      <div>
        {this.state.signInError && (
          <Desc fullWidth>
            There was an issue while signing in. 🙏 Try again please!
          </Desc>
        )}

        {this.state.signInMethod === 'anonymous' &&
        this.state.loggingInAnonymously ? (
          <div>
            <StatusMessage>
              <span>Preparing the app...</span>
            </StatusMessage>
          </div>
        ) : this.state.signInLoading ? (
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
        ) : this.state.signInMethod === 'email' ? (
          <div>
            <form onSubmit={this.emailSignInFormSubmitted}>
              <Input
                innerRef={r => {
                  r && r.focus()
                }}
                disabled={sendingEmail}
                fullWidth={true}
                required={true}
                aria-label="Email"
                style={{ textAlign: 'center' }}
                placeholder="you@domain.com"
                value={this.state.email}
                onChange={this.emailChanged}
              />
            </form>
            <Space height={8} />
            <LinksStack>
              {sendingEmail
                ? 'Sending verification email... '
                : sendEmailError
                  ? `${sendEmailError} `
                  : emailError
                    ? 'Please use a real email! '
                    : '↑ Enter your email '}
              (
              <TinyLink
                href="#"
                onClick={() =>
                  this.setState({
                    signInMethod: null,
                    email: '',
                    sendingEmail: false,
                    sendEmailError: null,
                  })
                }
              >
                change method
              </TinyLink>)
            </LinksStack>
          </div>
        ) : this.state.socketReady ? (
          <Fragment>
            <ButtonsStack>
              <TwitterButton center onClick={this.twitterButtonClicked} />
              <Space height={10} />
              <EmailButton center onClick={this.emailButtonClicked} />
            </ButtonsStack>
            <Space height={8} />
            <LinksStack>
              <TinyLink href="#" onClick={this.goLoginAnonymously}>
                Or continue anonymously
              </TinyLink>
              <TinyCircle />
              {/* <TinyLink
                href="#"
                onClick={() => this.setState({ showWhySignIn: true })}
              >
                Why sign up?
              </TinyLink>
              <TinyCircle /> */}
              <TinyLink
                href="#"
                onClick={() =>
                  electron.shell.openExternal('https://there.team/privacy')
                }
              >
                Privacy
              </TinyLink>
            </LinksStack>
          </Fragment>
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
              Our ambition is more than a simple timezone app, and for the extra
              functionality, we need cloud authorization.
            </Desc>
            <Desc style={{ marginTop: 10, marginBottom: 10 }}>
              There uses secure servers to keep your followings time up to date
              (that enables ✈️ auto-update of people's time). There will be a
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
                <Desc
                  style={{ marginTop: 10, marginBottom: 30 }}
                  smaller={true}
                >
                  By signing in, your friends can add you easily and when you’re
                  travelling your time auto-updates for them! 👇{' '}
                </Desc>
                <Space fillVertically />
                {this.renderSignInMethods()}
              </div>
            </div>
          </Center>
        )}
      </Fragment>
    )
  }

  renderVerify() {
    const { emailSecurityCode, email, signingUp, signInError } = this.state
    return signInError ? (
      <Center>
        <Desc style={{ marginTop: 110 }}>
          Our API couldn't log in to the account, please try logging in again (
          <TinyLink
            href="#"
            onClick={() =>
              this.setState({ emailSent: null, signInError: null })
            }
          >
            go back
          </TinyLink>)
        </Desc>
      </Center>
    ) : (
      <Center>
        <Desc style={{ marginTop: 110 }}>
          We've sent a verification email to (<Highlight>{email}</Highlight>)
          please follow the instructions in the email. (
          <TinyLink href="#" onClick={() => this.setState({ emailSent: null })}>
            undo
          </TinyLink>)
        </Desc>
        <SecurityCode>{emailSecurityCode}</SecurityCode>
        <WaitingMessage>
          {signingUp
            ? 'Verified! Preparing your account...'
            : 'Waiting for the verification ...'}
        </WaitingMessage>
      </Center>
    )
  }

  renderProfile() {
    const {
      photo,
      firstName,
      lastName,
      savingProfile,
      profileError,
    } = this.state

    return (
      <Center>
        <Heading>👤</Heading>
        <Heading>What's your name?</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          Set your name so your friends can add you. We use Gravatar for your
          photo, but you can also upload a photo here.
        </Desc>
        <Center>
          <PersonStackWrapper>
            <PhotoWrapper>
              <PhotoSelector
                uploading={photo && photo.uploading}
                photoUrl={photo && photo.photoUrl}
                onAccept={this.photoAccepted}
              />
            </PhotoWrapper>
            <PersonForm onSubmit={this.profileSubmitted}>
              <FormRow>
                <Input
                  required={true}
                  style={{ maxWidth: 115 }}
                  placeholder="First Name"
                  value={firstName || ''}
                  onChange={this.firstNameChanged}
                />
                <Input
                  style={{ maxWidth: 115 }}
                  placeholder="Last Name"
                  value={lastName || ''}
                  onChange={this.lastNameChanged}
                />
              </FormRow>

              <ButtonWrapper isHidden={!firstName}>
                {profileError && <ErrorText>🤔 Try again please!</ErrorText>}
                <Button primary disabled={photo && photo.uploading}>
                  {savingProfile ? 'Saving...' : 'Next →'}
                </Button>
              </ButtonWrapper>
            </PersonForm>
          </PersonStackWrapper>
        </Center>
      </Center>
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
        <Center>
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
        </Center>
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
    const {
      hasLocation,
      enteredEmail,
      signedIn,
      skippedLocation,
      signInMethod,
      emailSent,
      emailVerified,
      profileSaved,
    } = this.state

    if (signInMethod === 'email' && emailSent && !emailVerified) {
      return <Fragment>{this.renderVerify()}</Fragment>
    } else if (!signedIn) {
      return <Fragment>{this.renderSignIn()}</Fragment>
    } else if (!profileSaved) {
      return <Fragment>{this.renderProfile()}</Fragment>
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
      console.log('Socket for auth disconnected:', err)
      Raven.captureException(err)
    })
    this.socket.on('signingup', () => {
      this.setState({ signingUp: true })
      console.log('Signing you up for the first time')
    })
    this.listenForEvents()
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
    const {
      hasLocation,
      enteredEmail,
      signedIn,
      skippedLocation,
      profileSaved,
      signInMethod,
    } = this.state

    // Close window automatically if anonymous successful
    if (signedIn && signInMethod === 'anonymous') {
      showMainWhenReady()
      closeWindow()
    }

    // Close window automatically if it's just a login
    if (
      signedIn &&
      profileSaved &&
      (hasLocation || skippedLocation) &&
      enteredEmail
    ) {
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
    const { photoUrl, photoCloudObject, twitterHandle } = user

    // Check if we have any photo
    const generatedPhotoUrl = getPhotoUrl({
      photoUrl,
      photoCloudObject,
      twitterHandle,
    })

    const profileSaved = Boolean(user.firstName)

    const newState = {
      enteredEmail: !!user.email,
      hasLocation:
        Boolean(user.city) &&
        Boolean(user.timezone) &&
        Boolean(user.fullLocation),
      profileSaved,
    }

    if (user.firstName) {
      newState.firstName = user.firstName
    }

    if (user.lastName) {
      newState.lastName = user.lastName
    }

    if (generatedPhotoUrl && (this.state.photo == null || profileSaved)) {
      newState.photo = {
        photoUrl: generatedPhotoUrl,
        photoCloudObject,
      }
    }

    return newState
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
    }
  }

  emailChanged = e => {
    this.setState({
      email: e.target.value,
      emailError: null,
      sendEmailError: null,
    })
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

    try {
      const data = await this.props.updateEmail({ newEmail: email })

      if (data.updateUser == null) {
        throw new Error(
          `There's already an account with that email, consider logging out and signing in by email!`
        )
      }

      this.setState({ submittedEmail: true })
    } catch (err) {
      this.setState({ submittedEmail: false, emailError: err.message })
    }

    return false
  }

  profileSubmitted = async e => {
    e.preventDefault()
    const { firstName, lastName, photo } = this.state

    let profile = {
      firstName,
      lastName,
      fullName: `${firstName}${lastName ? ` ${lastName}` : ''}`,
    }

    if (photo) {
      profile.photoUrl = photo.photoUrl
      profile.photoCloudObject = photo.photoCloudObject
    }

    try {
      this.setState({ savingProfile: true })
      await this.props.updateProfile(profile)
      this.setState({ savingProfile: false, profileSubmitted: true })
    } catch (err) {
      this.setState({ savingProfile: false, profileError: err.message })
    }

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

  firstNameChanged = e => {
    this.setState({ firstName: e.target.value })
  }

  lastNameChanged = e => {
    this.setState({ lastName: e.target.value })
  }

  // When an image file dropped
  photoAccepted = async file => {
    // Activate the spinner
    this.setState({
      photo: {
        uploading: true,
        photoUrl: file.preview,
      },
    })

    try {
      const result = await uploadManualPhotoFile(file)
      const body = await result.json()

      // Do not change photo if user has cleared the photo
      // or used Twitter while we were uploading
      if (result.ok && this.state.photo.photoUrl !== '') {
        this.setState({
          photo: {
            photoUrl: body.publicUrl,
            photoCloudObject: body.object,
            uploading: false,
          },
        })
      }
    } catch (err) {
      console.log(err)
      this.setState({ photo: null })
    }
  }

  saveLocation = () => {
    const { place } = this.state
    if (place && place.placeId) {
      this.props.updateLocation({ placeId: place.placeId })
    }
  }

  goLoginAnonymously = async () => {
    // Let's create a new anonymous user
    this.setState({
      signInMethod: 'anonymous',
      loggingInAnonymously: true,
    })

    try {
      // TODO: check these variables
      const res = await loginAnonymously()

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const { user, token } = await res.json()

      setUserAndToken({ user, token })

      // it was successful
      this.setState({
        signedIn: true,
        loggingInAnonymously: false,
        anonymousLoginDone: true,

        // Fake a successful sign in to skip these steps
        profileSaved: true,
        skippedLocation: true,
        enteredEmail: true,
      })
    } catch (err) {
      console.log(err)
      this.setState({ signInError: err })
    }
  }

  emailSignInFormSubmitted = async e => {
    e.preventDefault()
    const { email } = this.state

    // Validate email
    if (!email || !email.includes('@') || !email.includes('.')) {
      this.setState({
        emailError: 'Please use a real email! 🙂',
      })
      return false
    }

    this.signInByEmail()
    return false
  }

  signInByEmail = async () => {
    // Let's send the email
    this.setState({ sendingEmail: true })

    try {
      // TODO: check these variables
      const res = await loginByEmail(this.state.email, this.socket.id)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const { sent, message, securityCode } = await res.json()

      if (!sent) {
        throw new Error(message)
      }

      this.setState({
        emailSecurityCode: securityCode,
        emailSent: true,
        sendingEmail: false,
      }) // it was successful
    } catch (err) {
      console.log(err)
      this.setState({ sendEmailError: err, sendingEmail: false })
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
  }

  listenForEvents = () => {
    this.socket.on('signin-succeeded', ({ jwtToken: token, user }) => {
      // Save user
      setUserAndToken({ user, token })
      this.props.refetch({ skipCache: true })
      this.setState({
        signedIn: true,
        signInLoading: false,
        signingUp: false,
        // If method was email
        emailVerified: true,
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
        emailSent: false,
      })
    })
  }
}

const UpdateProfile = mutation(gql`
  mutation(
    $firstName: String
    $lastName: String
    $fullName: String
    $photoUrl: String
    $photoCloudObject: String
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      fullName: $fullName
      photoUrl: $photoUrl
      photoCloudObject: $photoCloudObject
    ) {
      ...User
    }
  }
  ${User}
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
    cache: false,
    query: GetUser,
    mutation: {
      updateEmail: UpdateEmail,
      updateLocation: UpdateLocation,
      updateProfile: UpdateProfile,
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
  justify-content: ${p => p.align || 'center'};
  align-items: center;
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
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
  animation: ${fadeIn} forwards 500ms ease-out;
`

const Highlight = styled.span`
  color: #555;
`

const SecurityCode = styled.div`
  padding: 10px 0;
  margin: 25px auto;
  max-width: 320px;
  letter-spacing: 1px;
  font-weight: 600;
  color: #667;
  background: #f1f1f1;
`

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`

const WaitingMessage = styled(Desc)`
  animation: ${blink} infinite 2.7s ease-out;
  cursor: progress;
`

const PersonStackWrapper = styled.div`
  display: flex;
  max-width: 300px;

  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
`

const PersonForm = styled.form`
  display: block;
  flex: 1 1 auto;
`

const PhotoWrapper = styled.div`
  flex: 0 0 auto;
  margin-right: 18px;
  margin-top: -2px;
`
