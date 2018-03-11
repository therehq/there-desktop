// Modules
import React, { Component } from 'react'
import { Connect, mutation } from 'urql'

// Local
import gql from '../../../utils/graphql/gql'
import { unsplash, toJson } from '../../../utils/unsplash'
import { StyledButton } from '../../Link'
import Heading from '../../window/Heading'
import Desc from '../../window/Desc'
import PlaceForm from './PlaceForm'
import { Center, FlexWrapper, LinkWrapper } from '../helpers'

class PlacePage extends Component {
  state = {
    name: '',
    photoUrl: null,
    location: null,
    nameUsedForLastPhoto: '',
    photoRefreshTimes: 0,
    error: null,
  }

  render() {
    const { pageRouter } = this.props
    const { name, photoUrl, photoRefreshTimes, error } = this.state

    return (
      <FlexWrapper>
        <Center>
          <Heading>Add a Place</Heading>
          <Desc style={{ marginTop: 10, marginBottom: 20 }}>
            Your office, home town, farm, a secret vault 🙈, anything!
          </Desc>
        </Center>

        <Connect
          mutation={{
            addPlace: AddPlace,
          }}
          children={({ addPlace }) => (
            <PlaceForm
              name={name}
              photoUrl={photoUrl}
              photoDisabled={photoRefreshTimes >= 3}
              onPhotoClick={this.photoClicked}
              onNameChange={this.nameChanged}
              onLocationPick={this.locationPicked}
              onFormSubmit={e => this.formSubmitted(addPlace, e)}
              error={error}
            />
          )}
        />

        <LinkWrapper>
          or{' '}
          <StyledButton onClick={() => pageRouter.goToSearchUsers()}>
            Search Users
          </StyledButton>{' '}
          instead!
        </LinkWrapper>
      </FlexWrapper>
    )
  }

  photoClicked = async () => {
    const { name, nameUsedForLastPhoto, photoRefreshTimes } = this.state

    // Stop if limit is reached
    if (photoRefreshTimes >= 3) {
      return
    }

    // If it's the first time we are trying to get a photo,
    // use query with place name
    if (name !== nameUsedForLastPhoto) {
      const photoWithQuery = await this.getRandomPhoto(name)
      // Save it only if there was a photo matched the query
      if (photoWithQuery !== null) {
        this.setState({
          photoUrl: photoWithQuery,
          nameUsedForLastPhoto: name,
          photoRefreshTimes: photoRefreshTimes + 1,
        })
        return
      }
    }

    // Get without query
    const photoUrlWOQuery = await this.getRandomPhoto()
    // Save it only if there was a photo
    if (photoUrlWOQuery !== null) {
      this.setState({
        photoUrl: photoUrlWOQuery,
        photoRefreshTimes: photoRefreshTimes + 1,
      })
    }
  }

  getRandomPhoto = async query => {
    try {
      const { urls: { custom } } = await unsplash.photos
        .getRandomPhoto({
          width: 80,
          height: 80,
          query: query || 'object',
          featured: !query,
        })
        .then(toJson)
      return custom
    } catch (e) {
      console.log(e)
      return null
    }
  }

  nameChanged = e => {
    this.setState({ name: e.target.value, error: null })
  }

  locationPicked = place => {
    this.setState({ location: place, error: null })
  }

  formSubmitted = (addPlace, e) => {
    e.preventDefault()

    const { name, photoUrl, location } = this.state
    // Validate data
    if (name.trim() === '' || !location) {
      this.setState({ error: 'Can you type in again? Thanks!' })
      return
    }

    console.log(photoUrl)
    addPlace({ name, photoUrl, placeId: location.placeId })

    // For preventing default
    return false
  }
}

export default PlacePage

const AddPlace = mutation(gql`
  mutation($name: String!, $placeId: ID!, $photoUrl: String) {
    addManualPlace(name: $name, placeId: $placeId, photoUrl: $photoUrl) {
      id
      name
      timezone
      city
      fullLocation
      photoUrl
    }
  }
`)
