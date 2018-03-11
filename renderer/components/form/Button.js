import styled, { css } from 'styled-components'
import { darken } from 'polished'

import { transition } from '../../utils/styles/mixins'

export default ({ disabled, ...props }) => (
  <Button disabledStyle={disabled} disabled={disabled} {...props} />
)

const Button = styled.button`
  padding: 7px 12px;
  font-size: 16px;
  background: transparent;
  border: none;
  outline: none;
  color: blue;
  cursor: pointer;
  border-radius: 5px;

  ${transition('background', 'color')};

  &:hover,
  &:focus {
    background: ${p => p.theme.colors.subtle};
    color: ${darken(0.2, 'blue')};
  }

  ${p =>
    p.disabledStyle &&
    css`
      color: #777;
      background: ${p => p.theme.colors.subtle};
      cursor: default;

      &:hover {
        color: #777;
      }
    `};
`
