import { Component } from 'react'
import styled from 'styled-components'

import { transition } from '../../utils/mixins'

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
      wrapperProps,
      big = false,
      fullWidth = false,
      ...props
    } = this.props

    const { isFocused } = this.state

    return (
      <Wrapper
        isFocused={isFocused}
        big={big}
        fullWidth={fullWidth}
        {...wrapperProps}
      >
        {this.hasIcon && (
          <IconWrapper isFocused={isFocused} big={big}>
            <Icon />
          </IconWrapper>
        )}

        <FormInput
          big={big}
          style={{ textAlign }}
          onFocus={this.focused}
          onBlur={this.blured}
          {...props}
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
  flex: 1 1 auto;
  width: ${p => (p.fullWidth ? '100%' : 'auto')};

  border-bottom: 1px solid ${p => (p.isFocused ? focusedBorderColor : '#ddd')};

  ${transition('border-bottom')};

  &:hover {
    border-bottom-color: ${p => (p.isFocused ? focusedBorderColor : '#aaa')};
  }
`

const IconWrapper = styled.div`
  display: inline-block;
  align-self: center;
  margin-right: ${p => (p.big ? 10 : 5)}px;
  padding-top: 1px;

  /* for text icons */
  color: ${p => (p.isFocused ? '#888' : '#aaa')};

  svg {
    max-height: ${p => (p.big ? 19 : 14)}px;
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

  line-height: 1.3;
  font-size: ${p => (p.big ? 19 : 15)}px;
  padding: ${p => (p.big ? 6 : 4)}px 0;

  &::placeholder {
    color: #b2b2b2;
  }
`
