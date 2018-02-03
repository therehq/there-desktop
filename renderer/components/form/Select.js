import { Component } from 'react'
import styled from 'styled-components'

import { transition } from '../../utils/mixins'

class Select extends Component {
  state = {
    isFocused: false,
  }

  render() {
    const { wrapperProps, fullWidth = false, ...props } = this.props

    const { isFocused } = this.state

    return (
      <Wrapper isFocused={isFocused} fullWidth={fullWidth} {...wrapperProps}>
        <FormSelect onFocus={this.focused} onBlur={this.blured} {...props} />
      </Wrapper>
    )
  }

  focused = () => {
    this.setState({ isFocused: true })
  }

  blured = () => {
    this.setState({ isFocused: false })
  }
}

export default Select

const focusedBorderColor = p => p.theme.colors.lighter

const Wrapper = styled.div`
  display: inline-flex;
  flex: 1 1 auto;
  width: ${p => (p.fullWidth ? '100%' : 'auto')};
`

const FormSelect = styled.select`
  display: block;
  flex: 1 1 auto;
  height: 32px;

  border: 1px solid #ddd;
  outline: none;
  background: none;
  color: ${p => p.theme.colors.darkText};

  line-height: 1.3;
  font-size: 15px;
  padding: 8px 0;

  ${transition('border', 'color')};

  &::placeholder {
    color: #b2b2b2;
  }

  &:hover,
  &:focus {
    border: 1px solid ${focusedBorderColor};
    color: black;
  }
`
