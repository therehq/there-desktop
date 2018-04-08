import { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Local
import UnsplashLogo from '../../vectors/UnsplashLogo'
import Close from '../../vectors/Close'
import Input from '../form/Input'
import Label from '../form/Label'
import Button from '../form/Button'
import ErrorText from '../form/ErrorText'
import LocationPicker from '../LocationPicker'
import ButtonWrapper from '../form/ButtonWrapper'
import PhotoSelector, { PhotoOptions, PhotoBtn } from '../PhotoSelector'
import ExternalLink from '../ExternalLink'

class PlaceForm extends Component {
  static propTypes = {
    // Unsplash photo shape
    photo: PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string,
    }),
  }

  render() {
    const {
      loading,
      error,
      name,
      locationInputValue,
      photo,
      uploading,
      fetchingUnsplash,
      // Event handlers
      onNameChange,
      onLocationPick,
      onLocationInputValueChange,
      onFormSubmit,
      onPhotoClear,
      onUnsplashClick,
      onPhotoFileAccept,
      ...props
    } = this.props

    return (
      <Wrapper {...props}>
        <PhotoWrapper>
          <PhotoSelector
            uploading={uploading || fetchingUnsplash}
            photoUrl={photo.url}
            onAccept={onPhotoFileAccept}
          />

          {photo.name && (
            <PhotoCaption>
              Photo by{' '}
              <ExternalLink
                href={`https://unsplash.com/${
                  photo.username
                }?utm_source=there&utm_medium=referral`}
              >
                {photo.name}
              </ExternalLink>{' '}
              on{' '}
              <ExternalLink href="https://unsplash.com/?utm_source=there&utm_medium=referral">
                Unsplash
              </ExternalLink>
            </PhotoCaption>
          )}

          <PhotoOptions>
            {photo.url && (
              <PhotoBtn onClick={onPhotoClear}>
                <Close width="10" height="10" />
              </PhotoBtn>
            )}

            <PhotoBtn
              data-wenk-dark={true}
              data-wenk="Photo from Unsplash"
              data-wenk-pos="bottom"
              onClick={onUnsplashClick}
            >
              <UnsplashLogo width="13" height="11.25" />
            </PhotoBtn>
          </PhotoOptions>
        </PhotoWrapper>

        <Form onSubmit={onFormSubmit}>
          <Label label="Name">
            <Input
              width="240px"
              value={name}
              placeholder="e.g. Europe Office"
              onChange={onNameChange}
            />
          </Label>
          <Spacing />
          <Label label="City" secondary="(time is determined based on it)">
            <LocationPicker
              width="240px"
              textAlign="left"
              placeholder="e.g. London"
              inputValue={locationInputValue}
              onInputValueChange={onLocationInputValueChange}
              onPick={onLocationPick}
            />
          </Label>

          <ButtonWrapper isHidden={!name}>
            {error && <ErrorText>{error}</ErrorText>}
            <Button disabled={loading}>{loading ? 'Saving...' : 'Add'}</Button>
          </ButtonWrapper>
        </Form>
      </Wrapper>
    )
  }
}

export default PlaceForm

const Wrapper = styled.div`
  display: flex;
  width: 390px;

  margin-top: 30px;
  margin-right: auto;
  margin-left: auto;

  @media (max-width: 350px) {
    width: auto;
  }
`

const PhotoWrapper = styled.div`
  flex: 0 1 auto;
  width: 180px;
  margin-right: 18px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const PhotoCaption = styled.div`
  margin-top: 10px;
  text-align: right;
  line-height: 1.1;
  font-size: 11px;
  color: #aaa;

  a {
    text-decoration: none;
    color: #888;

    &:hover {
      color: #555;
    }
  }
`

const Form = styled.form`
  display: block;
  flex: 1 1 auto;
  width: 100%;
`

const Spacing = styled.div`
  height: 12px;
`
