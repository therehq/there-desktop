import electron from 'electron'
import React, { Component } from 'react'
import { ConnectHOC, mutation, query } from 'urql'

// Utilities
import gql from '../../../utils/graphql/gql'
import { unsplash, toJson } from '../../../utils/unsplash'
import { uploadManualPhotoFile } from '../../../utils/api'
import { showMainWhenReady, closeWindow } from '../../../utils/windows/helpers'

// Local
import { StyledButton } from '../../Link'
import FlexWrapper from '../../window/FlexWrapper'
import PlaceForm from '../../PlaceForm'
import LoadingOverlay from '../LoadingOverlay'
import NotificationBox from '../../NotificationBox'

const initialState = {
  name: '',
  location: null,
  locationInputValue: '',
  nameUsedForLastPhoto: '',

  // Photo
  photo: {},
  photoCloudObject: null, // Only for subitting to API
  uploading: false,
  fetchingUnsplash: false,
}

class PlacePage extends Component {
  state = {
    ...initialState,

    // Operation
    formError: null,
    submitting: false,
    submitted: false,
  }

  render() {
    const { fetching, loaded, error } = this.props
    const {
      name,
      photo,
      uploading,
      fetchingUnsplash,
      locationInputValue,
      formError,
      submitting,
      submitted,
    } = this.state

    return (
      <FlexWrapper>
        {!loaded && <LoadingOverlay />}

        <PlaceForm
          loading={fetching && submitting}
          error={formError}
          name={name}
          photo={photo}
          uploading={uploading}
          fetchingUnsplash={fetchingUnsplash}
          locationInputValue={locationInputValue}
          submitButton="Save"
          onNameChange={this.nameChanged}
          onLocationPick={this.locationPicked}
          onLocationInputValueChange={this.locationInputValueChanged}
          onPhotoClear={this.photoCleared}
          onUnsplashClick={this.unsplashClicked}
          onPhotoFileAccept={this.photoFileAccepted}
          onFormSubmit={this.formSubmitted}
        />

        <NotificationBox
          visible={error && !fetching && submitted}
          onCloseClick={this.notifClosed}
        >
          💫 {String(error)}{' '}
          <StyledButton onClick={() => location.reload()}>Reload</StyledButton>
        </NotificationBox>
      </FlexWrapper>
    )
  }

  componentWillReceiveProps(comingProps) {
    const { data } = comingProps
    if (
      !this.props.data && // Only add on the first load
      data &&
      data.manualPlace
    ) {
      const {
        name,
        photoUrl,
        photoCloudObject,
        fullLocation: locationInputValue,
      } = data.manualPlace

      this.setState({
        name,
        photo: { url: photoUrl },
        photoCloudObject,
        locationInputValue,
      })
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
      this.setState({
        photo: photoWOQuery,
        fetchingUnsplash: false,
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

  formSubmitted = async e => {
    e.preventDefault()

    const { objectId } = this.props
    const { name, photo, location, photoCloudObject } = this.state

    if (!objectId) {
      this.setState({
        formError:
          'We lost which place it was, close the window and try again!',
      })
      return
    }

    // Validate data
    if (name.trim() === '') {
      this.setState({ formError: 'Why no name?' })
      return
    }

    this.setState({ submitting: true })

    try {
      await this.props.updatePlace({
        id: objectId,
        name,
        photoUrl: photo && photo.url,
        photoCloudObject,
        placeId: location && location.placeId,
      })

      this.setState({ ...initialState, submitted: true, submitting: false })
    } catch (err) {
      console.log(err)
      this.setState({ submitting: false })
      return false
    }

    const sender = electron.ipcRenderer || false

    if (!sender) {
      return false
    }

    // Refresh the main window to reflect the change
    sender.send('reload-main')

    showMainWhenReady()
    closeWindow()

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
}

const UpdatePlace = mutation(gql`
  mutation(
    $id: ID!
    $name: String!
    $placeId: ID
    $photoUrl: String
    $photoCloudObject: String
  ) {
    updateManualPlace(
      id: $id
      name: $name
      placeId: $placeId
      photoUrl: $photoUrl
      photoCloudObject: $photoCloudObject
    ) {
      id
      name
      photoUrl
      # None of these are really useful
    }
  }
`)

const GetPlace = gql`
  query($id: ID) {
    manualPlace(id: $id) {
      id
      name
      photoUrl
      photoCloudObject
      fullLocation
    }
  }
`
export default ConnectHOC(({ objectId }) => ({
  query: query(GetPlace, { id: objectId }),
  mutation: {
    updatePlace: UpdatePlace,
  },
  cache: false,
}))(PlacePage)
