import { Component } from 'react'
import styled, { css } from 'styled-components'

import { transition } from '../utils/mixins'

class Input extends Component {
  constructor(props) {
    super(props)
    this.hasIcon = 'iconComponent' in props
  }

  state = {
    isFocused: false,
  }

  render() {
    const {
      iconComponent: Icon = <span />,
      textAlign = 'inherit',
      ...props
    } = this.props

    const { isFocused } = this.state

    return (
      <Wrapper isFocused={isFocused} {...props}>
        {this.hasIcon && (
          <IconWrapper isFocused={isFocused}>
            <Icon />
          </IconWrapper>
        )}

        <FormInput
          style={{ textAlign }}
          placeholder="Name"
          onFocus={this.focused}
          onBlur={this.blured}
        />
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

export default Input

const focusedBorderColor = p => p.theme.colors.lighter

const Wrapper = styled.div`
  display: inline-flex;
  width: 100%;

  border-bottom: 1px solid ${p => (p.isFocused ? focusedBorderColor : '#ddd')};

  ${transition('border-bottom')};

  &:hover {
    border-bottom-color: ${p => (p.isFocused ? focusedBorderColor : '#aaa')};
  }
`

const IconWrapper = styled.div`
  display: inline-block;
  align-self: center;
  margin-right: 10px;
  padding-top: 1px;

  svg {
    max-height: 19px;
    width: auto;

    path {
      fill: ${p => (p.isFocused ? '#888' : '#aaa')};
    }
  }
`

const FormInput = styled.input`
  display: block;
  flex: 1 1 auto;

  border: none;
  outline: none;
  background: none;

  font-size: 19px;
  line-height: 1.3;
  padding: 6px 0;

  &::placeholder {
    color: #b2b2b2;
  }
`
