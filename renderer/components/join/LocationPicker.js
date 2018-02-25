import { Component } from 'react'
import styled from 'styled-components'
import Input from '../form/Input'

class LocationPicker extends Component {
  render() {
    const { ...props } = this.props
    return (
      <Wrapper>
        <Input {...props} />
        <List />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: relative;
`

const List = styled.div`
  position: relative;
  margin-top: 10px;
`

export default LocationPicker
