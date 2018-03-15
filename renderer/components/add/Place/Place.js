import electron from 'electron'

// Packages
import React, { Component } from 'react'
import { ConnectHOC, mutation } from 'urql'

// Utilities
import gql from '../../../utils/graphql/gql'
import { closeWindowAndShowMain } from '../../../utils/windows/helpers'
import { unsplash, toJson } from '../../../utils/unsplash'

// Local
import { StyledButton } from '../../Link'
import Heading from '../../window/Heading'
import Desc from '../../window/Desc'
import PlaceForm from './PlaceForm'
import { Center, FlexWrapper, LinkWrapper } from '../helpers'
import NotificationBox from '../../NotificationBox'

class PlacePage extends Component {
  state = {
    name: '',
    photoUrl: null,
    location: null,
    locationInputValue: '',
    nameUsedForLastPhoto: '',
    photoRefreshTimes: 0,
    // Operation
    formError: null,
    submitted: false,
  }

  render() {
    const { pageRouter, fetching, error } = this.props
    const {
      name,
      photoUrl,
      photoRefreshTimes,
      locationInputValue,
      formError,
      submitted,
    } = this.state

    return (
      <FlexWrapper>
        <Center>
          <Heading>Add a Place</Heading>
          <Desc style={{ marginTop: 10, marginBottom: 20 }}>
            Your office, home town, farm, a secret vault 🙈, anything!
          </Desc>
        </Center>

        <PlaceForm
          name={name}
          photoUrl={photoUrl}
          photoDisabled={photoRefreshTimes >= 3}
          locationInputValue={locationInputValue}
          onPhotoClick={this.photoClicked}
          onNameChange={this.nameChanged}
          onLocationPick={this.locationPicked}
          onLocationInputValueChange={this.locationInputValueChanged}
          onFormSubmit={this.formSubmitted}
          loading={fetching}
          error={formError}
        />
        <NotificationBox
          visible={!error && !fetching && submitted}
          onCloseClick={this.notifClosed}
        >
          💫 Place added!{' '}
          <StyledButton onClick={this.closeWindow}>Close Window</StyledButton>{' '}
          or add more!
        </NotificationBox>

        <LinkWrapper>
          or{' '}
          <StyledButton onClick={() => pageRouter.goToSearchUsers()}>
            Search Users
          </StyledButton>{' '}
          instead!
        </LinkWrapper>
      </FlexWrapper>
    )
  }

  componentWillReceiveProps({ fetching, error }) {
    // Check if place was added successfully
    if (!error && !fetching && this.state.submitted) {
      this.setState({
        name: '',
        photoUrl: null,
        location: null,
        locationInputValue: '',
      })

      const sender = electron.ipcRenderer || false

      if (!sender) {
        return
      }

      // Refresh the main window to reflect the change
      sender.send('reload-main')
    }
  }

  photoClicked = async () => {
    const { name, nameUsedForLastPhoto, photoRefreshTimes } = this.state

    // Stop if limit is reached
    if (photoRefreshTimes >= 3) {
      return
    }

    // If it's the first time we are trying to get a photo,
    // use query with place name
    if (name !== nameUsedForLastPhoto) {
      const photoWithQuery = await this.getRandomPhoto(name)
      // Save it only if there was a photo matched the query
      if (photoWithQuery !== null) {
        this.setState({
          photoUrl: photoWithQuery,
          nameUsedForLastPhoto: name,
          photoRefreshTimes: photoRefreshTimes + 1,
        })
        return
      }
    }

    // Get without query
    const photoUrlWOQuery = await this.getRandomPhoto()
    // Save it only if there was a photo
    if (photoUrlWOQuery !== null) {
      this.setState({
        photoUrl: photoUrlWOQuery,
        photoRefreshTimes: photoRefreshTimes + 1,
      })
    }
  }

  nameChanged = e => {
    this.setState({ name: e.target.value, error: null })
  }

  locationPicked = place => {
    this.setState({ location: place, error: null })
  }

  locationInputValueChanged = locationInputValue => {
    this.setState({ locationInputValue })
  }

  notifClosed = () => {
    this.setState({ submitted: false })
  }

  formSubmitted = e => {
    e.preventDefault()

    const { name, photoUrl, location } = this.state
    // Validate data
    if (name.trim() === '' || !location) {
      this.setState({ formError: 'Can you type in again? Thanks!' })
      return
    }

    this.props.addPlace({ name, photoUrl, placeId: location.placeId })
    this.setState({ submitted: true })

    // For preventing default
    return false
  }

  getRandomPhoto = async query => {
    try {
      const { urls: { custom } } = await unsplash.photos
        .getRandomPhoto({
          width: 80,
          height: 80,
          query: query || 'object',
          featured: !query,
        })
        .then(toJson)
      return custom
    } catch (e) {
      console.log(e)
      return null
    }
  }

  closeWindow = () => {
    closeWindowAndShowMain()
  }
}

const AddPlace = mutation(gql`
  mutation($name: String!, $placeId: ID!, $photoUrl: String) {
    addManualPlace(name: $name, placeId: $placeId, photoUrl: $photoUrl) {
      id
      name
      timezone
      city
      fullLocation
      photoUrl
    }
  }
`)

export default ConnectHOC({
  mutation: {
    addPlace: AddPlace,
  },
})(PlacePage)
