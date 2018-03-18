// Packages
import electron from 'electron'
import { Component } from 'react'
import styled from 'styled-components'
import { ConnectHOC, mutation } from 'urql'
import debounce from 'just-debounce-it'

// Utilities
import gql from '../../../utils/graphql/gql'
import { closeWindowAndShowMain } from '../../../utils/windows/helpers'

// Local
import Input from '../../form/Input'
import Button from '../../form/Button'
import FormRow from '../../form/Row'
import Label from '../../form/Label'
import LocationPicker from '../../LocationPicker'
import ErrorText from '../../form/ErrorText'
import ButtonWrapper from '../../form/ButtonWrapper'
import NotificationBox from '../../NotificationBox'
import { StyledButton } from '../../Link'

const initialState = {
  firstName: '',
  lastName: '',
  twitterHandle: '',
  locationInputValue: '',
  placeId: null,
  photoUrl: '',
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
      placeId,
      submitted,
    } = this.state

    return (
      <Wrapper {...props}>
        <Photo>{photoUrl && <img src={photoUrl} />}</Photo>
        <Form onSubmit={this.submitted}>
          <FormRow>
            <Input
              required={true}
              style={{ maxWidth: 120 }}
              placeholder="First Name"
              value={firstName}
              onChange={this.firstNameChanged}
            />
            <Input
              style={{ maxWidth: 120 }}
              placeholder="Last Name"
              value={lastName}
              onChange={this.lastNameChanged}
            />
          </FormRow>
          <Spacing />
          <Input
            fullWidth={true}
            placeholder="Twitter (for photo)"
            iconComponent={AtSign}
            value={twitterHandle}
            onChange={this.twitterChanged}
          />
          <Spacing />
          <Label label="City" secondary="(time is determined based on it)">
            <LocationPicker
              textAlign="left"
              placeholder="e.g. London"
              inputValue={locationInputValue}
              onInputValueChange={this.locationInputValueChanged}
              onPick={this.locationPicked}
            />
          </Label>
          <ButtonWrapper isHidden={!firstName || !placeId}>
            {error && <ErrorText>🤔 Try again please!</ErrorText>}
            <Button disabled={fetching}>
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
  }, 1000)

  // Handle form submit and trigger mutation
  submitted = e => {
    e.preventDefault()

    const { firstName, lastName, twitterHandle, placeId, photoUrl } = this.state

    if (!firstName || !placeId) {
      return false
    }

    this.props.addManualPerson({
      firstName,
      lastName,
      twitterHandle,
      placeId,
      photoUrl,
    })
    this.setState({ submitted: true })

    return false
  }

  componentWillReceiveProps({ fetching, error }) {
    // Check if place was added successfully...
    // ...(Following condition means form has been
    // successfully submitted)
    if (!error && !fetching && this.state.submitted) {
      this.setState(initialState)

      const sender = electron.ipcRenderer || false

      if (!sender) {
        return
      }

      // Refresh the main window to reflect the change
      sender.send('reload-main')
    }
  }
}

const AddPerson = mutation(gql`
  mutation(
    $firstName: String!
    $lastName: String
    $placeId: ID!
    $photoUrl: String
    $twitterHandle: String
  ) {
    addManualPerson(
      firstName: $firstName
      lastName: $lastName
      placeId: $placeId
      photoUrl: $photoUrl
      twitterHandle: $twitterHandle
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

const Photo = styled.div`
  --size: 45px;

  flex: 0 0 auto;
  width: var(--size);
  height: var(--size);
  margin-right: 18px;
  margin-top: 5px;
  overflow: hidden;

  background: linear-gradient(45deg, #eee 0%, #f7f7f7 100%);
  border-radius: var(--size);

  img {
    display: block;
    width: var(--size);
    height: auto;
  }
`

const Form = styled.form`
  display: block;
  flex: 1 1 auto;
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
