import electron from 'electron'
import React, { Component } from 'react'
import { ConnectHOC, mutation } from 'urql'

// Utilities
import gql from '../../../utils/graphql/gql'
import { unsplash, toJson } from '../../../utils/unsplash'
import { uploadManualPhotoFile } from '../../../utils/api'
import { closeWindowAndShowMain } from '../../../utils/windows/helpers'

// Local
import { StyledButton } from '../../Link'
import { Center, LinkWrapper } from '../helpers'
import PlaceForm from '../../PlaceForm'
import FlexWrapper from '../../window/FlexWrapper'
import NotificationBox from '../../NotificationBox'
import Heading from '../../window/Heading'
import Desc from '../../window/Desc'

class PlacePage extends Component {
  state = {
    name: '',
    location: null,
    locationInputValue: '',
    nameUsedForLastPhoto: '',

    // Photo
    photo: {},
    photoCloudObject: null, // Only for subitting to API
    uploading: false,
    fetchingUnsplash: false,

    // Operation
    formError: null,
    submitted: false,
  }

  render() {
    const { pageRouter, fetching, error } = this.props
    const {
      name,
      photo,
      uploading,
      fetchingUnsplash,
      locationInputValue,
      formError,
      submitted,
    } = this.state

    return (
      <FlexWrapper>
        <Center>
          <Heading>Add a Place</Heading>
          <Desc style={{ marginTop: 10, marginBottom: 20 }}>
            Your office, home town, a secret vault 🙈, anything!
          </Desc>
        </Center>

        <PlaceForm
          loading={fetching}
          error={formError}
          name={name}
          photo={photo}
          uploading={uploading}
          fetchingUnsplash={fetchingUnsplash}
          locationInputValue={locationInputValue}
          onNameChange={this.nameChanged}
          onLocationPick={this.locationPicked}
          onLocationInputValueChange={this.locationInputValueChanged}
          onPhotoClear={this.photoCleared}
          onUnsplashClick={this.unsplashClicked}
          onPhotoFileAccept={this.photoFileAccepted}
          onFormSubmit={this.formSubmitted}
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
          You can{' '}
          <StyledButton onClick={() => pageRouter.goToSearchUsers()}>
            Search Users
          </StyledButton>{' '}
          or{' '}
          <StyledButton onClick={() => pageRouter.goToSearchUsers()}>
            Add Person
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
        photo: {},
        location: null,
        locationInputValue: '',
        photoCloudObject: null,
      })

      const sender = electron.ipcRenderer || false

      if (!sender) {
        return
      }

      // Refresh the main window to reflect the change
      sender.send('reload-main')
    }
  }

  unsplashClicked = async () => {
    const { name, nameUsedForLastPhoto } = this.state

    this.setState({ fetchingUnsplash: true, photoCloudObject: null })

    // If it's the first time we are trying to get a photo,
    // use query with place name
    if (name !== nameUsedForLastPhoto) {
      const photo = await this.getRandomPhoto(name)
      // Save it only if there was a photo matched the query
      if (photo !== null) {
        this.setState({
          photo: photo,
          nameUsedForLastPhoto: name,
          fetchingUnsplash: false,
        })
        return
      }
    }

    // Get without query
    const photoWOQuery = await this.getRandomPhoto()
    // Save it only if there was a photo
    if (photoWOQuery !== null) {
      this.setState({ photo: photoWOQuery, fetchingUnsplash: false })
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

  photoCleared = () => {
    this.setState({
      photo: {},
      photoCloudObject: null,
      uploading: false,
    })
  }

  // When an image file dropped
  photoFileAccepted = async file => {
    // Activate the spinner
    this.setState({
      uploading: true,
      photo: { url: file.preview },
    })

    try {
      const result = await uploadManualPhotoFile(file)
      const body = await result.json()

      // Do not change photo if user has cleared the photo
      // or used Twitter while we were uploading
      if (result.ok && this.state.photoUrl !== '') {
        this.setState({
          photo: { url: body.publicUrl },
          photoCloudObject: body.object,
          uploading: false,
        })
      }
    } catch (err) {
      console.log(err)
      this.setState({ photo: {}, photoCloudObject: null, uploading: false })
    }
  }

  formSubmitted = e => {
    e.preventDefault()

    const { name, photo, location, photoCloudObject } = this.state
    // Validate data
    if (name.trim() === '' || !location) {
      this.setState({ formError: 'Can you type in again? Thanks!' })
      return
    }

    this.props.addPlace({
      name,
      photoUrl: photo && photo.url,
      photoCloudObject,
      placeId: location.placeId,
    })
    this.setState({ submitted: true })

    // For preventing default
    return false
  }

  getRandomPhoto = async query => {
    try {
      const res = await unsplash.photos
        .getRandomPhoto({
          width: 80,
          height: 80,
          query: query || 'object',
          featured: !query,
        })
        .then(toJson)
      const { urls: { custom: url }, user: { username, name } } = res
      return { url, username, name }
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
  mutation(
    $name: String!
    $placeId: ID!
    $photoUrl: String
    $photoCloudObject: String
  ) {
    addManualPlace(
      name: $name
      placeId: $placeId
      photoUrl: $photoUrl
      photoCloudObject: $photoCloudObject
    ) {
      id
      photoUrl
      photoCloudObject
      timezone
      city
      name
    }
  }
`)

export default ConnectHOC({
  mutation: {
    addPlace: AddPlace,
  },
})(PlacePage)
