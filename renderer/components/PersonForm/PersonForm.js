// Packages
import { Component, Fragment } from 'react'
import styled from 'styled-components'

// Local
import TwitterLogo from '../../vectors/TwitterLogo'
import Close from '../../vectors/Close'
import Input from '../form/Input'
import Button from '../form/Button'
import FormRow from '../form/Row'
import Label from '../form/Label'
import ErrorText from '../form/ErrorText'
import LocationPicker from '../LocationPicker'
import ButtonWrapper from '../form/ButtonWrapper'
import PhotoSelector, { PhotoOptions, PhotoBtn } from '../PhotoSelector'

export const photoModes = {
  TWITTER: 'twitter',
  UPLOAD: 'upload',
}

class PersonForm extends Component {
  render() {
    const {
      fetching,
      error,
      firstName,
      lastName,
      twitterHandle,
      locationInputValue,
      photoUrl,
      uploading,
      photoMode,
      placeId,
      // Event handlers
      onPhotoFileAccept,
      onPhotoClear,
      onPhotoModeChange,
      onFirstNameChange,
      onLastNameChange,
      onLocationInputValueChange,
      onLocationPick,
      onTwitterChange,
      onSubmit,
      ...props
    } = this.props

    return (
      <Wrapper {...props}>
        <PhotoWrapper>
          <PhotoSelector
            uploading={uploading}
            photoUrl={photoUrl}
            onAccept={onPhotoFileAccept}
          />
          <PhotoOptions>
            {photoUrl && (
              <PhotoBtn onClick={onPhotoClear}>
                <Close width="10" height="10" />
              </PhotoBtn>
            )}
            {photoMode !== photoModes.TWITTER && (
              <PhotoBtn
                data-wenk-dark={true}
                data-wenk="Photo from Twitter"
                data-wenk-pos="bottom"
                onClick={() => onPhotoModeChange(photoModes.TWITTER)}
              >
                <TwitterLogo width="13" height="13" />
              </PhotoBtn>
            )}
          </PhotoOptions>
        </PhotoWrapper>

        <Form onSubmit={onSubmit}>
          <FormRow>
            <Input
              required={true}
              style={{ maxWidth: 140 }}
              placeholder="First Name"
              value={firstName}
              onChange={onFirstNameChange}
            />
            <Input
              style={{ maxWidth: 90 }}
              placeholder="Last Name"
              value={lastName}
              onChange={onLastNameChange}
            />
          </FormRow>

          <Spacing />
          <Label label="City" secondary="(time is determined based on it)">
            <LocationPicker
              textAlign="left"
              placeholder="e.g. London"
              style={{ width: 240 }}
              inputValue={locationInputValue}
              onInputValueChange={onLocationInputValueChange}
              onPick={onLocationPick}
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
                onChange={onTwitterChange}
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
      </Wrapper>
    )
  }
}

export default PersonForm

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
