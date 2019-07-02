// Modules
import electron from 'electron'
import debounce from 'just-debounce-it'
import { Component } from 'react'
import { ConnectHOC, mutation, query } from 'urql'

// Utilities
import gql from '../../../utils/graphql/gql'
import { restEndpoint } from '../../../../config'
import { getPhotoUrl } from '../../../utils/photo'
import { uploadManualPhotoFile } from '../../../utils/api'
import { showMainWhenReady, closeWindow } from '../../../utils/windows/helpers'

// Local
import { StyledButton } from '../../Link'
import FlexWrapper from '../../window/FlexWrapper'
import PersonForm, { photoModes } from '../../PersonForm'
import NotificationBox from '../../NotificationBox'
import LoadingOverlay from '../LoadingOverlay'

const initialState = {
  firstName: '',
  lastName: '',
  twitterHandle: '',
  locationInputValue: '',
  placeId: null,

  photoUrl: '',
  photoCloudObject: null,
  uploading: false,
  photoMode: photoModes.UPLOAD,
}

class EditPerson extends Component {
  state = {
    ...initialState,
    submiting: false,
    submitted: false,
  }

  render() {
    const { fetching, loaded, error } = this.props
    const {
      firstName,
      lastName,
      twitterHandle,
      locationInputValue,
      photoUrl,
      uploading,
      photoMode,
      placeId,
      submiting,
      submitted,
    } = this.state

    return (
      <FlexWrapper>
        {!loaded && <LoadingOverlay />}

        <PersonForm
          error={error}
          fetching={submiting && fetching}
          firstName={firstName}
          lastName={lastName}
          twitterHandle={twitterHandle}
          locationInputValue={locationInputValue || ''}
          photoUrl={photoUrl}
          uploading={uploading}
          photoMode={photoMode}
          placeId={placeId}
          submitText="Save"
          allowSubmit={Boolean(firstName)}
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
          visible={error && !fetching && submitted}
          onCloseClick={() => this.setState({ submitted: false })}
        >
          👉 {String(error)}&nbsp;
          <StyledButton onClick={() => location.reload()}>Reload</StyledButton>
        </NotificationBox>
      </FlexWrapper>
    )
  }

  componentWillReceiveProps(comingProps) {
    const { data } = comingProps
    if (!this.props.data && data && data.manualPerson) {
      const {
        firstName,
        lastName,
        photoUrl: fetchedPhotoUrl,
        photoCloudObject,
        twitterHandle,
        fullLocation: locationInputValue,
      } = data.manualPerson
      const photoMode = twitterHandle ? photoModes.TWITTER : photoModes.UPLOAD
      const photoUrl = getPhotoUrl({
        twitterHandle,
        photoCloudObject,
        photoUrl: fetchedPhotoUrl,
      })

      this.setState({
        firstName,
        lastName,
        photoUrl,
        photoCloudObject,
        twitterHandle,
        locationInputValue,
        photoMode,
      })
    }
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
    this.setState({ photoMode })
  }

  twitterChanged = e => {
    const twitterHandle = e.target.value
    this.setState({ twitterHandle })
    // Fetch avatar in the background
    this.getAvatar(twitterHandle)
  }

  getAvatar = debounce(async twitter => {
    if (typeof window === 'undefined' || !twitter) {
      this.setState({ photoUrl: '', photoCloudObject: null })
      return
    }

    const result = await fetch(`${restEndpoint}/twivatar/${twitter}`)

    // Image not found
    if (!result.ok) {
      this.setState({ photoUrl: '', photoCloudObject: null })
      return
    }

    this.setState({
      photoUrl: `${restEndpoint}/twivatar/${twitter}`,
      photoCloudObject: null,
    })
  }, 500)

  photoCleared = () => {
    this.setState({
      uploading: false,
      photoUrl: '',
      twitterHandle: '',
      photoCloudObject: null,
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

    const { objectId } = this.props
    const {
      firstName,
      lastName,
      twitterHandle,
      placeId,
      timezone,
      photoUrl,
      photoCloudObject,
    } = this.state

    if (!firstName || !objectId) {
      return false
    }

    this.setState({ submiting: true })

    try {
      await this.props.updateManualPerson({
        id: objectId,
        firstName,
        lastName,
        twitterHandle,
        placeId,
        timezone,
        photoUrl,
        photoCloudObject,
      })

      this.setState({ ...initialState, submitted: true })
    } catch (err) {
      this.setState({ esubmitted: true })
      return false
    }

    const sender = electron.ipcRenderer || false

    if (!sender) {
      return
    }

    // Refresh the main window to reflect the change
    sender.send('reload-main')

    showMainWhenReady()
    closeWindow()

    return false
  }
}

const UpdatePerson = mutation(gql`
  mutation(
    $id: ID!
    $firstName: String!
    $lastName: String
    $placeId: ID
    $timezone: String
    $photoUrl: String
    $twitterHandle: String
    $photoCloudObject: String
  ) {
    updateManualPerson(
      id: $id
      firstName: $firstName
      lastName: $lastName
      placeId: $placeId
      timezone: $timezone
      photoUrl: $photoUrl
      twitterHandle: $twitterHandle
      photoCloudObject: $photoCloudObject
    ) {
      id
      firstName
      # There's no reason to get any data
    }
  }
`)

const GetPerson = gql`
  query($id: ID) {
    manualPerson(id: $id) {
      id
      firstName
      lastName
      twitterHandle
      photoUrl
      photoCloudObject
      fullLocation
    }
  }
`

export default ConnectHOC(props => ({
  query: query(GetPerson, { id: props.objectId }),
  mutation: {
    updateManualPerson: UpdatePerson,
  },
  cache: false,
}))(EditPerson)
