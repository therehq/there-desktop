import { Component } from 'react'
import styled, { css } from 'styled-components'

import Input from '../../form/Input'
import Label from '../../form/Label'
import Button from '../../form/Button'
import ErrorText from '../../form/ErrorText'
import LocationPicker from '../../LocationPicker'

class PlaceForm extends Component {
  render() {
    const {
      name,
      photoUrl,
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
        <Photo
          disabled={photoDisabled}
          onClick={photoDisabled ? undefined : onPhotoClick}
        >
          {photoUrl && <img src={photoUrl} />}
          <PhotoRefresh />
        </Photo>
        <Form onSubmit={onFormSubmit}>
          <Label label="Name">
            <Input
              fullWidth={true}
              value={name}
              placeholder="e.g. Europe Office"
              onChange={onNameChange}
            />
          </Label>
          <Spacing />
          <Label label="City" secondary="(time is determined based on it)">
            <LocationPicker
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
  width: 300px;

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

const Photo = styled.div`
  --size: 45px;

  flex: 0 0 auto;
  width: var(--size);
  height: var(--size);
  margin-right: 18px;
  margin-top: 5px;
  position: relative;
  overflow: hidden;

  background: linear-gradient(45deg, #eee 0%, #f7f7f7 100%);
  border-radius: var(--size);

  img {
    display: block;
    width: var(--size);
    height: auto;
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

const Form = styled.form`
  display: block;
  flex: 1 1 auto;
  width: 100%;
`

const Spacing = styled.div`
  height: 12px;
`

const ButtonWrapper = styled.div`
  margin-top: 15px;
  text-align: right;
  visibility: visible;
  opacity: 1;
  transition: opacity 100ms ease-out, visibility 150ms ease-out;

  ${p =>
    p.isHidden &&
    css`
      visibility: hidden;
      opacity: 0;
    `};
`
