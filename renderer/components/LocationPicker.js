import { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { query } from 'urql'
import Downshift from 'downshift'
import Raven from 'raven-js'
import debounce from 'just-debounce-it'

// Utilities
import { client } from '../utils/urql/client'
import gql from '../utils/graphql/gql'

// Local
import Input from './form/Input'

class LocationPicker extends Component {
  static defaultProps = {
    onPick: () => {},
    onInputChange: () => {},
  }

  inputValueChangeCount = 0

  state = {
    fetching: false,
    loaded: false,
    placesAutoComplete: {},
  }

  render() {
    const {
      grabFocusOnRerender = false,
      inputValue,
      onInputValueChange,
      onInputChange,
      ...props
    } = this.props
    const { loaded, placesAutoComplete, fetching } = this.state

    return (
      <Downshift
        itemToString={place => (place ? place.description : '')}
        inputValue={inputValue}
        onInputValueChange={onInputValueChange}
        onChange={this.placePicked}
        render={({
          getRootProps,
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => {
          const isUTCTyped = inputValue.trim().toLowerCase() === 'utc'

          return (
            <Wrapper {...getRootProps({ refKey: 'innerRef' })}>
              <Input
                {...getInputProps({
                  onChange: e => {
                    const value = e.target.value
                    if (!value) {
                      return
                    }

                    // Increment counter so we can spot
                    // out of sync results
                    this.inputValueChangeCount++

                    onInputChange()
                    this.fetchPlaces(value)
                  },
                })}
                style={{ minWidth: 300 }}
                innerRef={ref => {
                  if (ref && grabFocusOnRerender) {
                    ref.focus()
                  }
                }}
                textAlign="center"
                value={inputValue}
                placeholder="Which city are you in?"
                {...props}
              />
              <List>
                {/* If user wants UTC, only show UTC */}
                {isUTCTyped &&
                  isOpen && (
                    <ListItem
                      {...getItemProps({
                        // no placeId
                        item: { description: 'UTC', timezone: 'UTC' },
                      })}
                      key={'UTC'}
                      highlighted={highlightedIndex === 0}
                    >
                      UTC (GMT)
                    </ListItem>
                  )}

                {inputValue.trim() !== '' &&
                  !isUTCTyped &&
                  isOpen &&
                  loaded &&
                  placesAutoComplete.map((place, i) => (
                    <ListItem
                      {...getItemProps({ item: place })}
                      key={i}
                      highlighted={highlightedIndex === i}
                    >
                      {place.description}
                    </ListItem>
                  ))}

                {fetching && <Loading />}
              </List>
            </Wrapper>
          )
        }}
      />
    )
  }

  fetchPlaces = debounce(async value => {
    this.setState({ fetching: true })
    const currentChangeCount = this.inputValueChangeCount

    try {
      const { data: { placesAutoComplete } } = await client.executeQuery(
        query(AutoComplete, { query: value })
      )

      // If user has continued typing, do not show the out of sync result
      if (currentChangeCount === this.inputValueChangeCount) {
        this.setState({ loaded: true, fetching: false, placesAutoComplete })
      }
    } catch (err) {
      this.setState({ fetching: false })
      Raven.captureException(err)
      console.log(err)
    }
  }, 260)

  placePicked = ({ description, placeId, timezone }) => {
    this.props.onPick({ description, placeId, timezone })
  }
}

const AutoComplete = gql`
  query($query: String!) {
    placesAutoComplete(query: $query) {
      description
      placeId
    }
  }
`

export default LocationPicker

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

const List = styled.div.attrs({
  className: 'ignore-react-onclickoutside',
})`
  width: 100%;
  max-height: 100px;
  overflow: auto;
  position: absolute;
  left: 50%;
  z-index: ${p => p.theme.sizes.dropDownZIndex};
  transform: translateX(-50%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  background: white;
`

const ListItem = styled.div`
  width: 100%;
  padding: 7px 10px;

  font-size: 14px;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: background 200ms cubic-bezier(0.19, 1, 0.22, 1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: ${p => (p.highlighted ? `rgba(0, 0, 0, 0.05)` : `transparent`)};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Loading = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;

  width: 10px;
  height: 10px;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-right: none;
  animation: ${spin} 3s 0s infinite;
`
