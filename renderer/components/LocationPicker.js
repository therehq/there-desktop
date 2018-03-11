import { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { Connect, query } from 'urql'
import Downshift from 'downshift'

// Utilities
import gql from '../utils/graphql/gql'

// Local
import Input from './form/Input'

class LocationPicker extends Component {
  static defaultProps = {
    onPick: () => {},
  }

  render() {
    const {
      grabFocusOnRerender = false,
      inputValue,
      onInputValueChange,
      ...props
    } = this.props

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
        }) => (
          <Wrapper {...getRootProps({ refKey: 'innerRef' })}>
            <Input
              {...getInputProps()}
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
            {inputValue.trim() !== '' && (
              <Connect query={query(AutoComplete, { query: inputValue })}>
                {({ fetching, loaded, data }) => (
                  <List>
                    {isOpen &&
                      loaded &&
                      data.placesAutoComplete.map((place, i) => (
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
                )}
              </Connect>
            )}
          </Wrapper>
        )}
      />
    )
  }

  placePicked = ({ description, placeId }) => {
    this.props.onPick({ description, placeId })
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
`

const List = styled.div.attrs({
  className: 'ignore-react-onclickoutside',
})`
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
  min-width: 300px;
  padding: 7px 10px;

  font-size: 15px;
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
