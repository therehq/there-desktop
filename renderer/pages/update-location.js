import { Component } from 'react'
import styled, { css } from 'styled-components'
import { Connect, mutation, query } from 'urql'
import Raven from 'raven-js'

// Utilities
import gql from '../utils/graphql/gql'
import { closeWindowAndShowMain, reloadMain } from '../utils/windows/helpers'

// Local
import provideTheme from '../utils/styles/provideTheme'
import provideUrql from '../utils/urql/provideUrql'
import ErrorBoundary from '../components/ErrorBoundary'
import WindowWrapper from '../components/window/WindowWrapper'
import ConnectionBar from '../components/window/ConnectionBar'
import SafeArea from '../components/window/SafeArea'
import Heading from '../components/window/Heading'
import Desc from '../components/window/Desc'
import Button from '../components/form/Button'
import Label from '../components/form/Label'
import ErrorText from '../components/form/ErrorText'
import LocationPicker from '../components/LocationPicker'
import NotificationBox from '../components/NotificationBox'
import { FieldWrapper } from '../components/form/Field'
import { StyledButton } from '../components/Link'

class EditLocationPage extends Component {
  render() {
    return (
      <ErrorBoundary>
        <WindowWrapper flex={true}>
          <ConnectionBar />
          <SafeArea>{this.renderPage()}</SafeArea>
        </WindowWrapper>
      </ErrorBoundary>
    )
  }

  renderPage() {
    return (
      <Aligner align="left" centerVertically={true} style={{ marginLeft: 25 }}>
        <Heading secondary={true} style={{ marginTop: 0 }}>
          🗺 Update Location
        </Heading>
        <Desc
          fullWidth={true}
          style={{ marginTop: 10, marginBottom: 30 }}
          id="email-desc"
        >
          Your timezone will be updated for users following you!
        </Desc>
        <UpdateLocationForm />
        <UpdatePolicy />
      </Aligner>
    )
  }
}

const emptyPlaceState = {
  placeInputValue: '',
  placeId: null,
  succeeded: null,
}

class UpdateLocationForm extends Component {
  state = {
    placeInputValue: '',
    placeId: null,
    succeeded: null,
    locationError: null,
  }

  render() {
    const { placeInputValue, placeId, succeeded, locationError } = this.state

    return (
      <Connect mutation={{ updateLocation: UpdateLocation }}>
        {({ fetching, updateLocation }) => (
          <div>
            <form onSubmit={e => this.locationSaved(e, updateLocation)}>
              <LocationPicker
                style={{ minWidth: 230, textAlign: 'left' }}
                inputValue={placeInputValue}
                onInputValueChange={this.placeInputValueChanged}
                onPick={this.placePicked}
              />
              <Button
                primary={true}
                disabled={fetching}
                isHidden={!placeId}
                style={{ marginLeft: 10 }}
              >
                {fetching ? 'Saving...' : succeeded ? 'Saved!' : 'Save'}
              </Button>
              {locationError && <ErrorText>{locationError}</ErrorText>}
            </form>
            <NotificationBox
              visible={!locationError && !fetching && succeeded}
              onCloseClick={this.notifClosed}
            >
              🛩 Location updated!{' '}
              <StyledButton onClick={closeWindowAndShowMain}>
                Close Window
              </StyledButton>
            </NotificationBox>
          </div>
        )}
      </Connect>
    )
  }

  placeInputValueChanged = value => {
    this.setState({
      ...emptyPlaceState,
      placeInputValue: value,
    })
  }

  placePicked = ({ placeId }) => {
    this.setState({ placeId })
  }

  notifClosed = () => {
    this.setState({ succeeded: null })
  }

  locationSaved = async (e, updateLocation) => {
    e.preventDefault()

    const { placeId } = this.state

    if (!placeId) {
      this.setState({
        locationError: 'Please choose again!',
        ...emptyPlaceState,
      })
      return
    }

    try {
      await updateLocation({ placeId })
      this.setState({ succeeded: true, placeInputValue: '' })
      reloadMain()
    } catch (err) {
      console.log(err)
      Raven.captureException(err)
      this.setState({
        locationError: `Couldn't update, please chat with us!`,
        ...emptyPlaceState,
      })
    }

    return false
  }
}

class UpdatePolicy extends Component {
  render() {
    return (
      <div>
        <Connect
          query={User}
          mutation={{ updatePolicy: UpdateShowLocationPolicy }}
          cache={false}
        >
          {({ loaded, data, fetching, updatePolicy }) => {
            if (!loaded || !data) {
              return (
                <FieldWrapper moreTop={true} animation={true}>
                  <Label label="Fetching your current data..." />
                </FieldWrapper>
              )
            }

            if (fetching) {
              return (
                <FieldWrapper moreTop={true} animation={true}>
                  <Label label="Wait..." />
                </FieldWrapper>
              )
            }

            return (
              <div>
                <FieldWrapper
                  moreTop={true}
                  animation={true}
                  animationDelay="300ms"
                >
                  <Label
                    label={`Never show my city to anyone (${data.user.city ||
                      'No city set'})`}
                    checkboxMode={true}
                  >
                    <input
                      type="checkbox"
                      checked={data.user.showLocationPolicy === 'never'}
                      onChange={e => this.policyChanged(e, updatePolicy)}
                    />
                  </Label>
                </FieldWrapper>
              </div>
            )
          }}
        </Connect>
      </div>
    )
  }

  policyChanged = async (e, updatePolicy) => {
    const newPolicy = e.target.checked ? 'never' : 'always'
    await updatePolicy({ newPolicy })
    reloadMain()
  }
}

const UpdateLocation = mutation(gql`
  mutation($placeId: ID!) {
    updateLocationAndTimezone(placeId: $placeId) {
      id
      city
      timezone
    }
  }
`)

const User = query(gql`
  query {
    user {
      id
      city
      fullLocation
      showLocationPolicy
    }
  }
`)

const UpdateShowLocationPolicy = mutation(gql`
  mutation($newPolicy: String) {
    updateUser(showLocationPolicy: $newPolicy) {
      id
      showLocationPolicy
    }
  }
`)

export default provideTheme(provideUrql(EditLocationPage))

const Aligner = styled.div`
  text-align: ${p => p.align || 'unset'};

  ${p =>
    p.centerVertically &&
    css`
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `};
`
