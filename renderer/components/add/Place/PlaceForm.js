import { Component } from 'react'
import styled, { css } from 'styled-components'

import Input from '../../form/Input'
import Label from '../../form/Label'
import Button from '../../form/Button'
import ErrorText from '../../form/ErrorText'
import LocationPicker from '../../LocationPicker'
import ButtonWrapper from '../../form/ButtonWrapper'
import ExternalLink from '../../ExternalLink'

class PlaceForm extends Component {
  render() {
    const {
      name,
      photo,
      photoDisabled,
      locationInputValue,
      onPhotoClick,
      onNameChange,
      onLocationPick,
      onLocationInputValueChange,
      onFormSubmit,
      loading,
      error,
      ...props
    } = this.props

    return (
      <Wrapper {...props}>
        <PhotoWrapper>
          <Photo
            disabled={photoDisabled}
            onClick={photoDisabled ? undefined : onPhotoClick}
          >
            {console.log(photo) || (photo.url && <img src={photo.url} />)}
            <PhotoRefresh />
          </Photo>
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

const PhotoRefresh = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  cursor: pointer;
  opacity: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 150ms ease;

  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;

  &::after {
    content: '⟳';
    position: relative;
    top: -2px;
    left: 1px;
    line-height: 1;
    color: white;
    transition: transform 100ms ease-in;
    transform-origin: 47% 57%;
  }

  &:active {
    &::after {
      transform: rotate(270deg);
    }
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

const Photo = styled.div`
  --size: 45px;

  flex: 0 0 auto;
  width: var(--size);
  height: var(--size);
  margin-top: 5px;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  background: linear-gradient(45deg, #eee 0%, #f7f7f7 100%);
  border-radius: var(--size);

  img {
    display: block;
    width: var(--size);
    height: auto;
  }

  &:hover {
    &:after {
      opacity: 0;
    }
  }

  &::after {
    content: '+';
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 18px;
    color: ${p => p.theme.colors.grayText};
    opacity: 1;
    transition: opacity 150ms ease;
  }

  ${p =>
    !p.disabled &&
    css`
      &:hover {
        ${PhotoRefresh} {
          opacity: 1;
        }
      }
    `};
`

const PhotoCaption = styled.p`
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
