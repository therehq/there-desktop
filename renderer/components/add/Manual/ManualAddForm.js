// Packages
import electron from 'electron'
import { Component, Fragment } from 'react'
import { ConnectHOC, mutation } from 'urql'
import styled from 'styled-components'
import debounce from 'just-debounce-it'

// Utilities
import gql from '../../../utils/graphql/gql'
import { uploadManualPhotoFile } from '../../../utils/api'
import { closeWindowAndShowMain } from '../../../utils/windows/helpers'

// Local
import TwitterLogo from '../../../vectors/TwitterLogo'
import Close from '../../../vectors/Close'
import Input from '../../form/Input'
import Button from '../../form/Button'
import FormRow from '../../form/Row'
import Label from '../../form/Label'
import LocationPicker from '../../LocationPicker'
import ErrorText from '../../form/ErrorText'
import ButtonWrapper from '../../form/ButtonWrapper'
import NotificationBox from '../../NotificationBox'
import PhotoSelector from '../PhotoSelector'
import { StyledButton } from '../../Link'

const photoModes = {
  TWITTER: 'twitter',
  UPLOAD: 'upload',
}

const initialState = {
  firstName: '',
  lastName: '',
  twitterHandle: '',
  locationInputValue: '',
  placeId: null,

  photoUrl: '',
  photoCloudObject: '',
  uploading: false,
  photoMode: photoModes.UPLOAD,
}

class ManualAddForm extends Component {
  state = {
    ...initialState,
    submitted: false,
  }

  render() {
    const { fetching, error, ...props } = this.props
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
      <Wrapper {...props}>
        <PhotoWrapper>
          <PhotoSelector
            uploading={uploading}
            photoUrl={photoUrl}
            onAccept={this.photoFileAccepted}
          />
          <PhotoOptions>
            {photoUrl && (
              <PhotoBtn onClick={this.photoCleared}>
                <Close width="10" height="10" />
              </PhotoBtn>
            )}
            {photoMode !== photoModes.TWITTER && (
              <PhotoBtn
                data-wenk-dark={true}
                data-wenk="Photo From Twitter"
                data-wenk-pos="bottom"
                onClick={() => this.setState({ photoMode: photoModes.TWITTER })}
              >
                <TwitterLogo width="13" height="13" />
              </PhotoBtn>
            )}
          </PhotoOptions>
        </PhotoWrapper>

        <Form onSubmit={this.submitted}>
          <FormRow>
            <Input
              required={true}
              style={{ maxWidth: 140 }}
              placeholder="First Name"
              value={firstName}
              onChange={this.firstNameChanged}
            />
            <Input
              style={{ maxWidth: 90 }}
              placeholder="Last Name"
              value={lastName}
              onChange={this.lastNameChanged}
            />
          </FormRow>

          <Spacing />
          <Label label="City" secondary="(time is determined based on it)">
            <LocationPicker
              textAlign="left"
              placeholder="e.g. London"
              style={{ width: 240 }}
              inputValue={locationInputValue}
              onInputValueChange={this.locationInputValueChanged}
              onPick={this.locationPicked}
            />
          </Label>

          {photoMode === photoModes.TWITTER && (
            <Fragment>
              <Spacing />
              <Input
                fullWidth={true}
                placeholder="Twitter (for photo)"
                iconComponent={AtSign}
                value={twitterHandle}
                onChange={this.twitterChanged}
              />
            </Fragment>
          )}

          <ButtonWrapper isHidden={!firstName || !placeId}>
            {error && <ErrorText>🤔 Try again please!</ErrorText>}
            <Button disabled={fetching || uploading}>
              {fetching ? 'Saving...' : 'Add'}
            </Button>
          </ButtonWrapper>
        </Form>

        <NotificationBox
          visible={!error && !fetching && submitted}
          onCloseClick={() => this.setState({ submitted: false })}
        >
          💫 Added to the list!{' '}
          <StyledButton onClick={this.closeWindow}>Close Window</StyledButton>{' '}
          or add more!
        </NotificationBox>
      </Wrapper>
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

  locationPicked = ({ placeId }) => {
    this.setState({ placeId, notFilled: false })
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

    const result = await fetch(`https://twivatar.glitch.me/${twitter}`)

    // Image not found
    if (!result.ok) {
      this.setState({ photoUrl: '' })
      return
    }

    this.setState({ photoUrl: `https://twivatar.glitch.me/${twitter}` })
  }, 500)

  photoCleared = () => {
    this.setState({
      uploading: false,
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
      this.setState({ photoUrl: '', uploading: false })
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
      photoUrl,
      photoCloudObject,
    } = this.state

    if (!firstName || !placeId) {
      return false
    }

    await this.props.addManualPerson({
      firstName,
      lastName,
      twitterHandle,
      placeId,
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
    $placeId: ID!
    $photoUrl: String
    $twitterHandle: String
    $photoCloudObject: String
  ) {
    addManualPerson(
      firstName: $firstName
      lastName: $lastName
      placeId: $placeId
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
})(ManualAddForm)

const Wrapper = styled.div`
  display: flex;
  max-width: 300px;

  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;
`

const Form = styled.form`
  display: block;
  flex: 1 1 auto;
`

const PhotoWrapper = styled.div`
  flex: 0 0 auto;
  margin-right: 18px;
  margin-top: 5px;
`

const PhotoOptions = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PhotoBtn = styled.button`
  display: block;
  line-height: 1;
  padding: 5px 0;
  width: 21px;
  text-align: center;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
  border: none;
  transition: all 150ms ease;

  path {
    fill: #aaa;
  }

  &:hover {
    background: #eee;
  }
`

const Spacing = styled.div`
  height: 12px;
`

const AtSign = styled.span`
  display: inline-block;
  line-height: 1;

  :before {
    content: '@';
    vertical-align: 2px;
  }
`
