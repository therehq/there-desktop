// Electron
import { shell, remote } from 'electron'

// Modules
import React, { Component } from 'react'
import { ConnectHOC, mutation, query } from 'urql'
import styled from 'styled-components'
import io from 'socket.io-client'
import compose from 'just-compose'

// Utils
import { apiUrl } from '../utils/config'
import { isLoggedIn, setUserAndToken, setToken, setUser } from '../utils/auth'
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import { User } from '../utils/graphql/fragments'
import gql from '../utils/graphql/gql'

// Local
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import TitleBar from '../components/window/TitleBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import Desc from '../components/window/Desc'
import Input from '../components/form/Input'
import Button from '../components/form/Button'
import LocationPicker from '../components/join/LocationPicker'
import { TwitterButton } from '../components/SocialButtons'

class Join extends Component {
  constructor(props) {
    super(props)
    this.io = null
  }

  state = {
    signInError: null,
    signInLoading: false,
    signedIn: false,
    hasLocation: true,
    enteredEmail: true,
    // Data
    email: '',
    city: '',
  }

  renderSignIn() {
    return (
      <Center>
        <Heading>😊</Heading>
        <Heading>Quick Sign in!</Heading>
        <Desc style={{ marginTop: 10, marginBottom: 30 }}>
          Signed in users have features like auto cross platform sync
        </Desc>
        {this.state.signInError &&
          `We couldn't verify by Twitter. 🙏 Try again please!`}
        {this.state.signInLoading ? (
          'Waiting for Twitter...'
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
        <form onSubmit={this.emailFormSubmitted}>
          <Input
            big={true}
            required={true}
            aria-label="Email"
            aria-describedby="email-desc"
            type="email"
            style={{ minWidth: 230, textAlign: 'center' }}
            placeholder="name@domain.com"
            value={this.state.email}
            onChange={this.emailChanged}
          />
          <FieldWrapper moreTop={true}>
            <Button>Done</Button>
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

  componentWillMount() {
    this.setState({ signedIn: isLoggedIn() })
  }

  componentDidMount() {
    this.socket = io(apiUrl)
  }

  componentWillReceiveProps({ loaded, data }) {
    if (loaded && data.user) {
      this.setState({ enteredEmail: data.user.email })
    }
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  closeWindow = () => {
    try {
      remote.getCurrentWindow().close()
    } catch (e) {
      console.log(e)
    }
  }

  twitterButtonClicked = () => {
    this.signIn()
  }

  emailChanged = e => {
    this.setState({ email: e.target.value })
  }

  emailFormSubmitted = async e => {
    e.preventDefault()
    await this.props.updateEmail({ newEmail: this.state.email })
    this.setState({ enteredEmail: true })
    return false
  }

  signIn = () => {
    if (this.socket) {
      this.setState({ signInLoading: true })
      // Open sign in by Twitter
      shell.openExternal(`${apiUrl}/auth/twitter?socketId=${this.socket.id}`)
      // Listen for the token
      this.socket.on('signin-succeeded', ({ jwtToken: token, user }) => {
        // Save user
        setUserAndToken({ user, token })
        this.props.refetch({ skipCache: true })
        this.setState({ signedIn: true, signInLoading: false })
      })
      // Or failure!
      this.socket.on('signin-failed', () => {
        console.log('SignIn failed :(')
      })
    }
  }
}

const UpdateEmail = mutation(gql`
  mutation($newEmail: String) {
    updateUser(email: $newEmail) {
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
    mutation: { updateEmail: UpdateEmail },
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

const FieldWrapper = styled.div`
  margin-top: ${p => (p.moreTop ? '22px' : '12px')};
`
