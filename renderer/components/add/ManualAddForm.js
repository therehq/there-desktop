import { Component } from 'react'
import styled from 'styled-components'

import Input from '../Input'

class ManualAddForm extends Component {
  render() {
    const { ...props } = this.props
    return <Wrapper {...props} />
  }
}

export default ManualAddForm

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
