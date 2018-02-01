import { Component } from 'react'
import styled from 'styled-components'

class List extends Component {
  render() {
    const { ...props } = this.props

    return <Wrapper {...props} />
  }
}

export default List

const Wrapper = styled.div``
