// Modules
import electron from 'electron'
import debounce from 'just-debounce-it'
import { Component } from 'react'
import { ConnectHOC, mutation } from 'urql'

// Utilities
import gql from '../../../utils/graphql/gql'
import { restEndpoint } from '../../../../config'
import { uploadManualPhotoFile } from '../../../utils/api'
import { closeWindowAndShowMain } from '../../../utils/windows/helpers'

// Local
import { StyledButton } from '../../Link'
import { Center, LinkWrapper } from '../helpers'
import Desc from '../../window/Desc'
import Heading from '../../window/Heading'
import FlexWrapper from '../../window/FlexWrapper'
import PersonForm, { photoModes } from '../../PersonForm'
import NotificationBox from '../../NotificationBox'

const initialState = {
  firstName: '',
  lastName: '',
  twitterHandle: '',
  locationInputValue: '',
  placeId: null,
  timezone: null,

  photoUrl: '',
  photoCloudObject: null,
  uploading: false,
  photoMode: photoModes.UPLOAD,
}

class Person extends Component {
  state = {
    ...initialState,
    submitted: false,
  }

  render() {
    const { pageRouter, fetching, error } = this.props
    const {
      firstName,
      lastName,
      twitterHandle,
      locationInputValue,
      photoUrl,
      uploading,
      photoMode,
      placeId,
      submitted,
    } = this.state

    return (
      <FlexWrapper>
        <Center>
          <Heading>Add a Person</Heading>
          <Desc style={{ marginTop: 10, marginBottom: 20 }}>
            When they don't have There yet, add them here!
          </Desc>
        </Center>

        <PersonForm
          error={error}
          fetching={fetching}
          allowSubmit={firstName && placeId}
          firstName={firstName}
          lastName={lastName}
          twitterHandle={twitterHandle}
          locationInputValue={locationInputValue}
          photoUrl={photoUrl}
          uploading={uploading}
          photoMode={photoMode}
          placeId={placeId}
          onPhotoFileAccept={this.photoFileAccepted}
          onPhotoClear={this.photoCleared}
          onPhotoModeChange={this.photoModeChanged}
          onFirstNameChange={this.firstNameChanged}
          onLastNameChange={this.lastNameChanged}
          onLocationInputValueChange={this.locationInputValueChanged}
          onLocationPick={this.locationPicked}
          onTwitterChange={this.twitterChanged}
          onSubmit={this.submitted}
        />

        <NotificationBox
          visible={!error && !fetching && submitted}
          onCloseClick={() => this.setState({ submitted: false })}
        >
          💫 Added to the list!{' '}
          <StyledButton onClick={this.closeWindow}>Close Window</StyledButton>{' '}
          or add more!
        </NotificationBox>

        <LinkWrapper>
          {' '}
          They have There?
          <StyledButton onClick={pageRouter.goToSearchUsers}>
            Search Users
          </StyledButton>{' '}
          or{' '}
          <StyledButton onClick={pageRouter.goToAddPlace}>
            Add Place
          </StyledButton>{' '}
          instead!
        </LinkWrapper>
      </FlexWrapper>
    )
  }

  firstNameChanged = e => {
    this.setState({ firstName: e.target.value, notFilled: false })
  }

  lastNameChanged = e => {
    this.setState({ lastName: e.target.value })
  }

  locationInputValueChanged = stringValue => {
    this.setState({ locationInputValue: stringValue })
  }

  locationPicked = ({ placeId, timezone }) => {
    this.setState({ placeId, timezone, notFilled: false })
  }

  photoModeChanged = photoMode => {
    this.setState({ photoMode, photoCloudObject: null })
  }

  twitterChanged = e => {
    const twitterHandle = e.target.value
    this.setState({ twitterHandle })
    // Fetch avatar in the background
    this.getAvatar(twitterHandle)
  }

  closeWindow = () => {
    closeWindowAndShowMain()
  }

  getAvatar = debounce(async twitter => {
    if (typeof window === 'undefined' || !twitter) {
      this.setState({ photoUrl: '' })
      return
    }

    const result = await fetch(`${restEndpoint}/twivatar/${twitter}`)

    // Image not found
    if (!result.ok) {
      this.setState({ photoUrl: '' })
      return
    }

    this.setState({ photoUrl: `${restEndpoint}/twivatar/${twitter}` })
  }, 500)

  photoCleared = () => {
    this.setState({
      uploading: false,
      photoCloudObject: null,
      photoUrl: '',
      twitterHandle: '',
    })
  }

  // When an image file dropped
  photoFileAccepted = async file => {
    // Activate the spinner
    this.setState({
      uploading: true,
      photoUrl: file.preview,
      // Disabled Twitter mode if it is enabled
      photoMode: photoModes.UPLOAD,
    })

    try {
      const result = await uploadManualPhotoFile(file)
      const body = await result.json()

      // Do not change photo if user has cleared the photo
      // or used Twitter while we were uploading
      if (result.ok && this.state.photoUrl !== '') {
        this.setState({
          photoUrl: body.publicUrl,
          photoCloudObject: body.object,
          uploading: false,
        })
      }
    } catch (err) {
      console.log(err)
      this.setState({ photoUrl: '', photoCloudObject: null, uploading: false })
    }
  }

  // Handle form submit and trigger mutation
  submitted = async e => {
    e.preventDefault()

    const {
      firstName,
      lastName,
      twitterHandle,
      placeId,
      timezone,
      photoUrl,
      photoCloudObject,
    } = this.state

    if (!firstName || (!placeId && !timezone)) {
      return false
    }

    await this.props.addManualPerson({
      firstName,
      lastName,
      twitterHandle,
      placeId,
      // for utc
      timezone,
      photoUrl,
      photoCloudObject,
    })
    this.setState({ ...initialState, submitted: true })

    const sender = electron.ipcRenderer || false

    if (!sender) {
      return
    }

    // Refresh the main window to reflect the change
    sender.send('reload-main')

    return false
  }
}

const AddPerson = mutation(gql`
  mutation(
    $firstName: String!
    $lastName: String
    $placeId: ID
    $timezone: String
    $photoUrl: String
    $twitterHandle: String
    $photoCloudObject: String
  ) {
    addManualPerson(
      firstName: $firstName
      lastName: $lastName
      placeId: $placeId
      timezone: $timezone
      photoUrl: $photoUrl
      twitterHandle: $twitterHandle
      photoCloudObject: $photoCloudObject
    ) {
      id
      photoUrl
      timezone
      city
      firstName
      lastName
    }
  }
`)

export default ConnectHOC({
  mutation: {
    addManualPerson: AddPerson,
  },
})(Person)
